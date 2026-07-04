export function AppIconMark({
  size,
  maskable = false,
}: {
  size: number;
  maskable?: boolean;
}) {
  const glyphSize = maskable ? size * 0.4 : size * 0.58;

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#2563eb",
      }}
    >
      <div
        style={{
          fontSize: glyphSize,
          fontWeight: 700,
          color: "white",
          fontFamily: "sans-serif",
          lineHeight: 1,
        }}
      >
        A
      </div>
    </div>
  );
}
