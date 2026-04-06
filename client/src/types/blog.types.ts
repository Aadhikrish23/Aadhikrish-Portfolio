export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  tags: string[];
  coverImage?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogResponse {
  success: boolean;
  data: Blog[];
}