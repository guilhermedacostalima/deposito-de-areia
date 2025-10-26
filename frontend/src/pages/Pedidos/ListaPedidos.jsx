import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/ListaPedidos.css';

// Função comparar datas (YYYY-MM-DD)
function isDateInRange(dateStr, startStr, endStr) {
  if (!dateStr) return false;
  if (startStr && endStr) return dateStr >= startStr && dateStr <= endStr;
  if (startStr) return dateStr >= startStr;
  if (endStr) return dateStr <= endStr;
  return true;
}

// Formatar data para BR
function formatDateBR(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

export default function ListaPedidos() {
  const navigate = useNavigate();

  const [pedidos, setPedidos] = useState([]);
  const [pedidosFiltrados, setPedidosFiltrados] = useState([]);

  // filtros
  const [filtros, setFiltros] = useState({
    clienteNome: '',
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
        !filtros.clienteNome ||
        (p.cliente && p.cliente.toLowerCase().includes(filtros.clienteNome.toLowerCase()));

      const tipoPedidoMatch = !filtros.tipoPedido || p.tipoPedido === filtros.tipoPedido;

      const statusMatch = !filtros.status || p.status === filtros.status;

      const dataMatch = isDateInRange(p.data, filtros.dataInicio, filtros.dataFim);

      return clienteMatch && tipoPedidoMatch && statusMatch && dataMatch;
    });
    setPedidosFiltrados(filtrados);
  }, [filtros, pedidos]);

  function atualizarFiltros(campo, valor) {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
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

  // fazer fechamento: confirmar mostrando total, salvar pedidosFiltrados e navegar
  function fazerFechamento() {
    if (!pedidosFiltrados || pedidosFiltrados.length === 0) return;

    const soma = calcularTotalGeral();
    const somaFormatada = soma.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const confirmMsg = `Você tem ${pedidosFiltrados.length} pedido(s) selecionado(s).\n` +
      `Total do fechamento: R$ ${somaFormatada}\n\n` +
      `Deseja gerar o fechamento e navegar para a tela de fechamento?`;

    if (!window.confirm(confirmMsg)) return;

    localStorage.setItem('pedidosParaFechamento', JSON.stringify(pedidosFiltrados));
    navigate('/pedidos/fechamento');
  }

  function abrirEdicao(pedido) {
    setPedidoEditandoId(pedido.id);
    setPedidoEditando({
      ...pedido,
      endereco: { ...(pedido.endereco || {}) },
      materiais: (pedido.materiais || []).map(m => ({ ...m })),
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
    const novosMateriais = [...(pedidoEditando?.materiais || [])];
    if (campo === 'nome') novosMateriais[index].nome = valor;
    else if (campo === 'qtd') novosMateriais[index].qtd = Number(valor);
    else if (campo === 'valorUnit') novosMateriais[index].valorUnit = Number(valor);
    setPedidoEditando(prev => ({ ...prev, materiais: novosMateriais }));
  }

  function adicionarMaterial() {
    setPedidoEditando(prev => ({
      ...prev,
      materiais: [...(prev.materiais || []), { nome: 'Outro', qtd: 1, valorUnit: 0 }],
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

  // helper para classe de status (suporta 'pago', 'entregue', 'pendente' em qualquer case)
  function getStatusClass(status) {
    if (!status) return 'status';
    const s = status.toString().toLowerCase();
    if (s === 'pago') return 'status pago';
    if (s === 'entregue') return 'status entregue';
    if (s === 'pendente') return 'status pendente';
    return 'status';
  }

  // formatar total geral para pt-BR (ex: 12.345,67)
  const totalGeralFormatado = calcularTotalGeral().toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="lista-pedidos">
      {/* Painel de filtros no topo */}
      <div className="filtros-top">
        <div className="filtros-row">
          <label className="filtro-item">
            <span>Cliente</span>
            <input
              type="text"
              placeholder="Filtrar por nome do cliente..."
              value={filtros.clienteNome}
              onChange={e => atualizarFiltros('clienteNome', e.target.value)}
            />
          </label>

          <label className="filtro-item">
            <span>Data início</span>
            <input
              type="date"
              value={filtros.dataInicio}
              onChange={e => atualizarFiltros('dataInicio', e.target.value)}
            />
          </label>

          <label className="filtro-item">
            <span>Data fim</span>
            <input
              type="date"
              value={filtros.dataFim}
              onChange={e => atualizarFiltros('dataFim', e.target.value)}
            />
          </label>

          <label className="filtro-item">
            <span>Status</span>
            <select value={filtros.status} onChange={e => atualizarFiltros('status', e.target.value)}>
              <option value="">Todos</option>
              <option value="pendente">Pendente</option>
              <option value="pago">Pago</option>
              <option value="entregue">Entregue</option>
            </select>
          </label>

          <div className="filtro-acoes">
            <button
              type="button"
              className="button salvar"
              onClick={() => { setFiltros(prev => ({ ...prev })); }}
            >
              Aplicar
            </button>
            <button
              type="button"
              className="button cancelar"
              onClick={() => {
                setFiltros({
                  clienteNome: '',
                  status: '',
                  dataInicio: '',
                  dataFim: '',
                  tipoPedido: '',
                });
              }}
            >
              Limpar
            </button>
          </div>
        </div>

        {/* Total geral no canto superior direito (destaque) + botão Fazer Fechamento */}
        <div className="filtros-resumo">
          <div className="total-top">
            <div className="total-label">Total Geral</div>
            <div className="total-valor">R$ {totalGeralFormatado}</div>
          </div>

          <div style={{ width: '100%', marginTop: 8 }}>
            <button
              type="button"
              className="button salvar fechamento"
              onClick={fazerFechamento}
              style={{ width: '100%' }}
              disabled={!pedidosFiltrados || pedidosFiltrados.length === 0}
            >
              Fazer Fechamento
            </button>
          </div>

          <small style={{ display: 'block', marginTop: 8 }}>
            Pedidos mostrados: <strong>{pedidosFiltrados.length}</strong>
          </small>
        </div>
      </div>

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
            <form className="edicao-pedido" onSubmit={e => { e.preventDefault(); salvarEdicao(); }}>
              <div className="edicao-grid">
                <input
                  type="text"
                  value={pedidoEditando.cliente}
                  onChange={e => atualizarCampo('cliente', e.target.value)}
                  placeholder="Cliente"
                />
                <input
                  type="text"
                  value={pedidoEditando.responsavel}
                  onChange={e => atualizarCampo('responsavel', e.target.value)}
                  placeholder="Responsável"
                />
                <input
                  type="text"
                  value={pedidoEditando.endereco?.rua || ''}
                  onChange={e => atualizarCampo('endereco.rua', e.target.value)}
                  placeholder="Rua"
                  className="full"
                />
                <input
                  type="text"
                  value={pedidoEditando.endereco?.numero || ''}
                  onChange={e => atualizarCampo('endereco.numero', e.target.value)}
                  placeholder="Número"
                />
                <input
                  type="text"
                  value={pedidoEditando.endereco?.bairro || ''}
                  onChange={e => atualizarCampo('endereco.bairro', e.target.value)}
                  placeholder="Bairro"
                />
              </div>

              <div className="materiais-edicao">
                {(pedidoEditando.materiais || []).map((m, i) => (
                  <div key={i} className="linha-material">
                    <input
                      type="text"
                      value={m.nome}
                      onChange={e => atualizarMaterial(i, 'nome', e.target.value)}
                      placeholder="Material"
                    />
                    <input
                      type="number"
                      value={m.qtd}
                      onChange={e => atualizarMaterial(i, 'qtd', e.target.value)}
                      placeholder="Qtd"
                    />
                    <input
                      type="number"
                      value={m.valorUnit}
                      onChange={e => atualizarMaterial(i, 'valorUnit', e.target.value)}
                      placeholder="Valor Unitário"
                    />
                    <button type="button" className="button cancelar acao-pequena" onClick={() => removerMaterial(i)}>
                      Remover
                    </button>
                  </div>
                ))}
                <button type="button" className="button salvar btn-add-material" onClick={adicionarMaterial}>
                  + Material
                </button>
              </div>

              <div className="acoes-edicao">
                <button type="submit" className="button salvar">Salvar</button>
                <button type="button" className="button cancelar" onClick={cancelarEdicao}>Cancelar</button>
              </div>
            </form>
          ) : (
            <>
              <p><strong>Responsável:</strong> {p.responsavel}</p>
              <div className="endereco">
                <strong>Endereço:</strong> {p.endereco?.rua}, {p.endereco?.numero} - {p.endereco?.bairro}<br />
                <strong>Cidade:</strong> {p.endereco?.cidade}<br />
                <strong>Contato:</strong> {p.endereco?.contato}
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
                    {(p.materiais || []).map((m, i) => (
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
                <div style={{ marginRight: 12 }}>
                  Total R${calcularTotalPedido(p.materiais).toFixed(2)}
                </div>

                <div className={getStatusClass(p.status)}>
                  <span className="status-dot" />
                  <em style={{ textTransform: 'capitalize' }}>{p.status}</em>
                </div>

                <select value={p.status} onChange={e => atualizarStatus(p.id, e.target.value)} style={{ marginLeft: 12 }}>
                  <option value="pendente">Pendente</option>
                  <option value="pago">Pago</option>
                  <option value="entregue">Entregue</option>
                </select>

                <button className="button editar" onClick={() => abrirEdicao(p)} style={{ marginLeft: 12 }}>Editar</button>
              </div>
            </>
          )}
        </div>
      ))}

      {pedidosFiltrados.length === 0 && (
        <p style={{ marginTop: '20px', fontStyle: 'italic' }}>
          Nenhum pedido encontrado com os filtros selecionados.
        </p>
      )}
    </div>
  );
}
