import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import { appointmentService } from "../../services/appointmentService";

export default function AppointmentHistory() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ mascota: "", estado: "", servicio: "" });

  const loadAppointments = async (nextFilters = filters) => {
    try {
      setLoading(true);
      const data = await appointmentService.getAppointmentHistory({
        mascota: nextFilters.mascota,
        estado: nextFilters.estado,
        servicio: nextFilters.servicio,
        order: "desc"
      });
      setAppointments(data);
    } catch (err) {
      setError(err.message || "No se pudo cargar el historial");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    loadAppointments(filters);
  };

  const rows = useMemo(() => [...appointments].sort((a, b) => new Date(b.fechaInicio) - new Date(a.fechaInicio)), [appointments]);

  return (
    <div style={{ maxWidth: "1100px", margin: "2rem auto", padding: "1rem" }}>
      <h2>Historial de turnos</h2>

      <form onSubmit={handleFilter} style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <input value={filters.mascota} onChange={(e) => setFilters({ ...filters, mascota: e.target.value })} placeholder="Mascota" style={{ padding: "0.6rem", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
        <input value={filters.estado} onChange={(e) => setFilters({ ...filters, estado: e.target.value })} placeholder="Estado" style={{ padding: "0.6rem", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
        <input value={filters.servicio} onChange={(e) => setFilters({ ...filters, servicio: e.target.value })} placeholder="Servicio" style={{ padding: "0.6rem", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
        <button type="submit" style={{ padding: "0.7rem 1rem", border: "none", borderRadius: "8px", background: "#111827", color: "#fff", cursor: "pointer" }}>Filtrar</button>
      </form>

      {loading && <Loader />}
      {error && <ErrorMessage message={error} />}

      {!loading && rows.length === 0 && <p>No hay turnos para mostrar.</p>}

      {!loading && rows.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #e5e7eb", padding: "0.75rem", textAlign: "left" }}>Mascota</th>
              <th style={{ borderBottom: "1px solid #e5e7eb", padding: "0.75rem", textAlign: "left" }}>Servicio</th>
              <th style={{ borderBottom: "1px solid #e5e7eb", padding: "0.75rem", textAlign: "left" }}>Fecha</th>
              <th style={{ borderBottom: "1px solid #e5e7eb", padding: "0.75rem", textAlign: "left" }}>Profesional</th>
              <th style={{ borderBottom: "1px solid #e5e7eb", padding: "0.75rem", textAlign: "left" }}>Estado</th>
              <th style={{ borderBottom: "1px solid #e5e7eb", padding: "0.75rem", textAlign: "left" }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((appointment) => (
              <tr key={appointment.id}>
                <td style={{ padding: "0.75rem" }}>{appointment.mascota?.nombre || "Sin mascota"}</td>
                <td style={{ padding: "0.75rem" }}>{appointment.servicio?.nombre || appointment.tipoServicio}</td>
                <td style={{ padding: "0.75rem" }}>{new Date(appointment.fechaInicio).toLocaleDateString()}</td>
                <td style={{ padding: "0.75rem" }}>{appointment.profesional?.nombre || "Sin asignar"}</td>
                <td style={{ padding: "0.75rem" }}>{appointment.estado}</td>
                <td style={{ padding: "0.75rem" }}><Link to={`/appointments/${appointment.id}`}>Ver</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
