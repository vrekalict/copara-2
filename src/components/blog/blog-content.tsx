import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import { normalizeBlogBody } from "@/lib/blog/normalize-body";

function BlogMarkdownLink({
  href,
  children,
}: {
  href?: string;
  children?: React.ReactNode;
}) {
  if (!href) return <>{children}</>;

  const isExternal = href.startsWith("http") && !href.includes("copara.ca");
  const className =
    "font-semibold text-teal-700 underline underline-offset-4 hover:text-teal-900";

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }

  let path = href;
  if (href.startsWith("http")) {
    try {
      const url = new URL(href);
      path = `${url.pathname}${url.search}${url.hash}`;
    } catch {
      path = href;
    }
  }

  return (
    <Link href={path} className={className}>
      {children}
    </Link>
  );
}

const MARKDOWN_COMPONENTS: Components = {
  h2: ({ children }) => (
    <h2 className="mb-5 mt-12 text-3xl font-bold tracking-tight text-slate-950">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-4 mt-8 text-2xl font-bold tracking-tight text-slate-950">{children}</h3>
  ),
  p: ({ children }) => <p className="mb-6 text-lg leading-8 text-slate-700">{children}</p>,
  ul: ({ children }) => (
    <ul className="mb-8 list-disc space-y-3 pl-6 text-lg leading-8 text-slate-700">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-8 list-decimal space-y-3 pl-6 text-lg leading-8 text-slate-700">{children}</ol>
  ),
  li: ({ children }) => <li className="pl-1">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-slate-950">{children}</strong>,
  a: ({ href, children }) => <BlogMarkdownLink href={href}>{children}</BlogMarkdownLink>,
  pre: ({ children }) => (
    <pre className="mb-6 overflow-x-auto whitespace-pre-wrap font-[inherit] text-lg leading-8 text-slate-700">
      {children}
    </pre>
  ),
  code: ({ children, className }) => (
    <code className={className ?? "font-[inherit]"}>{children}</code>
  ),
};

export function BlogContent({ body }: { body: string }) {
  const markdown = normalizeBlogBody(body);

  return (
    <article className="blog-content">
      <ReactMarkdown components={MARKDOWN_COMPONENTS}>{markdown}</ReactMarkdown>
    </article>
  );
}
