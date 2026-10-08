import { z } from "zod";

const text = (max: number) => z.string().trim().max(max);
// Empty string means "not set"; otherwise it must be a real URL.
const optionalUrl = z.union([z.literal(""), z.string().trim().url().max(500)]);
const optionalEmail = z.union([z.literal(""), z.string().trim().email().max(200)]);
// Hero image may be a Cloudinary URL or the bundled default path.
const imageRef = z.union([z.literal(""), z.string().trim().max(500)]);

const experienceSchema = z.object({
  role: text(120),
  company: text(120),
  highlights: z.array(text(300)).max(12),
});

export const updateSettingsSchema = z
  .object({
    siteName: text(60),
    ownerName: text(60),
    hero: z
      .object({
        headline: text(120),
        tagline: text(160),
        bio: text(1200),
        imageUrl: imageRef,
      })
      .partial(),
    about: z
      .object({
        statement: text(600),
        paragraphs: z.array(text(1200)).max(8),
        experiences: z.array(experienceSchema).max(8),
        techFocus: text(400),
        interests: text(400),
      })
      .partial(),
    contact: z
      .object({
        heading: text(400),
        email: optionalEmail,
        githubUrl: optionalUrl,
        linkedinUrl: optionalUrl,
      })
      .partial(),
  })
  .partial();

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
