import { useEffect, useState } from "react";
import { api } from "../../services/api";
import styles from "./style.module.css";

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await api.getAdminDashboard();
        setSummary(data);
      } catch (err) {
        setError(err.message || "No se pudo cargar el dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div className={styles.page}><p className={styles.loading}>Cargando panel...</p></div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.badge}>Panel de administración</div>
        <h1 className={styles.title}>PetHub</h1>
        <p className={styles.subtitle}>Controlá turnos, estado y actividad del sistema.</p>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {summary && (
        <>
          <div className={styles.cardsGrid}>
            <div className={styles.card}><span>Total de turnos</span><strong>{summary.totalTurnos}</strong></div>
            <div className={styles.card}><span>Turnos pendientes</span><strong>{summary.turnosPendientes}</strong></div>
            <div className={styles.card}><span>Turnos confirmados</span><strong>{summary.turnosConfirmados}</strong></div>
            <div className={styles.card}><span>Turnos cancelados</span><strong>{summary.turnosCancelados}</strong></div>
            <div className={styles.card}><span>Usuarios registrados</span><strong>{summary.usuariosRegistrados}</strong></div>
          </div>

          <div className={styles.tableCard}>
            <h2 className={styles.tableTitle}>Últimos turnos registrados</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Mascota</th>
                  <th>Servicio</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {summary.ultimosTurnos.map((turno) => (
                  <tr key={turno.id}>
                    <td>{turno.usuario?.nombre} {turno.usuario?.apellido}</td>
                    <td>{turno.mascota?.nombre || "—"}</td>
                    <td>{turno.servicio?.nombre || turno.tipoServicio}</td>
                    <td>{new Date(turno.fechaInicio).toLocaleDateString()}</td>
                    <td>{turno.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
