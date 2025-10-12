import React, { useState, useRef } from 'react';
import axios from 'axios';
import '../../styles/NovoPedido.css';
import LayoutPedido from './LayoutPedido';

const materiaisOpcoes = [
  'Areia Grossa', 'Areia Média', 'Areia Fina Branca', 'Areia Fina Rosa',
  'Areia Cava', 'Pedra', 'Pedrisco', 'Bica Corrida', 'Pó de pedra', 'Frete', 'Outro',
];

export default function NovoPedido() {
  const [pedido, setPedido] = useState({
    idCliente: '',
    cliente: '',
    responsavel: '',
    endereco: '',
    numero: '',
    bairro: '',
    cidade: '',
    contato: '',
    tipo: 'Entrega',
  });

  const [novoProduto, setNovoProduto] = useState({
    material: materiaisOpcoes[0],
    quantidade: '',
    valorUnitario: '',
  });

  const [produtos, setProdutos] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [mostrarResumo, setMostrarResumo] = useState(false);
  const [mostrarPreco, setMostrarPreco] = useState(true);

  const [lastFetchedId, setLastFetchedId] = useState(null);
  const debounceRef = useRef(null);

  async function buscarClientePorId(id) {
    if (!id || String(lastFetchedId) === String(id)) return;
    try {
      const resp = await axios.get(`http://127.0.0.1:8000/api/clientes/${id}/`, { timeout: 5000 });
      const cliente = resp.data;
      setPedido(prev => ({
        ...prev,
        cliente: cliente.cliente || '',
        responsavel: cliente.responsavel || '',
        endereco: cliente.endereco || '',
        numero: cliente.numero || '',
        bairro: cliente.bairro || '',
        cidade: cliente.cidade || '',
        contato: cliente.contato || '',
      }));
      setLastFetchedId(id);
    } catch (err) {
      console.error(err);
      alert('Erro ao buscar cliente. Verifique o console.');
    }
  }

  function handlePedidoChange(e) {
    const { name, value } = e.target;
    setPedido(prev => ({ ...prev, [name]: value }));

    if (name === 'idCliente') {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (!value.trim()) { setLastFetchedId(null); return; }
      debounceRef.current = setTimeout(() => buscarClientePorId(value.trim()), 400);
    }
  }

  function handleNovoProdutoChange(e) {
    const { name, value } = e.target;
    setNovoProduto(prev => ({ ...prev, [name]: value }));
  }

  function calcularTotal(qtd, valor) {
    const quantidade = Number(qtd);
    const valorUnitario = Number(valor);
    if (isNaN(quantidade) || isNaN(valorUnitario)) return 0;
    return quantidade * valorUnitario;
  }

  function adicionarProduto() {
    if (!novoProduto.quantidade || !novoProduto.valorUnitario) return;
    if (editIndex !== null) {
      const novosProdutos = [...produtos];
      novosProdutos[editIndex] = { ...novoProduto };
      setProdutos(novosProdutos);
      setEditIndex(null);
    } else {
      setProdutos(prev => [...prev, novoProduto]);
    }
    setNovoProduto({ material: materiaisOpcoes[0], quantidade: '', valorUnitario: '' });
  }

  function removerProduto(index) {
    setProdutos(prev => prev.filter((_, i) => i !== index));
    if (editIndex === index) {
      setEditIndex(null);
      setNovoProduto({ material: materiaisOpcoes[0], quantidade: '', valorUnitario: '' });
    }
  }

  function gerarPedido() {
    const pedidosSalvos = JSON.parse(localStorage.getItem('pedidos')) || [];
    const novoId = pedidosSalvos.length > 0 ? pedidosSalvos[pedidosSalvos.length - 1].id + 1 : 1;
    const novoPedido = {
      id: novoId,
      cliente: pedido.cliente,
      responsavel: pedido.responsavel,
      endereco: {
        rua: pedido.endereco,
        numero: pedido.numero,
        bairro: pedido.bairro,
        cidade: pedido.cidade,
        contato: pedido.contato,
      },
      materiais: produtos.map(p => ({
        nome: p.material,
        qtd: Number(p.quantidade),
        valorUnit: Number(p.valorUnitario),
      })),
      data: new Date().toISOString().split('T')[0],
      status: 'pendente',
      tipoPedido: pedido.tipo,
    };
    localStorage.setItem('pedidos', JSON.stringify([...pedidosSalvos, novoPedido]));
    setMostrarResumo(true);
  }

  const totalGeral = produtos.reduce(
    (acc, p) => acc + calcularTotal(p.quantidade, p.valorUnitario),
    0
  );

  return (
    <div className="novo-pedido-container">
      <h2>Novo Pedido</h2>

      <form className="novo-pedido-form" onSubmit={e => e.preventDefault()}>
        <legend className="form-title">Dados do Cliente</legend>
        <fieldset className="form-bloco cliente-fieldset">
          <input type="text" name="idCliente" placeholder="ID Cliente" value={pedido.idCliente} onChange={handlePedidoChange} />
          <input type="text" name="cliente" placeholder="Cliente" value={pedido.cliente} onChange={handlePedidoChange} />
          <input type="text" name="responsavel" placeholder="Responsável" value={pedido.responsavel} onChange={handlePedidoChange} />
          <input type="text" name="endereco" placeholder="Endereço" value={pedido.endereco} onChange={handlePedidoChange} />
          <input type="text" name="numero" placeholder="Número" value={pedido.numero} onChange={handlePedidoChange} />
          <input type="text" name="bairro" placeholder="Bairro" value={pedido.bairro} onChange={handlePedidoChange} />
          <input type="text" name="cidade" placeholder="Cidade" value={pedido.cidade} onChange={handlePedidoChange} />
          <input type="text" name="contato" placeholder="Contato" value={pedido.contato} onChange={handlePedidoChange} />
        </fieldset>

        <div className="grupo-tipo-pedido">
          <label htmlFor="tipo">Tipo de Pedido:</label>
          <select id="tipo" name="tipo" value={pedido.tipo} onChange={handlePedidoChange}>
            <option value="Entrega">Entrega</option>
            <option value="Retirada">Retirada</option>
          </select>
        </div>

        <legend className="form-title">Produtos do Pedido</legend>

        <div className="produto-linha novo-produto">
          <div className="col material">
            <select name="material" value={novoProduto.material} onChange={handleNovoProdutoChange}>
              {materiaisOpcoes.map(mat => <option key={mat} value={mat}>{mat}</option>)}
            </select>
          </div>
          <div className="col quantidade">
            <input type="number" name="quantidade" placeholder="Qtd" value={novoProduto.quantidade} onChange={handleNovoProdutoChange} min="0" />
          </div>
          <div className="col valor-unitario">
            <input type="number" name="valorUnitario" placeholder="Valor Unit." value={novoProduto.valorUnitario} onChange={handleNovoProdutoChange} min="0" step="0.01" />
          </div>
          <div className="col total">
            <input type="text" placeholder="Total" value={`R$ ${calcularTotal(novoProduto.quantidade, novoProduto.valorUnitario).toFixed(2)}`} readOnly />
          </div>
          <div className="col acoes">
            <button type="button" className="btn-adicionar" onClick={adicionarProduto}>
              {editIndex !== null ? 'Atualizar' : 'Adicionar'}
            </button>
          </div>
        </div>

        {produtos.map((produto, index) => {
          const isEditing = editIndex === index;
          return (
            <div key={index} className="produto-linha">
              <div className="col material">
                {isEditing ? (
                  <select name="material" value={novoProduto.material} onChange={handleNovoProdutoChange}>
                    {materiaisOpcoes.map(mat => <option key={mat} value={mat}>{mat}</option>)}
                  </select>
                ) : produto.material}
              </div>
              <div className="col quantidade">{isEditing ? <input type="number" name="quantidade" value={novoProduto.quantidade} onChange={handleNovoProdutoChange} /> : produto.quantidade}</div>
              <div className="col valor-unitario">{isEditing ? <input type="number" name="valorUnitario" value={novoProduto.valorUnitario} onChange={handleNovoProdutoChange} /> : `R$${Number(produto.valorUnitario).toFixed(2)}`}</div>
              <div className="col total">{`R$${calcularTotal(produto.quantidade, produto.valorUnitario).toFixed(2)}`}</div>
              <div className="col acoes">
                {isEditing ? (
                  <>
                    <button type="button" className="btn-adicionar" onClick={adicionarProduto}>Salvar</button>
                    <button type="button" className="btn-remover"
                      onClick={() => { setEditIndex(null); setNovoProduto({ material: materiaisOpcoes[0], quantidade: '', valorUnitario: '' }); }}>
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button type="button" className="btn-editar" onClick={() => { setEditIndex(index); setNovoProduto(produto); }}>Editar</button>
                    <button type="button" className="btn-remover" onClick={() => removerProduto(index)}>Remover</button>
                  </>
                )}
              </div>
            </div>
          );
        })}

        <div className="total-geral">Total R${totalGeral.toFixed(2)}</div>

        <div className="botao-container">
          <button type="button" className="btn-fazer-pedido" onClick={gerarPedido}>Gerar Pedido</button>
        </div>
      </form>

      {mostrarResumo && (
        <>
          <div id="print-layout-container">
            <LayoutPedido pedido={pedido} produtos={produtos} mostrarPreco={mostrarPreco} />
          </div>

          <div className="botoes-container">
            <button className="btn-toggle" onClick={() => setMostrarPreco(!mostrarPreco)}>
              {mostrarPreco ? 'Esconder Preço' : 'Mostrar Preço'}
            </button>
            <button className="btn-fazer-pedido" onClick={() => alert('Pedido enviado!')}>Fazer Pedido</button>
            <button className="btn-fazer-pedido" onClick={() => window.print()}>Imprimir</button>
          </div>
        </>
      )}
    </div>
  );
}
