import styles from "./style.module.css";
import guarderiaIcon from "../../assets/guarderia.png";
import paseoIcon from "../../assets/paseo.png";
import cuidadoIcon from "../../assets/cuidado.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ServiceModal from "../../components/ServiceModal";
import { CalendarDays, ShieldCheck, Sparkles, PawPrint, ArrowRight } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [open, setOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const SERVICES_INFO = {
    guarderia: {
      title: "Guardería premium",
      description: "Cuidado diario con vigilancia, juegos y descanso en un entorno seguro y confortable.",
    },
    paseo: {
      title: "Paseos personalizados",
      description: "Rutas adaptadas, seguimiento y atención para que cada salida sea divertida y segura.",
    },
    cuidado: {
      title: "Cuidado e higiene",
      description: "Baños, cepillado y atención de bienestar para mantener a tu mascota impecable.",
    },
  };

  const quickStats = [
    { label: "Turnos de hoy", value: "12", icon: CalendarDays },
    { label: "Atención premium", value: "24/7", icon: ShieldCheck },
    { label: "Satisfacción", value: "98%", icon: Sparkles },
  ];

  const openServiceModal = (key) => {
    setSelectedService({
      ...SERVICES_INFO[key],
      onReserve: () => {
        if (token) navigate(`/reservar?servicio=${key}`);
        else navigate("/login");
      },
    });

    setOpen(true);
  };

  const handleClick = () => {
    if (token) navigate("/reservar");
    else navigate("/login");
  };

  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>PetHub • Gestión inteligente para mascotas</span>
          <h1>Todo lo que tu mascota necesita, en un solo lugar.</h1>
          <p>
            Organiza servicios, turnos y seguimiento de bienestar con una experiencia simple, rápida y confiable.
          </p>
          <div className={styles.heroActions}>
            <button className={styles.primaryButton} onClick={handleClick}>
              Reservar turno <ArrowRight size={18} />
            </button>
            <button className={styles.secondaryButton} onClick={() => navigate("/appointments/history")}>
              Ver historial
            </button>
          </div>

          <div className={styles.statsGrid}>
            {quickStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className={styles.statCard}>
                  <Icon size={20} />
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.visualCard}>
            <div className={styles.visualBadge}><PawPrint size={18} /> Cuidado premium</div>
            <h3>Tu mascota, en buenas manos</h3>
            <p>Profesionales certificados, horarios flexibles y atención personalizada para cada etapa.</p>
          </div>
        </div>
      </section>

      <section className={styles.servicesSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>Servicios destacados</span>
          <h2>Elegí el servicio perfecto para tu compañero</h2>
        </div>

        <div className={styles.servicesGrid}>
          <button className={styles.serviceCard} onClick={() => openServiceModal("guarderia")}>
            <img src={guarderiaIcon} alt="Guardería premium" />
            <h3>Guardería</h3>
            <p>Estancia segura y divertida con supervisión constante.</p>
          </button>

          <button className={styles.serviceCard} onClick={() => openServiceModal("paseo")}>
            <img src={paseoIcon} alt="Paseos personalizados" />
            <h3>Paseos</h3>
            <p>Salidas a medida para liberar energía y disfrutar.</p>
          </button>

          <button className={styles.serviceCard} onClick={() => openServiceModal("cuidado")}>
            <img src={cuidadoIcon} alt="Cuidado e higiene" />
            <h3>Cuidado e higiene</h3>
            <p>Atención completa para mantener su bienestar al día.</p>
          </button>
        </div>
      </section>

      <ServiceModal open={open} onClose={() => setOpen(false)} service={selectedService} />
    </div>
  );
}
