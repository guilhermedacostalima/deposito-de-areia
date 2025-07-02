import { Link } from 'react-router-dom';
import '../../styles/DropdownMenu.css';



export default function DropdownClientes() {
  return (
    <div className="dropdown">
      <span className="dropbtn">👥 Clientes </span>
      <div className="dropdown-content">
        <Link to="/clientes/novo">Novo Cliente</Link>
        <Link to="/clientes/consultar">Lista de Clientes</Link>
      </div>
    </div>
  );
}
