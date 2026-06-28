import styles from "./style.module.css";

interface ServiceData {
  title: string;
  description: string;
  onReserve: () => void;
}

interface Props {
  open: boolean;
  onClose: () => void;
  service: ServiceData | null;
}

export default function ServiceModal({ open, onClose, service }: Props) {
  if (!open || !service) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>{service.title}</h2>
        <p>{service.description}</p>

    <div className={styles.boxButtons}>
        <button className={styles.reserve} onClick={service.onReserve}>
          Reservar este servicio
        </button>

        <button className={styles.close} onClick={onClose}>
          Cerrar
        </button>
        </div>
      </div>
    </div>
  );
}
