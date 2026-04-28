import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getAllPostSlugs, getPostBySlug } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import BlogContent from "@/components/blog/BlogContent";
import HelpfulRating from "@/components/blog/HelpfulRating";
import ShareButtons from "@/components/blog/ShareButtons";
import NewsletterSection from "@/components/blog/NewsletterSection";
import Footer from "@/components/Footer";

export const revalidate = 3600;

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs
    .filter((s) => s.slug?.current)
    .map(({ slug }) => ({ slug: slug.current }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return {};

  const imageUrl = post.mainImage
    ? urlFor(post.mainImage).width(1200).height(630).url()
    : undefined;

  return {
    title: `${post.title} — Kedil Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://www.kedil.money/blog/${params.slug}`,
      siteName: "Kedil",
      locale: "en_US",
      type: "article",
      ...(post.publishedAt && { publishedTime: post.publishedAt }),
      ...(imageUrl && {
        images: [{ url: imageUrl, width: 1200, height: 630, alt: post.title }],
      }),
    },
  };
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const coverImageUrl = post.mainImage
    ? urlFor(post.mainImage).width(1440).height(810).url()
    : null;

  const postUrl = `https://www.kedil.money/blog/${params.slug}`;

  return (
    <>
      <main className="min-h-screen">
        {/* Hero — title, date, excerpt */}
        <section className="bg-white border-b border-gray-100">
          <div className="container-main py-14">
            <div className="max-w-[720px] mx-auto">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-8"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Blog
              </Link>

              {post.publishedAt && (
                <time dateTime={post.publishedAt} className="section-eyebrow block mb-4">
                  {formatDate(post.publishedAt)}
                </time>
              )}

              <h1
                className="text-3xl md:text-[2.75rem] font-bold text-gray-900 leading-tight"
                style={{ letterSpacing: "-0.02em" }}
              >
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="mt-4 text-[1.05rem] text-gray-500 leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              {post.author?.name && (
                <p className="mt-5 text-sm text-gray-400 font-medium">
                  By {post.author.name}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Article — cover image + body inside same aligned column */}
        <article className="container-main py-12 pb-6">
          <div className="max-w-[720px] mx-auto">
            {/* Cover image — constrained to same width as body text */}
            {coverImageUrl && (
              <div className="relative w-full rounded-2xl overflow-hidden shadow-md mb-10" style={{ aspectRatio: "16/9" }}>
                <Image
                  src={coverImageUrl}
                  alt={post.mainImage?.alt ?? post.title}
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                />
              </div>
            )}

            {/* Body */}
            {post.body && post.body.length > 0 ? (
              <BlogContent value={post.body} />
            ) : (
              <p className="text-gray-400 text-center py-16">Content coming soon.</p>
            )}

            {/* Was this helpful? */}
            <HelpfulRating />

            {/* Share buttons */}
            <ShareButtons url={postUrl} title={post.title} />
          </div>
        </article>

        {/* Newsletter */}
        <NewsletterSection />
      </main>

      <Footer />
    </>
  );
}
