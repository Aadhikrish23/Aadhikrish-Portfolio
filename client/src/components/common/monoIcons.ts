import type { IconType } from "react-icons";
import {
  SiAngular, SiAnthropic, SiApachekafka, SiClaude, SiCloudflare, SiCplusplus, SiCss, SiCypress,
  SiDjango, SiDocker, SiDotnet, SiElasticsearch, SiExpress, SiFastapi, SiFigma, SiFirebase,
  SiFlask, SiGit, SiGithub, SiGitlab, SiGo, SiGooglegemini, SiGraphql, SiHtml5, SiHuggingface,
  SiJavascript, SiJest, SiJira, SiKotlin, SiKubernetes, SiLangchain, SiLaravel, SiLinux,
  SiMongodb, SiMysql, SiNestjs, SiNetlify, SiNextdotjs, SiNginx, SiNodedotjs, SiNotion, SiNpm,
  SiOllama, SiOpenai, SiOpenjdk, SiPhp, SiPostgresql, SiPostman, SiPrisma, SiPython, SiPytorch,
  SiReact, SiRedis, SiRedux, SiRust, SiSass, SiSlack, SiSpring, SiSqlite, SiStorybook,
  SiSupabase, SiSvelte, SiSwift, SiTailwindcss, SiTensorflow, SiTerraform, SiTypescript,
  SiVercel, SiVite, SiVuedotjs, SiWebpack,
} from "react-icons/si";
import { FaAws } from "react-icons/fa";
import { VscVscode } from "react-icons/vsc";

// Single-colour brand glyphs, so every skill reads as one consistent icon family in the
// palette instead of a mix of coloured logos. Keys are lowercase with punctuation removed
// ("Node.js" -> "nodejs"). Anything not listed falls back to the skill's own artwork.
const MONO: Record<string, IconType> = {
  react: SiReact, reactjs: SiReact, typescript: SiTypescript, ts: SiTypescript,
  javascript: SiJavascript, js: SiJavascript, tailwind: SiTailwindcss, tailwindcss: SiTailwindcss,
  nextjs: SiNextdotjs, next: SiNextdotjs, vue: SiVuedotjs, vuejs: SiVuedotjs, angular: SiAngular,
  svelte: SiSvelte, html: SiHtml5, html5: SiHtml5, css: SiCss, css3: SiCss, sass: SiSass,
  scss: SiSass, redux: SiRedux, vite: SiVite, webpack: SiWebpack, storybook: SiStorybook,
  nodejs: SiNodedotjs, node: SiNodedotjs, express: SiExpress, expressjs: SiExpress,
  nestjs: SiNestjs, python: SiPython, django: SiDjango, flask: SiFlask, fastapi: SiFastapi,
  go: SiGo, golang: SiGo, rust: SiRust, php: SiPhp, laravel: SiLaravel, java: SiOpenjdk,
  kotlin: SiKotlin, swift: SiSwift, "c++": SiCplusplus, cplusplus: SiCplusplus, dotnet: SiDotnet,
  spring: SiSpring, graphql: SiGraphql, mongodb: SiMongodb, mongo: SiMongodb,
  postgresql: SiPostgresql, postgres: SiPostgresql, mysql: SiMysql, redis: SiRedis,
  sqlite: SiSqlite, firebase: SiFirebase, supabase: SiSupabase, prisma: SiPrisma,
  elasticsearch: SiElasticsearch, kafka: SiApachekafka, apachekafka: SiApachekafka,
  git: SiGit, github: SiGithub, gitlab: SiGitlab, docker: SiDocker, kubernetes: SiKubernetes,
  k8s: SiKubernetes, terraform: SiTerraform, aws: FaAws, amazonwebservices: FaAws, linux: SiLinux,
  nginx: SiNginx, cloudflare: SiCloudflare, vercel: SiVercel, netlify: SiNetlify,
  vscode: VscVscode, visualstudiocode: VscVscode, figma: SiFigma, postman: SiPostman,
  jest: SiJest, cypress: SiCypress, jira: SiJira, notion: SiNotion, slack: SiSlack, npm: SiNpm,
  pytorch: SiPytorch, tensorflow: SiTensorflow, huggingface: SiHuggingface,
};

// AI services are matched by keyword, since they appear as "OpenAI API", "Claude Code", etc.
const AI_KEYWORDS: [string, IconType][] = [
  ["openai", SiOpenai], ["chatgpt", SiOpenai], ["langchain", SiLangchain],
  ["anthropic", SiAnthropic], ["claude", SiClaude], ["gemini", SiGooglegemini], ["ollama", SiOllama],
];

export const findMonoIcon = (name: string): IconType | undefined => {
  const key = name.toLowerCase().replace(/[^a-z0-9+]/g, "");
  return MONO[key] ?? AI_KEYWORDS.find(([keyword]) => key.includes(keyword))?.[1];
};
