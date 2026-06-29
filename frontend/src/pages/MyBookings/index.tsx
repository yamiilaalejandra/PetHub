import { useEffect, useState } from "react";
import { api } from "../../services/api";
import ErrorMessage from "../../components/ErrorMessage";
import styles from "./style.module.css";

type Turno = {
  id: number;
  tipoServicio: string;
  fechaInicio: string;
  horaInicio: string;
  cantidadMascotas: number;
  estado: string;
  servicio?: {
    nombre: string;
  };
  mascota?: {
    nombre: string;
  };
};

export default function MyBookings() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTurnos()
      .then((res) => setTurnos(res))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.brandBadge}>PetHub</div>
          <h2 className={styles.title}>Mis turnos</h2>
          <p className={styles.subtitle}>Seguí el estado de cada reserva en un solo lugar.</p>
        </div>

        {loading && <div className={styles.stateCard}>Cargando tus reservas...</div>}
        {error && <ErrorMessage message={error} />}

        {!loading && turnos.length === 0 && (
          <div className={styles.emptyCard}>
            <p className={styles.empty}>Todavía no realizaste ninguna reserva.</p>
            <p className={styles.emptyHint}>Reservá tu próximo turno y cuidemos a tu mascota juntos.</p>
          </div>
        )}

        <div className={styles.list}>
          {turnos.map((t) => {
            const estadoClase = t.estado ? t.estado.toLowerCase() : "pendiente";
            return (
              <div key={t.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.serviceTag}>{t.servicio?.nombre || t.tipoServicio}</span>
                  <span className={`${styles.status} ${styles[estadoClase]}`}>
                    {t.estado || "PENDIENTE"}
                  </span>
                </div>
                <div className={styles.cardBody}>
                  <p><strong>Mascota:</strong> {t.mascota?.nombre || "Sin mascota asignada"}</p>
                  <p><strong>Fecha:</strong> {new Date(t.fechaInicio).toLocaleDateString()}</p>
                  <p><strong>Hora:</strong> {t.horaInicio} hs</p>
                  <p><strong>Mascotas:</strong> {t.cantidadMascotas}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
