import mongoose, { Document } from "mongoose";

export interface IExperience {
  role: string;
  company: string;
  highlights: string[];
}

export interface ISettings extends Document {
  key: string;
  siteName: string;
  ownerName: string;
  hero: {
    headline: string;
    tagline: string;
    bio: string;
    imageUrl: string;
  };
  about: {
    statement: string;
    paragraphs: string[];
    experiences: IExperience[];
    techFocus: string;
    interests: string;
  };
  contact: {
    heading: string;
    email: string;
    githubUrl: string;
    linkedinUrl: string;
  };
}

const experienceSchema = new mongoose.Schema<IExperience>(
  {
    role: { type: String, default: "" },
    company: { type: String, default: "" },
    highlights: { type: [String], default: [] },
  },
  { _id: false },
);

// A single document (key: "main") holds all editable public-site content.
const settingsSchema = new mongoose.Schema<ISettings>(
  {
    key: { type: String, required: true, unique: true, default: "main" },
    siteName: { type: String, default: "" },
    ownerName: { type: String, default: "" },
    hero: {
      headline: { type: String, default: "" },
      tagline: { type: String, default: "" },
      bio: { type: String, default: "" },
      imageUrl: { type: String, default: "" },
    },
    about: {
      statement: { type: String, default: "" },
      paragraphs: { type: [String], default: [] },
      experiences: { type: [experienceSchema], default: [] },
      techFocus: { type: String, default: "" },
      interests: { type: String, default: "" },
    },
    contact: {
      heading: { type: String, default: "" },
      email: { type: String, default: "" },
      githubUrl: { type: String, default: "" },
      linkedinUrl: { type: String, default: "" },
    },
  },
  { timestamps: true },
);

const Settings = mongoose.model<ISettings>("Settings", settingsSchema);

export default Settings;
