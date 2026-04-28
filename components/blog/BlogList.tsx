import BlogCard from "./BlogCard";
import type { PostPreview } from "@/lib/sanity/types";

export default function BlogList({ posts }: { posts: PostPreview[] }) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-32 text-gray-400">
        <p className="text-lg font-medium">No posts published yet.</p>
        <p className="text-sm mt-1">Check back soon.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <BlogCard key={post._id} post={post} />
      ))}
    </div>
  );
}
