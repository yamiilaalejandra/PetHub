import { Link } from "react-router-dom";
import styles from "./style.module.css";

export default function AccessDenied() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.badge}>PetHub</div>
        <h1 className={styles.title}>Acceso denegado</h1>
        <p className={styles.message}>
          No tenés permisos para ver esta sección.
        </p>
        <Link to="/" className={styles.button}>
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
