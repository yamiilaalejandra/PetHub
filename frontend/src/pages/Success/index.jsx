import { Link, useLocation } from "react-router-dom";
import styles from "./style.module.css";

export default function Success() {
  const location = useLocation();
  const { type = "registro", servicio, fecha, hora } = location.state || {};

  const isRegistro = type === "registro";

  return (
    <div className={styles.successContainer}>
      <div className={styles.card}>
        <div className={styles.brandBadge}>PetHub</div>
        <h2 className={styles.title}>
          {isRegistro ? "Registro exitoso" : "Reserva creada con éxito"}
        </h2>

        <div className={styles.iconContainer}>
          <span className={styles.check}>✓</span>
        </div>

        <p className={styles.message}>
          {isRegistro
            ? "Tu cuenta quedó lista para comenzar."
            : `Tu turno de ${servicio} quedó registrado correctamente.`}
        </p>

        {!isRegistro && (
          <p className={styles.details}>
            Fecha: {fecha} — Hora: {hora}
          </p>
        )}

        <p className={styles.submessage}>
          Hacé clic para volver al inicio y seguir cuidando a tu mascota.
        </p>

        <Link to="/" className={styles.button}>
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
