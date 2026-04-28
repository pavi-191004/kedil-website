import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity/image";
import type { PostPreview } from "@/lib/sanity/types";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogCard({ post }: { post: PostPreview }) {
  const imageUrl = post.mainImage
    ? urlFor(post.mainImage).width(800).height(500).url()
    : null;

  return (
    <Link
      href={`/blog/${post.slug.current}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-[0_2px_20px_rgba(0,0,0,0.07)] hover:shadow-[0_4px_32px_rgba(0,0,0,0.12)] transition-shadow duration-300"
    >
      {/* Cover image */}
      <div className="relative w-full overflow-hidden bg-gray-100" style={{ aspectRatio: "16/10" }}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.mainImage?.alt ?? post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
        )}

        {/* Category badge */}
        {post.category && (
          <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-[#22c55e] text-white text-[0.65rem] font-bold uppercase tracking-widest">
            {post.category}
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-2.5 p-5 flex-1">
        <h2 className="text-[1rem] font-bold text-gray-900 leading-snug group-hover:text-[#22c55e] transition-colors duration-200 line-clamp-2">
          {post.title}
        </h2>

        {post.excerpt && (
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>
        )}

        {post.publishedAt && (
          <p className="mt-auto pt-2 text-sm font-semibold text-gray-800">
            {formatDate(post.publishedAt)}
          </p>
        )}
      </div>
    </Link>
  );
}
