import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/ListaPedidos.css';

const listaMateriaisPermitidos = [
  'Areia Grossa',
  'Areia Média',
  'Areia Fina Branca',
  'Areia Fina Rosa',
  'Areia Cava',
  'Pedra',
  'Pedrisco',
  'Bica Corrida',
  'Pó de pedra',
  'Frete',
  'Outro',
];

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
      contato: '1936265262',
    },
    materiais: [
      { nome: 'Areia Grossa', qtd: 5, valorUnit: 130 },
      { nome: 'Pedra', qtd: 3, valorUnit: 110 },
    ],
    data: '2025-07-25',
    status: 'pendente',
    tipoPedido: 'Entrega',
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
      contato: '19992275653',
    },
    materiais: [
      { nome: 'Areia Média', qtd: 5, valorUnit: 120 },
      { nome: 'Pedrisco', qtd: 3, valorUnit: 140 },
    ],
    data: '2025-07-26',
    status: 'pendente',
    tipoPedido: 'Retirada',
  },
];

// Função comparar datas
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

  // Pedido que está sendo editado (id) ou null se nenhum
  const [pedidoEditandoId, setPedidoEditandoId] = useState(null);
  // Estado temporário do pedido em edição
  const [pedidoEditando, setPedidoEditando] = useState(null);

  // Carregar pedidos do localStorage ou mock no mount
  useEffect(() => {
    const pedidosSalvos = JSON.parse(localStorage.getItem('pedidos')) || pedidosMock;
    setPedidos(pedidosSalvos);
  }, []);

  // Aplicar filtros sempre que algo mudar
  useEffect(() => {
    const filtrados = pedidos.filter(p => {
      const clienteMatch =
        clientesSelecionados.length === 0 ||
        clientesSelecionados.some(nome => p.cliente.toLowerCase().includes(nome));
      const tipoPedidoMatch =
        !filtros.tipoPedido || p.tipoPedido === filtros.tipoPedido;

      return (
        clienteMatch &&
        (!filtros.status || p.status === filtros.status) &&
        tipoPedidoMatch &&
        isDateInRange(p.data, filtros.dataInicio, filtros.dataFim)
      );
    });
    setPedidosFiltrados(filtrados);
  }, [filtros, pedidos, clientesSelecionados]);

  // Adicionar cliente para filtro
  function adicionarCliente() {
    const nome = clienteInput.trim().toLowerCase();
    if (nome && !clientesSelecionados.includes(nome)) {
      setClientesSelecionados([...clientesSelecionados, nome]);
    }
    setClienteInput('');
  }

  // Remover cliente da lista de filtro
  function removerCliente(nome) {
    setClientesSelecionados(clientesSelecionados.filter(c => c !== nome));
  }

  // Atualizar status simples
  function atualizarStatus(id, novoStatus) {
    const atualizados = pedidos.map(p =>
      p.id === id ? { ...p, status: novoStatus } : p
    );
    setPedidos(atualizados);
    localStorage.setItem('pedidos', JSON.stringify(atualizados));
  }

  // Calcular total de materiais de um pedido
  function calcularTotalPedido(materiais) {
    return materiais.reduce((total, mat) => total + mat.qtd * mat.valorUnit, 0);
  }

  // Calcular total geral da lista filtrada
  function calcularTotalGeral() {
    return pedidosFiltrados.reduce(
      (total, p) => total + calcularTotalPedido(p.materiais),
      0
    );
  }

  // Fechar pedido (salvar no localStorage e navegar)
  function fazerFechamento() {
    localStorage.setItem('pedidosParaFechamento', JSON.stringify(pedidosFiltrados));
    navigate('/pedidos/fechamento');
  }

  // Abrir o formulário de edição com os dados do pedido selecionado
  function abrirEdicao(pedido) {
    setPedidoEditandoId(pedido.id);
    setPedidoEditando({
      ...pedido,
      endereco: { ...pedido.endereco },
      materiais: pedido.materiais.map(m => ({ ...m })),
    });
  }

  // Cancelar edição
  function cancelarEdicao() {
    setPedidoEditandoId(null);
    setPedidoEditando(null);
  }

  // Atualizar campos do pedido editando
  function atualizarCampo(campo, valor) {
    if (campo.startsWith('endereco.')) {
      const chave = campo.split('.')[1];
      setPedidoEditando(prev => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          [chave]: valor,
        },
      }));
    } else {
      setPedidoEditando(prev => ({
        ...prev,
        [campo]: valor,
      }));
    }
  }

  // Atualizar materiais na edição
  function atualizarMaterial(index, campo, valor) {
    const novosMateriais = [...pedidoEditando.materiais];
    if (campo === 'nome') {
      if (!listaMateriaisPermitidos.includes(valor)) return;
      novosMateriais[index].nome = valor;
    } else if (campo === 'qtd') {
      novosMateriais[index].qtd = Number(valor);
    } else if (campo === 'valorUnit') {
      novosMateriais[index].valorUnit = Number(valor);
    }
    setPedidoEditando(prev => ({ ...prev, materiais: novosMateriais }));
  }

  // Adicionar novo material na edição
  function adicionarMaterial() {
    setPedidoEditando(prev => ({
      ...prev,
      materiais: [...prev.materiais, { nome: 'Outro', qtd: 1, valorUnit: 0 }],
    }));
  }

  // Remover material na edição
  function removerMaterial(index) {
    setPedidoEditando(prev => ({
      ...prev,
      materiais: prev.materiais.filter((_, i) => i !== index),
    }));
  }

  // Salvar pedido editado
  function salvarEdicao() {
    const atualizados = pedidos.map(p =>
      p.id === pedidoEditandoId ? pedidoEditando : p
    );
    setPedidos(atualizados);
    localStorage.setItem('pedidos', JSON.stringify(atualizados));
    cancelarEdicao();
  }

  return (
    <div className="lista-pedidos">
      <div className="filtros-e-total" style={{ alignItems: 'flex-end' }}>
        <div
          className="filtros"
          style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
        >
          {/* Campo para adicionar clientes no filtro */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input
                type="text"
                placeholder="Adicionar cliente"
                value={clienteInput}
                onChange={e => setClienteInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && adicionarCliente()}
              />
              <button
                onClick={adicionarCliente}
                style={{
                  padding: '6px 10px',
                  backgroundColor: '#007bff',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                +
              </button>
            </div>
            <div
              style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
                marginTop: '6px',
              }}
            >
              {clientesSelecionados.map((nome, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: '#f1f1f1',
                    border: '1px solid #ccc',
                    borderRadius: '16px',
                    padding: '4px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span>{nome}</span>
                  <button
                    onClick={() => removerCliente(nome)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'red',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Filtros status/tipoPedido/data */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <select
              value={filtros.status}
              onChange={e => setFiltros({ ...filtros, status: e.target.value })}
            >
              <option value="">Todos os status</option>
              <option value="pendente">Pendente</option>
              <option value="pago">Pago</option>
              <option value="entregue">Entregue</option>
            </select>

            <select
              value={filtros.tipoPedido}
              onChange={e => setFiltros({ ...filtros, tipoPedido: e.target.value })}
            >
              <option value="">Todos os Tipos</option>
              <option value="Entrega">Entrega</option>
              <option value="Retirada">Retirada</option>
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
                cursor: 'pointer',
              }}
            >
              Fazer Fechamento
            </button>
          </div>
        </div>

        <div className="total-geral">Total: R${calcularTotalGeral().toFixed(2)}</div>
      </div>

      {pedidosFiltrados.map(p => (
        <div key={p.id} className={`bloco-cliente ${p.status}`}>
          <div className="cabecalho-pedido">
            <h3>
              Pedido #{p.id} - {p.cliente} - <em>{p.tipoPedido}</em>
            </h3>
            <span className="data-pedido">{formatDateBR(p.data)}</span>
          </div>

          {pedidoEditandoId === p.id ? (
            <form
              className="edit-pedido-form"
              onSubmit={e => {
                e.preventDefault();
                salvarEdicao();
              }}
            >
              <label>
                <span>Nome do Cliente:</span>
                <input
                  type="text"
                  value={pedidoEditando.cliente}
                  onChange={e => atualizarCampo('cliente', e.target.value)}
                  required
                />
              </label>

              <label className='tipo-pedido-label'>
                <span>Tipo Pedido:</span>
                <select
                  value={pedidoEditando.tipoPedido || ''}
                  onChange={e => atualizarCampo('tipoPedido', e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Selecione
                  </option>
                  <option value="Entrega">Entrega</option>
                  <option value="Retirada">Retirada</option>
                </select>
              </label>

              <label>
                <span>Responsável:</span>
                <input
                  type="text"
                  value={pedidoEditando.responsavel}
                  onChange={e => atualizarCampo('responsavel', e.target.value)}
                  required
                />
              </label>

              <label>
                <span>Rua (Endereço):</span>
                <input
                  type="text"
                  value={pedidoEditando.endereco.rua}
                  onChange={e => atualizarCampo('endereco.rua', e.target.value)}
                  required
                />
              </label>

              <label>
                <span>Número:</span>
                <input
                  type="text"
                  value={pedidoEditando.endereco.numero}
                  onChange={e => atualizarCampo('endereco.numero', e.target.value)}
                  required
                />
              </label>

              <label>
                <span>Bairro:</span>
                <input
                  type="text"
                  value={pedidoEditando.endereco.bairro}
                  onChange={e => atualizarCampo('endereco.bairro', e.target.value)}
                  required
                />
              </label>

              <label>
                <span>Cidade:</span>
                <input
                  type="text"
                  value={pedidoEditando.endereco.cidade}
                  onChange={e => atualizarCampo('endereco.cidade', e.target.value)}
                  required
                />
              </label>

              <label>
                <span>Contato:</span>
                <input
                  type="text"
                  value={pedidoEditando.endereco.contato}
                  onChange={e => atualizarCampo('endereco.contato', e.target.value)}
                  required
                />
              </label>

              <h4>Materiais:</h4>

              <table className="materiais-table">
                <thead>
                  <tr>
                    <th>Material</th>
                    <th>Qtd</th>
                    <th>Valor Unit.</th>
                    <th>Total</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidoEditando.materiais.map((mat, i) => (
                    <tr key={i}>
                      <td>
                        <select
                          value={mat.nome}
                          onChange={e => atualizarMaterial(i, 'nome', e.target.value)}
                        >
                          {listaMateriaisPermitidos.map(opcao => (
                            <option key={opcao} value={opcao}>
                              {opcao}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          value={mat.qtd}
                          onChange={e => atualizarMaterial(i, 'qtd', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          value={mat.valorUnit}
                          onChange={e => atualizarMaterial(i, 'valorUnit', e.target.value)}
                        />
                      </td>
                      <td>R${(mat.qtd * mat.valorUnit).toFixed(2)}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => removerMaterial(i)}
                          style={{
                            background: 'red',
                            color: 'white',
                            borderRadius: '4px',
                            padding: '3px 8px',
                            cursor: 'pointer',
                          }}
                        >
                          X
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                type="button"
                onClick={adicionarMaterial}
                style={{
                  marginTop: '10px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 14px',
                  cursor: 'pointer',
                }}
              >
                Adicionar Material
              </button>

              <div className="botoes-acoes" style={{ marginTop: '20px' }}>
                <button type="submit" className="btn-salvar-cancelar btn-salvar">
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={cancelarEdicao}
                  className="btn-salvar-cancelar btn-cancelar"
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <>
              <p>
                <strong>Responsável:</strong> {p.responsavel}
              </p>

              <div className="endereco">
                <strong>Endereço:</strong> {p.endereco.rua}, {p.endereco.numero} - {p.endereco.bairro}
                <br />
                <strong>Cidade:</strong> {p.endereco.cidade}
                <br />
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
                Total R${calcularTotalPedido(p.materiais).toFixed(2)} -{' '}
                <em>{p.status}</em> &nbsp;&nbsp;
                <select
                  value={p.status}
                  onChange={e => atualizarStatus(p.id, e.target.value)}
                  style={{ padding: '4px', borderRadius: '4px', cursor: 'pointer' }}
                >
                  <option value="pendente">Pendente</option>
                  <option value="pago">Pago</option>
                  <option value="entregue">Entregue</option>
                </select>

                <button
                  onClick={() => abrirEdicao(p)}
                  style={{
                    marginLeft: '10px',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: '1px solid #007bff',
                    background: 'white',
                    color: '#007bff',
                    cursor: 'pointer',
                  }}
                >
                  Editar
                </button>
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
