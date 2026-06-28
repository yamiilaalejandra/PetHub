import styles from "./style.module.css";
import guarderiaIcon from "../../assets/guarderia.png";
import paseoIcon from "../../assets/paseo.png";
import cuidadoIcon from "../../assets/cuidado.png";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ServiceModal from "../../components/ServiceModal"; 


export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [open, setOpen] = useState(false);
const [selectedService, setSelectedService] = useState(null);

const SERVICES_INFO = {
  guarderia: {
    title: "Guardería Canina",
    description:
      "Ofrecemos cuidado durante el día, juegos supervisados, integración con otros perros y seguimiento constante.",
  },
  paseo: {
    title: "Paseo Canino",
    description:
      "Paseos personalizados, seguros y con duración adecuada para que tu mascota libere energía y sea feliz.",
  },
  cuidado: {
    title: "Cuidado e Higiene",
    description:
      "Baños, cepillado, limpieza y cuidados básicos para mantener a tu mascota en perfectas condiciones.",
  },
};

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
    if (token) {
      navigate("/reservar");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className={styles.home}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>
          Huellitas Red: El Cuidado Integral para tu Mascota
        </h1>
        <p className={styles.subtitle}>
          Ya sea un paseo, una sesión de higiene o un día de guardería, podés
          gestionar todos los servicios para tu mascota haciendo clic en el
          botón <span className={styles.highlight}>“Reservar Turno”</span>.
        </p>
      </header>

      {/* Services Section */}
      <section className={styles.services}>
        <div 
  className={styles.card}
  onClick={() => openServiceModal("guarderia")}
>
  <img src={guarderiaIcon} alt="Guardería Canina" />
  <h3>GUARDERÍA CANINA</h3>
</div>

<div 
  className={styles.card}
  onClick={() => openServiceModal("paseo")}
>
  <img src={paseoIcon} alt="Paseo Canino" />
  <h3>PASEO CANINO</h3>
</div>

<div 
  className={styles.card}
  onClick={() => openServiceModal("cuidado")}
>
  <img src={cuidadoIcon} alt="Cuidado e Higiene" />
  <h3>CUIDADO E HIGIENE CANINO</h3>
</div>

      </section>

      {/* Call To Action */}
      <div className={styles.cta}>
        <button 
          className={styles.button}
          onClick={handleClick}
        >
          Reservar Turno
        </button>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>Conectate con nosotros</p>
        <div className={styles.socials}>
              <a 
                href="https://www.facebook.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Facebook"
              >
            <FaFacebook className={styles.icon} />
          </a>
              <a 
                href="https://www.instagram.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram"
              >
            <FaInstagram className={styles.icon} />
          </a>
        </div>
      </footer>
      <ServiceModal 
  open={open}
  onClose={() => setOpen(false)}
  service={selectedService}
/>

    </div>
    
  );
}
