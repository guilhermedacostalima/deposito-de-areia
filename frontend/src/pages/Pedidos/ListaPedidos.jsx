import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/ListaPedidos.css';

// Função comparar datas
function isDateInRange(dateStr, startStr, endStr) {
  if (startStr && endStr) return dateStr >= startStr && dateStr <= endStr;
  if (startStr) return dateStr >= startStr;
  if (endStr) return dateStr <= endStr;
  return true;
}

// Formatar data para BR
function formatDateBR(dateStr) {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

export default function ListaPedidos() {
  const navigate = useNavigate();

  const [pedidos, setPedidos] = useState([]);
  const [pedidosFiltrados, setPedidosFiltrados] = useState([]);

  // filtros
  const [clienteInput, setClienteInput] = useState('');
  const [clientesSelecionados, setClientesSelecionados] = useState([]);
  const [filtros, setFiltros] = useState({
    status: '',
    dataInicio: '',
    dataFim: '',
    tipoPedido: '',
  });

  const [pedidoEditandoId, setPedidoEditandoId] = useState(null);
  const [pedidoEditando, setPedidoEditando] = useState(null);

  // Carregar pedidos do localStorage
  useEffect(() => {
    const pedidosSalvos = JSON.parse(localStorage.getItem('pedidos')) || [];
    setPedidos(pedidosSalvos);
  }, []);

  // Aplicar filtros
  useEffect(() => {
    const filtrados = pedidos.filter(p => {
      const clienteMatch =
        clientesSelecionados.length === 0 ||
        clientesSelecionados.some(nome => p.cliente.toLowerCase().includes(nome.toLowerCase()));

      const tipoPedidoMatch = !filtros.tipoPedido || p.tipoPedido === filtros.tipoPedido;

      return (
        clienteMatch &&
        (!filtros.status || p.status === filtros.status) &&
        tipoPedidoMatch &&
        isDateInRange(p.data, filtros.dataInicio, filtros.dataFim)
      );
    });
    setPedidosFiltrados(filtrados);
  }, [filtros, pedidos, clientesSelecionados]);

  function adicionarCliente() {
    const nome = clienteInput.trim();
    if (nome && !clientesSelecionados.includes(nome)) {
      setClientesSelecionados([...clientesSelecionados, nome]);
    }
    setClienteInput('');
  }

  function removerCliente(nome) {
    setClientesSelecionados(clientesSelecionados.filter(c => c !== nome));
  }

  function atualizarStatus(id, novoStatus) {
    const atualizados = pedidos.map(p => (p.id === id ? { ...p, status: novoStatus } : p));
    setPedidos(atualizados);
    localStorage.setItem('pedidos', JSON.stringify(atualizados));
  }

  function calcularTotalPedido(materiais) {
    return materiais.reduce((total, mat) => total + mat.qtd * mat.valorUnit, 0);
  }

  function calcularTotalGeral() {
    return pedidosFiltrados.reduce((total, p) => total + calcularTotalPedido(p.materiais), 0);
  }

  function fazerFechamento() {
    localStorage.setItem('pedidosParaFechamento', JSON.stringify(pedidosFiltrados));
    navigate('/pedidos/fechamento');
  }

  function abrirEdicao(pedido) {
    setPedidoEditandoId(pedido.id);
    setPedidoEditando({
      ...pedido,
      endereco: { ...pedido.endereco },
      materiais: pedido.materiais.map(m => ({ ...m })),
    });
  }

  function cancelarEdicao() {
    setPedidoEditandoId(null);
    setPedidoEditando(null);
  }

  function atualizarCampo(campo, valor) {
    if (campo.startsWith('endereco.')) {
      const chave = campo.split('.')[1];
      setPedidoEditando(prev => ({
        ...prev,
        endereco: { ...prev.endereco, [chave]: valor },
      }));
    } else {
      setPedidoEditando(prev => ({ ...prev, [campo]: valor }));
    }
  }

  function atualizarMaterial(index, campo, valor) {
    const novosMateriais = [...pedidoEditando.materiais];
    if (campo === 'nome') novosMateriais[index].nome = valor;
    else if (campo === 'qtd') novosMateriais[index].qtd = Number(valor);
    else if (campo === 'valorUnit') novosMateriais[index].valorUnit = Number(valor);
    setPedidoEditando(prev => ({ ...prev, materiais: novosMateriais }));
  }

  function adicionarMaterial() {
    setPedidoEditando(prev => ({
      ...prev,
      materiais: [...prev.materiais, { nome: 'Outro', qtd: 1, valorUnit: 0 }],
    }));
  }

  function removerMaterial(index) {
    setPedidoEditando(prev => ({
      ...prev,
      materiais: prev.materiais.filter((_, i) => i !== index),
    }));
  }

  function salvarEdicao() {
    const atualizados = pedidos.map(p => (p.id === pedidoEditandoId ? pedidoEditando : p));
    setPedidos(atualizados);
    localStorage.setItem('pedidos', JSON.stringify(atualizados));
    cancelarEdicao();
  }

  return (
    <div className="lista-pedidos">
      {/* Filtros */}
      {/* ... (mantém seu código atual de filtros e inputs aqui) */}

      {/* Lista de pedidos */}
      {pedidosFiltrados.map(p => (
        <div key={p.id} className={`bloco-cliente ${p.status}`}>
          <div className="cabecalho-pedido">
            <h3>
              Pedido #{p.id} - {p.cliente} - <em>{p.tipoPedido}</em>
            </h3>
            <span className="data-pedido">{formatDateBR(p.data)}</span>
          </div>

          {pedidoEditandoId === p.id ? (
            /* Formulário de edição aqui */
            <form onSubmit={e => { e.preventDefault(); salvarEdicao(); }}>
              {/* Inputs de edição */}
            </form>
          ) : (
            <>
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

              <div className="total" style={{ marginTop: '10px' }}>
                Total R${calcularTotalPedido(p.materiais).toFixed(2)} - <em>{p.status}</em> &nbsp;&nbsp;
                <select value={p.status} onChange={e => atualizarStatus(p.id, e.target.value)}>
                  <option value="pendente">Pendente</option>
                  <option value="pago">Pago</option>
                  <option value="entregue">Entregue</option>
                </select>
                <button onClick={() => abrirEdicao(p)}>Editar</button>
              </div>
            </>
          )}
        </div>
      ))}

      {pedidosFiltrados.length === 0 && <p style={{ marginTop: '20px', fontStyle: 'italic' }}>Nenhum pedido encontrado com os filtros selecionados.</p>}
    </div>
  );
}
