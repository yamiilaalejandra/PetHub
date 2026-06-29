import { Link, useNavigate } from "react-router-dom";
import styles from "./style.module.css";
import { PawPrint, LogOut, CalendarDays, History, PlusCircle, UserCircle, LayoutDashboard, Users } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isAdmin = token ? JSON.parse(atob(token.split(".")[1])).role === "ADMIN" : false;

  const handleLogout = () => {
    const confirmed = window.confirm("¿Querés cerrar sesión?");
    if (!confirmed) return;

    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.brand}>
        <div className={styles.brandIcon}><PawPrint size={18} /></div>
        <span>PetHub</span>
      </Link>

      <div className={styles.links}>
        {token ? (
          isAdmin ? (
            <>
              <Link to="/admin/dashboard" className={styles.link}><LayoutDashboard size={16} /> Dashboard</Link>
              <Link to="/admin/turnos" className={styles.link}><CalendarDays size={16} /> Todos los Turnos</Link>
              <Link to="/admin/turnos/history" className={styles.link}><History size={16} /> Historial</Link>
              <Link to="/admin/usuarios" className={styles.link}><Users size={16} /> Usuarios</Link>
              <button onClick={handleLogout} className={styles.logout}><LogOut size={16} /> Cerrar sesión</button>
            </>
          ) : (
            <>
              <Link to="/home" className={styles.link}><CalendarDays size={16} /> Inicio</Link>
              <Link to="/mis-reservas" className={styles.link}><CalendarDays size={16} /> Mis Turnos</Link>
              <Link to="/reservar" className={styles.link}><PlusCircle size={16} /> Nuevo Turno</Link>
              <button onClick={handleLogout} className={styles.logout}><LogOut size={16} /> Cerrar sesión</button>
            </>
          )
        ) : (
          <>
            <Link to="/" className={styles.link}>Inicio</Link>
            <Link to="/login" className={styles.link}>Iniciar sesión</Link>
            <Link to="/register" className={styles.link}>Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  );
}
