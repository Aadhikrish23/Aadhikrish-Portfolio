import mongoose, { Document } from "mongoose";

export interface ISkill extends Document {
  name: string;
  category: "frontend" | "backend" | "tools" | "database"|"ai";
  level?: number;
}

const skillSchema = new mongoose.Schema<ISkill>(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["frontend", "backend", "tools","database","ai"],
      required: true,
    },
    level: {
      type: Number,
      min: 1,
      max: 10,
    },
  },
  { timestamps: true }
);

const Skill = mongoose.model<ISkill>("Skill", skillSchema);

export default Skill;