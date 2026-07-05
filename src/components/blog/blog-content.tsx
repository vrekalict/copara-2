function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export function BlogContent({ body }: { body: string }) {
  const blocks = body.split(/\n\n+/);

  return (
    <div className="blog-prose">
      {blocks.map((block, index) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={index} className="blog-h2">
              {trimmed.replace(/^##\s+/, "")}
            </h2>
          );
        }

        if (trimmed.startsWith("- ")) {
          const items = trimmed.split("\n").filter((l) => l.startsWith("- "));
          return (
            <ul key={index} className="blog-ul">
              {items.map((item, i) => (
                <li key={i}>{renderInline(item.replace(/^-\s+/, ""))}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={index} className="blog-p">
            {renderInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}
