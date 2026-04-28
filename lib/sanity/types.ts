export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  alt?: string;
}

export interface PostPreview {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  category?: string;
  mainImage?: SanityImage;
  publishedAt?: string;
}

export interface Post extends PostPreview {
  body?: any[];
  author?: {
    name?: string;
    image?: SanityImage;
  };
}
