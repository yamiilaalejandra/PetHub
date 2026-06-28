import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import { appointmentService } from "../../services/appointmentService";

export default function AppointmentEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fechaInicio: "", horaInicio: "", tipoServicio: "", observaciones: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAppointment = async () => {
      try {
        const data = await appointmentService.getAppointmentById(id);
        setForm({
          fechaInicio: new Date(data.fechaInicio).toISOString().split("T")[0],
          horaInicio: data.horaInicio,
          tipoServicio: data.tipoServicio,
          observaciones: data.observaciones || ""
        });
      } catch (err) {
        setError(err.message || "No se pudo cargar el turno");
      } finally {
        setLoading(false);
      }
    };

    loadAppointment();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!window.confirm("¿Confirmás que querés editar este turno?")) return;

    try {
      setSubmitting(true);
      setError("");
      await appointmentService.updateAppointment(id, {
        ...form,
        fechaInicio: new Date(`${form.fechaInicio}T${form.horaInicio}:00`).toISOString()
      });
      navigate(`/appointments/${id}`);
    } catch (err) {
      setError(err.message || "No se pudo actualizar el turno");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto", padding: "1rem" }}>
      <h2>Editar turno</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem", background: "#fff", padding: "1.5rem", borderRadius: "12px" }}>
        <label>
          Fecha
          <input type="date" value={form.fechaInicio} onChange={(e) => setForm({ ...form, fechaInicio: e.target.value })} style={{ display: "block", width: "100%", marginTop: "0.4rem", padding: "0.6rem" }} />
        </label>
        <label>
          Hora
          <input type="time" value={form.horaInicio} onChange={(e) => setForm({ ...form, horaInicio: e.target.value })} style={{ display: "block", width: "100%", marginTop: "0.4rem", padding: "0.6rem" }} />
        </label>
        <label>
          Servicio
          <select value={form.tipoServicio} onChange={(e) => setForm({ ...form, tipoServicio: e.target.value })} style={{ display: "block", width: "100%", marginTop: "0.4rem", padding: "0.6rem" }}>
            <option value="guarderia">Guardería</option>
            <option value="paseo">Paseo</option>
            <option value="cuidado">Cuidado</option>
          </select>
        </label>
        <label>
          Observaciones
          <textarea value={form.observaciones} onChange={(e) => setForm({ ...form, observaciones: e.target.value })} style={{ display: "block", width: "100%", marginTop: "0.4rem", padding: "0.6rem" }} />
        </label>
        {error && <ErrorMessage message={error} />}
        <button type="submit" disabled={submitting} style={{ padding: "0.8rem 1rem", border: "none", borderRadius: "8px", background: "#16a34a", color: "#fff", cursor: "pointer" }}>
          {submitting ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}
