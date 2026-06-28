export default function Loader() {
  return (
    <div style={{ textAlign: "center", margin: "1rem" }}>
      <div
        style={{
          width: "30px",
          height: "30px",
          border: "4px solid #ccc",
          borderTopColor: "#000",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
          margin: "auto",
        }}
      />
      <style>
        {`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}
      </style>
    </div>
  );
}
