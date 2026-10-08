export interface Experience {
  role: string;
  company: string;
  highlights: string[];
}

export interface SiteSettings {
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
    experiences: Experience[];
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
