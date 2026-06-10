"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Copy, Check, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";
import type { TemplateConfig } from "@/lib/templates";
import { buildPromptFromForm } from "@/lib/templates";

export function GenerateClient({ template }: { template: TemplateConfig }) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat" }),
    []
  );

  const { messages, sendMessage, status, error, setMessages } = useChat({
    transport,
  });

  const isStreaming = status === "streaming" || status === "submitted";

  const handleGenerate = useCallback(() => {
    const hasValues = template.inputFields.some(
      (f) => formData[f.name]?.trim()
    );
    if (!hasValues) {
      toast.error("Please fill in at least one field");
      return;
    }

    setMessages([]);
    const prompt = buildPromptFromForm(template, formData);
    sendMessage(
      { text: prompt },
      { body: { template: template.slug, inputData: formData } }
    );
  }, [template, formData, setMessages, sendMessage]);

  const latestAssistant = messages.filter((m) => m.role === "assistant").at(-1);

  const outputText =
    latestAssistant?.parts
      ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("") ?? "";

  const handleCopy = useCallback(async () => {
    if (!outputText) return;
    await navigator.clipboard.writeText(outputText);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }, [outputText]);

  const updateField = useCallback((name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{template.name}</h1>
            <p className="text-[hsl(var(--muted-foreground))]">
              {template.description}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Input</CardTitle>
              <CardDescription>
                Fill in the details for your content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {template.inputFields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  {field.type === "textarea" ? (
                    <Textarea
                      id={field.name}
                      placeholder={field.placeholder}
                      value={formData[field.name] ?? ""}
                      onChange={(e) => updateField(field.name, e.target.value)}
                      maxLength={field.maxLength}
                      rows={4}
                      disabled={isStreaming}
                    />
                  ) : field.type === "select" && field.options ? (
                    <Select
                      value={formData[field.name] ?? ""}
                      onValueChange={(val) => updateField(field.name, val)}
                      disabled={isStreaming}
                    >
                      <SelectTrigger id={field.name}>
                        <SelectValue placeholder={field.placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id={field.name}
                      type={field.type === "number" ? "number" : "text"}
                      placeholder={field.placeholder}
                      value={formData[field.name] ?? ""}
                      onChange={(e) => updateField(field.name, e.target.value)}
                      maxLength={field.maxLength}
                      disabled={isStreaming}
                    />
                  )}
                </div>
              ))}

              <Button
                onClick={handleGenerate}
                disabled={isStreaming}
                className="w-full"
                size="lg"
              >
                {isStreaming ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Output</CardTitle>
                  <CardDescription>
                    {isStreaming
                      ? "Generating content..."
                      : outputText
                        ? "Your generated content"
                        : "Content will appear here"}
                  </CardDescription>
                </div>
                {outputText && !isStreaming && (
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    {copied ? (
                      <Check className="mr-1 h-4 w-4" />
                    ) : (
                      <Copy className="mr-1 h-4 w-4" />
                    )}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
                  {error.message ||
                    "An error occurred while generating content."}
                </div>
              )}

              {isStreaming && !outputText && (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              )}

              {outputText && (
                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {outputText}
                  </div>
                </div>
              )}

              {!isStreaming && !outputText && !error && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Sparkles className="mb-3 h-10 w-10 text-[hsl(var(--muted-foreground))]" />
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    Fill in the form and click Generate to create content
                  </p>
                </div>
              )}

              {outputText && !isStreaming && (
                <div className="mt-4 flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
                  <Badge variant="secondary">gemini-2.0-flash</Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
