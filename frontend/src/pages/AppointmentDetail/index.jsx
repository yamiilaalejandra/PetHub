import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import { appointmentService } from "../../services/appointmentService";

export default function AppointmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAppointment = async () => {
      try {
        setLoading(true);
        const data = await appointmentService.getAppointmentById(id);
        setAppointment(data);
      } catch (err) {
        setError(err.message || "No se pudo cargar el turno");
      } finally {
        setLoading(false);
      }
    };

    loadAppointment();
  }, [id]);

  if (loading) return <Loader />;

  if (error) return <ErrorMessage message={error} />;

  return (
    <div style={{ maxWidth: "900px", margin: "2rem auto", padding: "1rem" }}>
      <h2>Detalle del turno</h2>
      {appointment && (
        <div style={{ background: "#fff", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
          <p><strong>Mascota:</strong> {appointment.mascota?.nombre || "Sin mascota"}</p>
          <p><strong>Dueño:</strong> {appointment.usuario?.nombre} {appointment.usuario?.apellido}</p>
          <p><strong>Servicio:</strong> {appointment.servicio?.nombre || appointment.tipoServicio}</p>
          <p><strong>Fecha:</strong> {new Date(appointment.fechaInicio).toLocaleDateString()}</p>
          <p><strong>Hora:</strong> {appointment.horaInicio}</p>
          <p><strong>Estado:</strong> {appointment.estado}</p>
          <p><strong>Profesional:</strong> {appointment.profesional?.nombre || "Sin asignar"}</p>
          <p><strong>Ubicación:</strong> {appointment.sucursal?.nombre || "Sin sucursal"}</p>
          <p><strong>Observaciones:</strong> {appointment.observaciones || "Sin observaciones"}</p>

          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button onClick={() => navigate(`/appointments/edit/${id}`)} style={{ padding: "0.7rem 1rem", border: "none", borderRadius: "8px", background: "#1d4ed8", color: "#fff", cursor: "pointer" }}>
              Editar
            </button>
            <Link to="/appointments/history" style={{ padding: "0.7rem 1rem", borderRadius: "8px", background: "#e5e7eb", color: "#111", textDecoration: "none" }}>
              Volver
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
