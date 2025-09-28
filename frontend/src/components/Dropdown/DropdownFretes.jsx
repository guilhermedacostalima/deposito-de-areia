import { useState } from "react";
import { Link } from "react-router-dom";
import '../../styles/DropdownMenu.css';




export default function DropdownFretes() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="dropdown"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <span className="dropbtn">🚛 Fretes </span>
      {isOpen && (
        <div className="dropdown-content">
          <Link to="/fretes/registrar">Registrar Frete</Link>
          <Link to="/fretes/lista">Lista de Fretes</Link>
        </div>
      )}
    </div>
  );
}
