import { Link, useNavigate } from "react-router-dom";
import styles from "./style.module.css";
import logo from "../../assets/logo.png"

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className={styles.navbar}>
      {/*  Logo */}
      <div className={styles.logoContainer}>
        
        <Link to="/" className={styles.brand}><img src={logo} alt="Huellitas Red logo" className={styles.logo} /></Link>
      </div>

      {/* Links */}
      <div className={styles.links}>
        {token ? (
          <>
          <Link to="/" className={styles.link}>
              Home
            </Link>
            <Link to="/reservar" className={styles.link}>
              Reservar
            </Link>
            <Link to="/mis-reservas" className={styles.link}>Mis Reservas</Link>
            <button onClick={handleLogout} className={styles.logout}>
              Salir
            </button>
          </>
        ) : (
          <>
          <Link to="/" className={styles.link}>
              Home
            </Link>
            <Link to="/login" className={styles.link}>
              Iniciar sesión
            </Link>
            <Link to="/register" className={styles.link}>
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
