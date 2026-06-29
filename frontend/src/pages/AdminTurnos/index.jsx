import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api";
import styles from "./style.module.css";
import { Eye, X, User, PawPrint, Calendar, Clock, MapPin, AlertCircle, CheckCircle, Bookmark } from "lucide-react";

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

  // Modal States
  const [selectedTurno, setSelectedTurno] = useState(null);
  const [newEstado, setNewEstado] = useState("");
  const [newObservaciones, setNewObservaciones] = useState("");
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");

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

  const handleVerDetalles = (turno) => {
    setSelectedTurno(turno);
    setNewEstado(turno.estado);
    setNewObservaciones(turno.observaciones || "");
    setUpdateError("");
    setUpdateSuccess("");
  };

  const handleCloseModal = () => {
    setSelectedTurno(null);
  };

  const handleUpdateTurno = async (e) => {
    e.preventDefault();
    if (!selectedTurno) return;

    setUpdating(true);
    setUpdateError("");
    setUpdateSuccess("");

    try {
      await api.updateAdminTurno(selectedTurno.id, {
        estado: newEstado,
        observaciones: newObservaciones
      });

      // Update local state
      setTurnos((prev) =>
        prev.map((t) =>
          t.id === selectedTurno.id
            ? { ...t, estado: newEstado, observaciones: newObservaciones }
            : t
        )
      );

      setUpdateSuccess("Turno actualizado correctamente.");
      
      // Update selectedTurno reference to show new values in modal
      setSelectedTurno((prev) => ({
        ...prev,
        estado: newEstado,
        observaciones: newObservaciones
      }));

      // Close modal after 1.5s
      setTimeout(() => {
        handleCloseModal();
      }, 1500);

    } catch (err) {
      setUpdateError(err.message || "Error al actualizar el turno");
    } finally {
      setUpdating(false);
    }
  };

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
                <th>Acciones</th>
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
                  <td>{turno.horaInicio} hs</td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[turno.estado.toLowerCase()]}`}>
                      {turno.estado}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => handleVerDetalles(turno)} className={styles.detailBtn}>
                      <Eye size={14} /> Detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de detalles */}
      {selectedTurno && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <div>
                <h3 className={styles.modalTitle}>Detalle del Turno #{selectedTurno.id}</h3>
                <span className={styles.modalSubtitle}>ID de Turno en Base de Datos</span>
              </div>
              <button onClick={handleCloseModal} className={styles.closeBtn}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.detailsGrid}>
                {/* Cliente Card */}
                <div className={styles.infoCard}>
                  <div className={styles.cardHeader}>
                    <User size={18} className={styles.cardIcon} />
                    <h4>Cliente</h4>
                  </div>
                  <p><strong>Nombre:</strong> {selectedTurno.usuario?.nombre} {selectedTurno.usuario?.apellido}</p>
                  <p><strong>Email:</strong> {selectedTurno.usuario?.correo || "—"}</p>
                </div>

                {/* Mascota Card */}
                <div className={styles.infoCard}>
                  <div className={styles.cardHeader}>
                    <PawPrint size={18} className={styles.cardIcon} />
                    <h4>Mascota</h4>
                  </div>
                  <p><strong>Nombre:</strong> {selectedTurno.mascota?.nombre || "—"}</p>
                  <p><strong>Especie:</strong> {selectedTurno.mascota?.especie || "—"}</p>
                  <p><strong>Raza:</strong> {selectedTurno.mascota?.raza || "—"}</p>
                </div>

                {/* Servicio Card */}
                <div className={styles.infoCard}>
                  <div className={styles.cardHeader}>
                    <Bookmark size={18} className={styles.cardIcon} />
                    <h4>Servicio</h4>
                  </div>
                  <p><strong>Nombre:</strong> {selectedTurno.servicio?.nombre || selectedTurno.tipoServicio}</p>
                  <p><strong>Cantidad Mascotas:</strong> {selectedTurno.cantidadMascotas}</p>
                  <p className={styles.descText}>{selectedTurno.servicio?.descripcion || ""}</p>
                </div>

                {/* Ubicación y Personal Card */}
                <div className={styles.infoCard}>
                  <div className={styles.cardHeader}>
                    <MapPin size={18} className={styles.cardIcon} />
                    <h4>Ubicación y Profesional</h4>
                  </div>
                  <p><strong>Sucursal:</strong> {selectedTurno.sucursal?.nombre || "—"}</p>
                  <p><strong>Dirección:</strong> {selectedTurno.sucursal?.direccion || "—"}</p>
                  <p><strong>Profesional:</strong> {selectedTurno.profesional?.nombre || "—"}</p>
                </div>
              </div>

              {/* Horario y Observaciones */}
              <div className={styles.timeSection}>
                <div className={styles.timeItem}>
                  <Calendar size={18} />
                  <span><strong>Fecha:</strong> {new Date(selectedTurno.fechaInicio).toLocaleDateString()}</span>
                </div>
                <div className={styles.timeItem}>
                  <Clock size={18} />
                  <span><strong>Hora:</strong> {selectedTurno.horaInicio} hs</span>
                </div>
              </div>

              {/* Edición de Estado y Observaciones */}
              <form onSubmit={handleUpdateTurno} className={styles.editForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="modalEstado">Cambiar Estado del Turno</label>
                  <select
                    id="modalEstado"
                    value={newEstado}
                    onChange={(e) => setNewEstado(e.target.value)}
                    className={styles.modalSelect}
                  >
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="CONFIRMADO">CONFIRMADO</option>
                    <option value="COMPLETADO">COMPLETADO</option>
                    <option value="CANCELADO">CANCELADO</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="modalObservaciones">Observaciones / Notas del Administrador</label>
                  <textarea
                    id="modalObservaciones"
                    rows="3"
                    value={newObservaciones}
                    onChange={(e) => setNewObservaciones(e.target.value)}
                    placeholder="Escribí aquí observaciones sobre el turno..."
                    className={styles.modalTextarea}
                  />
                </div>

                {updateError && (
                  <div className={`${styles.alert} ${styles.alertError}`}>
                    <AlertCircle size={16} />
                    <span>{updateError}</span>
                  </div>
                )}

                {updateSuccess && (
                  <div className={`${styles.alert} ${styles.alertSuccess}`}>
                    <CheckCircle size={16} />
                    <span>{updateSuccess}</span>
                  </div>
                )}

                <div className={styles.modalActions}>
                  <button type="button" onClick={handleCloseModal} className={styles.btnCancel}>
                    Cerrar
                  </button>
                  <button type="submit" disabled={updating} className={styles.btnSave}>
                    {updating ? "Guardando..." : "Guardar Cambios"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
