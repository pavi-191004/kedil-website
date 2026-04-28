import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/sanity/queries";
import BlogList from "@/components/blog/BlogList";
import NewsletterSection from "@/components/blog/NewsletterSection";
import Footer from "@/components/Footer";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blog — Kedil",
  description:
    "No generic tips. No US-first advice. Just practical, India-specific writing on budgeting, saving, loans, and tax.",
  openGraph: {
    title: "Blog — Kedil",
    description:
      "No generic tips. No US-first advice. Just practical, India-specific writing on budgeting, saving, loans, and tax.",
    url: "https://www.kedil.money/blog",
    siteName: "Kedil",
    locale: "en_US",
    type: "website",
  },
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <>
      <main className="min-h-screen">
        {/* Breadcrumb */}
        <div className="container-main pt-6">
          <nav className="flex items-center gap-1.5 text-sm text-gray-400">
            <Link href="/" className="hover:text-gray-700 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-700 font-medium">Blog</span>
          </nav>
        </div>

        {/* Centered hero header */}
        <section className="container-main pt-10 pb-14 text-center">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[#22c55e] mb-5">
            Financial Clarity · For Salaried India
          </p>

          <h1
            className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mx-auto"
            style={{ letterSpacing: "-0.02em", maxWidth: "640px" }}
          >
            Money guides that{" "}
            <span className="text-[#22c55e]">actually apply</span>
            <br className="hidden sm:block" />
            {" "}to your salary
          </h1>

          <p
            className="mt-5 text-[0.95rem] text-gray-400 leading-relaxed mx-auto"
            style={{ maxWidth: "460px" }}
          >
            No generic tips. No US-first advice. Just practical, India-specific
            writing on budgeting, saving, loans, and tax.
          </p>
        </section>

        {/* Post grid */}
        <section className="container-main pb-20">
          <BlogList posts={posts} />
        </section>

        {/* Newsletter */}
        <NewsletterSection />
      </main>

      <Footer />
    </>
  );
}
