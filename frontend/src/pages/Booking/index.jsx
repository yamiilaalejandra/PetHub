import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import { api } from "../../services/api";
import styles from "./style.module.css";

export default function Booking() {
  const [form, setForm] = useState({
    tipoServicio: "",
    fechaInicio: "",
    horaInicio: "",
    cantidadMascotas: 1,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

const validateForm = () => {
  const { tipoServicio, fechaInicio, horaInicio, cantidadMascotas } = form;

  if (!tipoServicio) {
    setError("Seleccioná un tipo de servicio");
    return false;
  }

  if (!fechaInicio) {
    setError("Debés elegir una fecha");
    return false;
  }

const fechaSeleccionada = new Date(fechaInicio);
const maxDate = new Date();
maxDate.setFullYear(maxDate.getFullYear() + 1);

if (fechaSeleccionada > maxDate) {
  setError("Solo podés reservar con hasta 1 año de anticipación");
  return false;
}


  if (!horaInicio) {
    setError("Debés elegir una hora");
    return false;
  }

  // Validar hora (no 00:00 o formato inválido)
  if (!/^\d{2}:\d{2}$/.test(horaInicio)) {
    setError("La hora no es válida");
    return false;
  }

  // Cantidad de mascotas
  if (cantidadMascotas < 1) {
    setError("La cantidad de mascotas debe ser al menos 1");
    return false;
  }

  return true;
};


  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!validateForm()) return;

  setLoading(true);

  try {
    // Crear fecha ISO válida
    const fechaISO = new Date(`${form.fechaInicio}T${form.horaInicio}:00`);

    await api.reservar({
      tipoServicio: form.tipoServicio,
      fechaInicio: fechaISO.toISOString(),
      horaInicio: form.horaInicio,
      cantidadMascotas: form.cantidadMascotas,
    });

    navigate("/success", { 
  state: { 
    type: "reserva",
    servicio: form.tipoServicio,
    fecha: form.fechaInicio,
    hora: form.horaInicio
  } 
});

  } catch (err) {
    setError(err.message || "Error al registrar la reserva");
  } finally {
    setLoading(false);
  }
};

  const handleCantidadChange = (delta) => {
    setForm((prev) => ({
      ...prev,
      cantidadMascotas: Math.max(1, prev.cantidadMascotas + delta),
    }));
  };

  const SERVICES = [
  { label: "Guardería", value: "guarderia" },
  { label: "Paseo", value: "paseo" },
  { label: "Cuidado e Higiene", value: "cuidado" },
];

  return (
    <div className={styles.bookingContainer}>
        <h2 className={styles.title}>Confia en el buen cuidado de tu mascota</h2>
      <div className={styles.card}>
        <h2 className={styles.title}>Reservar un turno</h2>
        <p className={styles.subtitle}>
          Elegí el servicio y definí los detalles de tu cita
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Tipo de servicio */}
          <label className={styles.label}>1. Tipo de servicio</label>
          <div className={styles.serviceButtons}>
              {SERVICES.map((s) => (
            <button
              key={s.value}
              type="button"
              className={`${styles.serviceBtn} ${
              form.tipoServicio === s.value ? styles.active : ""
            }`}
      onClick={() => setForm({ ...form, tipoServicio: s.value })}
    >
      {s.label}
    </button>
            ))}
          </div>

          {/* Fecha y hora */}
          <label className={styles.label}>2. Fecha y hora</label>
          <div className={styles.dateTime}>
           <input
            type="date"
            value={form.fechaInicio}
            min={new Date().toISOString().split("T")[0]}
            max={new Date(Date.now() + 365*24*60*60*1000).toISOString().split("T")[0]}
            onChange={(e) => setForm({ ...form, fechaInicio: e.target.value })}
          />

            <input
              type="time"
              value={form.horaInicio}
              onChange={(e) => setForm({ ...form, horaInicio: e.target.value })}
            />
          </div>

          {/* Cantidad de mascotas */}
          <label className={styles.label}>3. Cantidad de mascotas</label>
          <div className={styles.counter}>
            <button
              type="button"
              onClick={() => handleCantidadChange(-1)}
              className={styles.counterBtn}
            >
              -
            </button>
            <span>{form.cantidadMascotas}</span>
            <button
              type="button"
              onClick={() => handleCantidadChange(1)}
              className={styles.counterBtn}
            >
              +
            </button>
          </div>

          {error && <ErrorMessage message={error} />}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? <Loader /> : "Confirmar Reserva"}
          </button>
        </form>
      </div>
    </div>
  );
}
