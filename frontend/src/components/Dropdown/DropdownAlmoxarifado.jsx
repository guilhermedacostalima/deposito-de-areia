import { Link } from 'react-router-dom';
import '../../styles/DropdownMenu.css';

export default function DropdownAlmoxarifado() {
  return (
    <div className="dropdown">
      <span className="dropbtn">📦 Almoxarifado</span>
      <div className="dropdown-content">
        <Link to="/estoque">Estoque</Link>
        <Link to="/entrada">Entrada de Materiais</Link>
        <Link to="/saida">Saída de Materiais</Link>
      </div>
    </div>
  );
}
