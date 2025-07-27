import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/ListaPedidos.css';

const pedidosMock = [
  {
    id: 1,
    cliente: 'Construdeva',
    responsavel: 'Valdir Junior',
    endereco: {
      rua: 'Padre Antonio Correira',
      numero: '3030',
      bairro: 'Nova Conquista',
      cidade: "Santa Barbara D'Oeste",
      contato: '1936265262'
    },
    materiais: [
      { nome: 'Areia Grossa', qtd: 5, valorUnit: 130 },
      { nome: 'Pedra', qtd: 3, valorUnit: 110 }
    ],
    data: '2025-07-25',
    status: 'pendente'
  },
  {
    id: 2,
    cliente: 'Construdeva',
    responsavel: 'Guilherme',
    endereco: {
      rua: 'Rua Americana',
      numero: '163',
      bairro: 'São Joaquim',
      cidade: "Santa Barbara D'Oeste",
      contato: '19992275653'
    },
    materiais: [
      { nome: 'Areia Média', qtd: 5, valorUnit: 120 },
      { nome: 'Pedrisco', qtd: 3, valorUnit: 140 }
    ],
    data: '2025-07-26',
    status: 'pendente'
  }
];

// Função para comparar datas como strings (YYYY-MM-DD)
function isDateInRange(dateStr, startStr, endStr) {
  if (startStr && endStr) {
    return dateStr >= startStr && dateStr <= endStr;
  }
  if (startStr && !endStr) {
    return dateStr >= startStr;
  }
  if (!startStr && endStr) {
    return dateStr <= endStr;
  }
  return true; // sem filtro
}

// Função para formatar data YYYY-MM-DD para DD/MM/YYYY
function formatDateBR(dateStr) {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

function ListaPedidos() {
  const navigate = useNavigate();

  const [filtros, setFiltros] = useState({
    cliente: '',
    status: '',
    dataInicio: '',
    dataFim: ''
  });

  const [pedidos, setPedidos] = useState(pedidosMock);
  const [pedidosFiltrados, setPedidosFiltrados] = useState([]);

  useEffect(() => {
    const filtrados = pedidos.filter(p => {
      return (
        (!filtros.cliente || p.cliente.toLowerCase().includes(filtros.cliente.toLowerCase())) &&
        (!filtros.status || p.status === filtros.status) &&
        isDateInRange(p.data, filtros.dataInicio, filtros.dataFim)
      );
    });
    setPedidosFiltrados(filtrados);
  }, [filtros, pedidos]);

  const calcularTotalPedido = materiais => {
    return materiais.reduce((total, mat) => total + mat.qtd * mat.valorUnit, 0);
  };

  const calcularTotalGeral = () => {
    return pedidosFiltrados.reduce(
      (total, p) => total + calcularTotalPedido(p.materiais),
      0
    );
  };

  const fazerFechamento = () => {
    localStorage.setItem('pedidosParaFechamento', JSON.stringify(pedidosFiltrados));
    navigate('/fechamento');
  };

  return (
    <div className="lista-pedidos">
      <div className="filtros-e-total" style={{ alignItems: 'flex-end' }}>
        <div className="filtros" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="text"
            placeholder="Buscar cliente"
            value={filtros.cliente}
            onChange={e => setFiltros({ ...filtros, cliente: e.target.value })}
          />
          <select
            value={filtros.status}
            onChange={e => setFiltros({ ...filtros, status: e.target.value })}
          >
            <option value="">Todos os status</option>
            <option value="pendente">Pendente</option>
            <option value="entregue">Entregue</option>
          </select>
          <input
            type="date"
            value={filtros.dataInicio}
            onChange={e => setFiltros({ ...filtros, dataInicio: e.target.value })}
          />
          <input
            type="date"
            value={filtros.dataFim}
            onChange={e => setFiltros({ ...filtros, dataFim: e.target.value })}
          />
          <button
            onClick={fazerFechamento}
            style={{
              padding: '6px 14px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Fazer Fechamento
          </button>
        </div>

        <div className="total-geral">
          Total: R${calcularTotalGeral().toFixed(2)}
        </div>
      </div>

      {pedidosFiltrados.map(p => (
        <div key={p.id} className="bloco-cliente">
          <div className="cabecalho-pedido">
            <h3>Pedido #{p.id} - {p.cliente}</h3>
            <span className="data-pedido">
              {formatDateBR(p.data)}
            </span>
          </div>

          <p><strong>Responsável:</strong> {p.responsavel}</p>

          <div className="endereco">
            <strong>Endereço:</strong> {p.endereco.rua}, {p.endereco.numero} - {p.endereco.bairro}<br />
            <strong>Cidade:</strong> {p.endereco.cidade}<br />
            <strong>Contato:</strong> {p.endereco.contato}
          </div>

          <div className="materiais">
            <table>
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Qtd</th>
                  <th>Valor Unit.</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {p.materiais.map((m, i) => (
                  <tr key={i}>
                    <td>{m.nome}</td>
                    <td>{m.qtd}</td>
                    <td>R${m.valorUnit}</td>
                    <td>R${(m.qtd * m.valorUnit).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="total">
            Total R${calcularTotalPedido(p.materiais).toFixed(2)} - <em>{p.status}</em>
            <button>Fechar Pedido</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ListaPedidos;
