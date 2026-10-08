# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Recruiters and hiring managers scanning the portfolio quickly to decide whether the owner is worth an interview. They arrive from a resume, LinkedIn or a shared link, often on a phone first. The job: understand who Aadhi is, see real work, and reach him within seconds.

## Product Purpose
A personal developer portfolio with its own CMS. The public site presents Aadhi's work, skills and writing; an admin panel (out of scope for visual work) manages projects, blog posts and skills without redeploying. Success: a recruiter leaves knowing what Aadhi builds, has seen at least one project in depth, and uses the email link.

## Positioning
A portfolio that is itself a working full-stack product: content is served from an API and edited through a custom admin CMS, built by an engineer with enterprise workflow-automation experience.

## Operating Context
Frontend on Vercel, backend on a free-tier host with cold starts (the site shows its own non-blocking wake-up state). Content lives in MongoDB (projects, blogs, skills) with images on Cloudinary. Project descriptions are stored as one string with `Problem:`, `Solution:` and `•` feature markers; the public pages parse them.

## Capabilities and Constraints
- Routes and anchors stay stable: `/`, `/projects`, `/projects/:slug`, `/blog`, `/blog/:slug`, `#contact`.
- Public content comes from the existing API; sections must handle loading, empty and error states.
- Blog posts are markdown; drafts are hidden from the public.
- Stack is existing: React 19, Vite, TypeScript, Tailwind 3, React Router.
- Public-site content that is not a project, blog post or skill (brand name, hero headline, role line, bio and photo, About statement, paragraphs, experience roles and highlights, tech focus, interests, and contact details) is managed in the admin panel under Site Content and stored in a single settings document. Defaults ship in code so the site renders before the API wakes. Visual design of the admin panel itself is not part of this redesign.

## Brand Commitments
- Name and copy voice stay as written: "Aadhi", Software Engineer / Full Stack Developer, About copy, contact links (email, GitHub, LinkedIn).
- Binding visual constraint: the original palette reference was Charcoal/Earth Brown/Burnt Amber/orange, but the owner later chose a cooler "professional and elegant" ink/slate/steel-blue palette (ink `#0b0f14`, slate field `#1b2433`, steel blue `#3f6fb5`); that is the current binding constraint. Typography is delegated to the designer.
- The project showcase from the earlier bold redesign is the binding project layout: one wide lead project, then an offset asymmetric row.

## Evidence on Hand
- Real: the About text and Newgen Softwares role, the ~50% manual-effort reduction claim on loan origination workflows, the portrait at `client/public/Aadhi.jpeg`, the GitHub repo for this portfolio, contact links.
- Absent: real project entries, blog posts, testimonials, customer names. Do not fabricate them. Sample entries used for review must be labeled as samples.

## Product Principles
- Real work first: projects lead, and nothing claims what the content cannot back.
- Fast to read: a recruiter should understand the person and find the contact link in one viewport.
- The site is the proof: it should feel built by someone who cares about craft and works well when the backend is cold.
- Content stays editable: nothing that changes with the owner's career (job, bio, photo, links) lives only in code; changing jobs is an admin edit, not a deploy.
