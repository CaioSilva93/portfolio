import { z } from "zod";

export const generateInputSchema = z.record(z.string().max(500)).refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one input field is required" }
);

export const generateRequestSchema = z.object({
  messages: z.array(z.any()),
  template: z.string().min(1, "Template is required"),
  inputData: generateInputSchema,
});
