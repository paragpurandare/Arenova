export default function LoadingSpinner({ size = 32, color = "#1D9E75" }) {
  return (
    <div className="flex items-center justify-center" style={{ minHeight: size * 3 }}>
      <div
        className="rounded-full border-4 border-transparent animate-spin"
        style={{ width: size, height: size, borderTopColor: color, borderRightColor: color }}
      />
    </div>
  );
}
