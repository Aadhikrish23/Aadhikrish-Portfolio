import Skill from "../models/skill.model.js";
import AppError from "../utils/AppError.js";

async function createSkill(data: any) {
  if (!data.name || !data.category) {
    throw new AppError("Name and category required", 400);
  }

  return await Skill.create(data);
};

async function getSkills() {
  return await Skill.find().sort({ createdAt: -1 });
};

async function updateSkill(id: string, data: any) {
  const skill = await Skill.findByIdAndUpdate(id, data, {
  returnDocument: "after",
});

  if (!skill) throw new AppError("Skill not found", 404);

  return skill;
};

async function deleteSkill(id: string) {
  const skill = await Skill.findByIdAndDelete(id);

  if (!skill) throw new AppError("Skill not found", 404);

  return { message: "Skill deleted" };
};

export default {createSkill,getSkills,updateSkill,deleteSkill}