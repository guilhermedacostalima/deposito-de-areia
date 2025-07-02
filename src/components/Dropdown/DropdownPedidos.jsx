import { Link } from 'react-router-dom';
import '../../styles/DropdownMenu.css';



export default function DropdownPedidos() {
  return (
    <div className="dropdown">
      <span className="dropbtn">📦 Pedidos </span>
      <div className="dropdown-content">
        <Link to="/pedidos/novo">📝 Fazer Pedido</Link>
        <Link to="/pedidos/lista">📋 Lista de Pedidos</Link>
      </div>
    </div>
  );
}
