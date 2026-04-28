import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      const imageUrl = urlFor(value).width(1200).url();
      return (
        <figure className="my-10">
          <Image
            src={imageUrl}
            alt={value.alt ?? ""}
            width={1200}
            height={675}
            className="rounded-xl w-full object-cover"
            unoptimized
          />
          {value.caption && (
            <figcaption className="mt-3 text-center text-sm text-gray-400 italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },

  block: {
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold text-gray-900 mt-12 mb-4 leading-tight tracking-tight">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-semibold text-gray-900 mt-10 mb-4 leading-tight tracking-tight">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-3 leading-snug">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="text-[1.0625rem] text-gray-700 leading-[1.8] mb-5">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 pl-5 border-l-4 border-[#22c55e] text-gray-600 italic text-lg leading-relaxed">
        {children}
      </blockquote>
    ),
  },

  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-outside ml-6 mb-5 space-y-2 text-gray-700">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-outside ml-6 mb-5 space-y-2 text-gray-700">
        {children}
      </ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => (
      <li className="text-[1.0625rem] leading-relaxed">{children}</li>
    ),
    number: ({ children }) => (
      <li className="text-[1.0625rem] leading-relaxed">{children}</li>
    ),
  },

  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-gray-900">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="bg-gray-100 text-gray-800 text-sm font-mono px-1.5 py-0.5 rounded">
        {children}
      </code>
    ),
    link: ({ value, children }) => {
      const isExternal = value?.href?.startsWith("http");
      return (
        <a
          href={value?.href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="text-[#22c55e] underline underline-offset-2 hover:text-[#16a34a] transition-colors"
        >
          {children}
        </a>
      );
    },
  },
};

export default function BlogContent({ value }: { value: any[] }) {
  return <PortableText value={value} components={components} />;
}
