export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  category: string;
  image: string;
  date: string;
  author?: string;
  readTime?: string;
  /** Per-post SEO overrides */
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
};
