export default function ErrorMessage({ message }) {
  if (!message) return null;
  return <p style={{ color: "red", marginTop: "1rem" }}>{message}</p>;
}
