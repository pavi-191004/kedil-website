import { client } from "./client";
import type { Post, PostPreview } from "./types";

export async function getAllPosts(): Promise<PostPreview[]> {
  return client.fetch<PostPreview[]>(
    `*[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      category,
      mainImage,
      publishedAt
    }`
  );
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return client.fetch<Post | null>(
    `*[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      excerpt,
      body,
      mainImage,
      publishedAt,
      "author": author->{ name, image }
    }`,
    { slug }
  );
}

export async function getAllPostSlugs(): Promise<Array<{ slug: { current: string } }>> {
  return client.fetch<Array<{ slug: { current: string } }>>(
    `*[_type == "post"] { slug }`
  );
}
