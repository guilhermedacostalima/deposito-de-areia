import { Routes, Route, Link } from 'react-router-dom';

// Importa as páginas principais
import Inicio from './pages/Inicio.jsx';
import NovoCliente from './pages/Clientes/NovoCliente.jsx';
import ListaClientes from './pages/Clientes/ListaClientes.jsx';
import NovoPedido from './pages/Pedidos/NovoPedido.jsx';
import ListaPedidos from './pages/Pedidos/ListaPedidos.jsx';
import RegistrarFrete from './pages/Fretes/RegistrarFrete.jsx';
import ListaFretes from './pages/Fretes/ListaFretes.jsx';
import Faturamento from './pages/Faturamento.jsx';
import Caminhoes from './pages/Caminhoes.jsx';
import Abastecimentos from './pages/Abastecimentos.jsx';

// Componentes de menu com dropdown
import DropdownClientes from './components/Dropdown/DropdownClientes.jsx';
import DropdownPedidos from './components/Dropdown/DropdownPedidos.jsx';
import DropdownFuncionarios from './components/Dropdown/DropdownFuncionarios.jsx';
import DropdownFretes from './components/Dropdown/DropdownFretes.jsx';
import DropdownAlmoxarifado from './components/Dropdown/DropdownAlmoxarifado.jsx';

import ListaFuncionarios from './pages/Funcionarios/ListaFuncionarios.jsx';
import RegistrarFuncionario from './pages/Funcionarios/RegistrarFuncionario.jsx';

// Páginas do Almoxarifado (ajustadas para a pasta Almoxarifado)
import Estoque from './pages/Almoxarifado/Estoque.jsx';
import EntradaMateriais from './pages/Almoxarifado/EntradaMateriais.jsx';
import SaidaMateriais from './pages/Almoxarifado/SaidaMateriais.jsx';

export default function App() {
  return (
    <>
      <nav style={{
        backgroundColor: '#222',
        padding: '10px',
        display: 'flex',
        gap: '15px',
        flexWrap: 'wrap',
        color: '#fff',
        fontFamily: 'Arial, sans-serif',
        alignItems: 'center',
      }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>🏠 Início</Link>
        <DropdownClientes />
        <DropdownPedidos />
        <DropdownFuncionarios />
        <DropdownFretes />
        <Link to="/faturamento" style={{ color: '#fff', textDecoration: 'none' }}>💰 Faturamento</Link>
        <Link to="/caminhoes" style={{ color: '#fff', textDecoration: 'none' }}>🚚 Caminhões</Link>
        <Link to="/abastecimentos" style={{ color: '#fff', textDecoration: 'none' }}>⛽ Abastecimentos</Link>
        <DropdownAlmoxarifado />
      </nav>

      <div style={{ padding: '20px' }}>
        <Routes>
          {/* Página inicial */}
          <Route path="/" element={<Inicio />} />

          {/* Clientes */}
          <Route path="/clientes" element={<ListaClientes />} />
          <Route path="/clientes/novo" element={<NovoCliente />} />
          <Route path="/clientes/consultar" element={<ListaClientes />} />

          {/* Pedidos */}
          <Route path="/pedidos/novo" element={<NovoPedido />} />
          <Route path="/pedidos/lista" element={<ListaPedidos />} />

          {/* Funcionários */}
          <Route path="/funcionarios" element={<ListaFuncionarios />} />
          <Route path="/funcionarios/novo" element={<RegistrarFuncionario />} />

          {/* Fretes */}
          <Route path="/fretes/registrar" element={<RegistrarFrete />} />
          <Route path="/fretes/lista" element={<ListaFretes />} />

          {/* Almoxarifado */}
          <Route path="/estoque" element={<Estoque />} />
          <Route path="/entrada" element={<EntradaMateriais />} />
          <Route path="/saida" element={<SaidaMateriais />} />

          {/* Outras páginas */}
          <Route path="/faturamento" element={<Faturamento />} />
          <Route path="/caminhoes" element={<Caminhoes />} />
          <Route path="/abastecimentos" element={<Abastecimentos />} />
        </Routes>
      </div>
    </>
  );
}
