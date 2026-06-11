import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendInvitationEmail } from "@/lib/email";
import { nanoid } from "nanoid";
import { z } from "zod";

const inviteSchema = z.object({
  workspace_id: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(["admin", "member"]).optional(),
});

const acceptSchema = z.object({
  token: z.string().min(1),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = inviteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { data: existingMember } = await supabase
    .from("saas_members")
    .select("id")
    .eq("workspace_id", parsed.data.workspace_id)
    .eq("user_id", user.id)
    .single();

  if (!existingMember) {
    return NextResponse.json({ error: "Not a workspace member" }, { status: 403 });
  }

  const token = nanoid(32);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: invitation, error } = await supabase
    .from("saas_invitations")
    .insert({
      workspace_id: parsed.data.workspace_id,
      email: parsed.data.email,
      role: parsed.data.role ?? "member",
      token,
      expires_at: expiresAt,
    })
    .select()
    .single();

  if (error) {
    if (error.message.includes("unique") || error.message.includes("duplicate")) {
      return NextResponse.json(
        { error: "An invitation for this email already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: ws } = await supabase
    .from("saas_workspaces")
    .select("name")
    .eq("id", parsed.data.workspace_id)
    .single();

  if (ws) {
    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${token}`;
    await sendInvitationEmail(parsed.data.email, ws.name, inviteUrl);
  }

  return NextResponse.json(invitation, { status: 201 });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = acceptSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Token required" }, { status: 400 });
  }

  const adminClient = createAdminClient();

  const { data: invitation } = await adminClient
    .from("saas_invitations")
    .select("*")
    .eq("token", parsed.data.token)
    .single();

  if (!invitation) {
    return NextResponse.json({ error: "Invalid invitation" }, { status: 404 });
  }

  if (new Date(invitation.expires_at) < new Date()) {
    return NextResponse.json({ error: "Invitation expired" }, { status: 410 });
  }

  const { error: memberError } = await adminClient
    .from("saas_members")
    .insert({
      workspace_id: invitation.workspace_id,
      user_id: user.id,
      role: invitation.role,
    });

  if (memberError) {
    if (memberError.message.includes("unique") || memberError.message.includes("duplicate")) {
      await adminClient.from("saas_invitations").delete().eq("id", invitation.id);
      return NextResponse.json({ error: "Already a member" }, { status: 409 });
    }
    return NextResponse.json({ error: memberError.message }, { status: 500 });
  }

  await adminClient.from("saas_invitations").delete().eq("id", invitation.id);

  const { data: ws } = await adminClient
    .from("saas_workspaces")
    .select("slug")
    .eq("id", invitation.workspace_id)
    .single();

  return NextResponse.json({ workspace_slug: ws?.slug ?? "" });
}
