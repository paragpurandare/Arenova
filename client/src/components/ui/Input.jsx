export default function Input({ style, ...rest }) {
  return (
    <input
      style={{
        width: "100%",
        padding: "10px 14px",
        fontSize: "14px",
        borderRadius: "10px",
        border: "1.5px solid #e5e4e7",
        background: "#fff",
        color: "#08060d",
        outline: "none",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        boxSizing: "border-box",
        ...style,
      }}
      onFocus={(e) => {
        e.target.style.borderColor = "#1D9E75";
        e.target.style.boxShadow = "0 0 0 3px rgba(29, 158, 117, 0.12)";
      }}
      onBlur={(e) => {
        e.target.style.borderColor = "#e5e4e7";
        e.target.style.boxShadow = "none";
      }}
      {...rest}
    />
  );
}
