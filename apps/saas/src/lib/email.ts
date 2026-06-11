import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  if (!resend) {
    console.warn("RESEND_API_KEY not configured, skipping email");
    return;
  }

  try {
    await resend.emails.send({
      from: "Tracker <notifications@resend.dev>",
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("Failed to send email:", err);
  }
}

export async function sendAssignmentEmail(
  to: string,
  issueTitle: string,
  workspaceName: string,
  issueUrl: string
) {
  await sendEmail({
    to,
    subject: `[${workspaceName}] You were assigned: ${issueTitle}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">New Assignment</h2>
        <p>You've been assigned to an issue in <strong>${workspaceName}</strong>:</p>
        <div style="background: #f4f4f5; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="font-weight: 600; margin: 0;">${issueTitle}</p>
        </div>
        <a href="${issueUrl}" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 8px;">
          View Issue
        </a>
      </div>
    `,
  });
}

export async function sendInvitationEmail(
  to: string,
  workspaceName: string,
  inviteUrl: string
) {
  await sendEmail({
    to,
    subject: `You're invited to join ${workspaceName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">Workspace Invitation</h2>
        <p>You've been invited to join <strong>${workspaceName}</strong> on Tracker.</p>
        <a href="${inviteUrl}" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 16px;">
          Accept Invitation
        </a>
        <p style="color: #71717a; font-size: 12px; margin-top: 24px;">
          This invitation will expire in 7 days.
        </p>
      </div>
    `,
  });
}
