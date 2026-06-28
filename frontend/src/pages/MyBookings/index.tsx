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
      <h2 className={styles.title}>Mis Reservas</h2>

      {loading && <p>Cargando...</p>}
      {error && <ErrorMessage message={error} />}

      {!loading && turnos.length === 0 && (
    <p className={styles.empty}>
      Todavía no realizaste ninguna reserva 🐾
    </p>
  )}

      <div className={styles.list}>
        {turnos.map((t) => (
          <div key={t.id} className={styles.card}>
            <p><strong>Servicio:</strong> {t.tipoServicio}</p>
            <p><strong>Fecha:</strong> {new Date(t.fechaInicio).toLocaleDateString()}</p>
            <p><strong>Hora:</strong> {t.horaInicio}</p>
            <p><strong>Mascotas:</strong> {t.cantidadMascotas}</p>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
