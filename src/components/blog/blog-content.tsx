import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";

function BlogMarkdownLink({
  href,
  children,
}: {
  href?: string;
  children?: React.ReactNode;
}) {
  if (!href) return <>{children}</>;

  const isExternal = href.startsWith("http") && !href.includes("copara.ca");

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="blog-link">
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
    <Link href={path} className="blog-link">
      {children}
    </Link>
  );
}

const MARKDOWN_COMPONENTS: Components = {
  h2: ({ children }) => <h2 className="blog-h2">{children}</h2>,
  h3: ({ children }) => <h3 className="blog-h3">{children}</h3>,
  p: ({ children }) => <p className="blog-p">{children}</p>,
  ul: ({ children }) => <ul className="blog-ul">{children}</ul>,
  ol: ({ children }) => <ol className="blog-ol">{children}</ol>,
  li: ({ children }) => <li className="blog-li">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
  a: ({ href, children }) => <BlogMarkdownLink href={href}>{children}</BlogMarkdownLink>,
};

export function BlogContent({ body }: { body: string }) {
  return (
    <div className="blog-prose">
      <ReactMarkdown components={MARKDOWN_COMPONENTS}>{body}</ReactMarkdown>
    </div>
  );
}
