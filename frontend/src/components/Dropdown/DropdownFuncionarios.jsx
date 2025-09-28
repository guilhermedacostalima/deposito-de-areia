// src/components/DropdownFuncionarios.jsx
import { Link } from 'react-router-dom';
import '../../styles/DropdownMenu.css';



export default function DropdownFuncionarios() {
  return (
    <div className="dropdown">
      <span className="dropbtn">👷 Funcionários </span>
      <div className="dropdown-content">
        <Link to="/funcionarios">Lista de Funcionários</Link>
        <Link to="/funcionarios/novo">Novo Funcionário</Link>
      </div>
    </div>
  );
}
