import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api";
import styles from "./style.module.css";

export default function AdminTurnos() {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    usuario: "",
    mascota: "",
    estado: "",
    servicio: "",
    fecha: "",
    order: "desc"
  });

  const loadTurnos = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminTurnos(filters);
      setTurnos(data);
    } catch (err) {
      setError(err.message || "No se pudieron cargar los turnos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTurnos();
  }, []);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    loadTurnos();
  };

  const stats = useMemo(() => ({
    total: turnos.length,
    pendientes: turnos.filter((t) => t.estado === "PENDIENTE").length,
    confirmados: turnos.filter((t) => t.estado === "CONFIRMADO").length,
    cancelados: turnos.filter((t) => t.estado === "CANCELADO").length
  }), [turnos]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.badge}>Administración</div>
        <h1 className={styles.title}>Todos los turnos</h1>
        <p className={styles.subtitle}>Buscá, filtrá y revisá el estado de todas las reservas.</p>
      </div>

      <form className={styles.filters} onSubmit={handleSubmit}>
        <input name="usuario" value={filters.usuario} onChange={handleFilterChange} placeholder="Usuario" />
        <input name="mascota" value={filters.mascota} onChange={handleFilterChange} placeholder="Mascota" />
        <select name="estado" value={filters.estado} onChange={handleFilterChange}>
          <option value="">Estado</option>
          <option value="PENDIENTE">Pendiente</option>
          <option value="CONFIRMADO">Confirmado</option>
          <option value="COMPLETADO">Completado</option>
          <option value="CANCELADO">Cancelado</option>
        </select>
        <input name="servicio" value={filters.servicio} onChange={handleFilterChange} placeholder="Servicio" />
        <input name="fecha" type="date" value={filters.fecha} onChange={handleFilterChange} />
        <select name="order" value={filters.order} onChange={handleFilterChange}>
          <option value="desc">Más recientes</option>
          <option value="asc">Más antiguos</option>
        </select>
        <button type="submit">Aplicar filtros</button>
      </form>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}><span>Total</span><strong>{stats.total}</strong></div>
        <div className={styles.statCard}><span>Pendientes</span><strong>{stats.pendientes}</strong></div>
        <div className={styles.statCard}><span>Confirmados</span><strong>{stats.confirmados}</strong></div>
        <div className={styles.statCard}><span>Cancelados</span><strong>{stats.cancelados}</strong></div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {loading ? (
        <p className={styles.loading}>Cargando turnos...</p>
      ) : (
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Mascota</th>
                <th>Servicio</th>
                <th>Profesional</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {turnos.map((turno) => (
                <tr key={turno.id}>
                  <td>{turno.usuario?.nombre} {turno.usuario?.apellido}</td>
                  <td>{turno.mascota?.nombre || "—"}</td>
                  <td>{turno.servicio?.nombre || turno.tipoServicio}</td>
                  <td>{turno.profesional?.nombre || "—"}</td>
                  <td>{new Date(turno.fechaInicio).toLocaleDateString()}</td>
                  <td>{turno.horaInicio}</td>
                  <td>{turno.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
