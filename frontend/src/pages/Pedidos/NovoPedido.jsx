import { useState } from 'react';
import '../../styles/NovoPedido.css';
import LayoutPedido from './LayoutPedido';

const materiaisOpcoes = [
  'Areia Grossa','Areia Média','Areia Fina Branca','Areia Fina Rosa',
  'Areia Cava','Pedra','Pedrisco','Bica Corrida','Pó de pedra','Frete','Outro',
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

  async function buscarClientePorId(id) {
    if (!id) return;
    try {
      const resposta = await fetch(`http://127.0.0.1:8000/api/clientes/${id}/`);
      if (!resposta.ok) throw new Error('Cliente não encontrado');
      const cliente = await resposta.json();
      setPedido(prev => ({
        ...prev,
        cliente: cliente.cliente,
        responsavel: cliente.responsavel,
        endereco: cliente.endereco || '',
        numero: cliente.numero || '',
        bairro: cliente.bairro || '',
        cidade: cliente.cidade,
        contato: cliente.contato || '',
      }));
    } catch (err) {
      console.error(err);
      alert('Cliente não encontrado');
    }
  }

  function handlePedidoChange(e) {
    const { name, value } = e.target;
    setPedido(prev => ({ ...prev, [name]: value }));
    if (name === 'idCliente') buscarClientePorId(value);
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
    if (editIndex === index) setEditIndex(null);
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
      materiais: produtos.map(p => ({ nome: p.material, qtd: Number(p.quantidade), valorUnit: Number(p.valorUnitario) })),
      data: new Date().toISOString().split('T')[0],
      status: 'pendente',
      tipoPedido: pedido.tipo,
    };

    localStorage.setItem('pedidos', JSON.stringify([...pedidosSalvos, novoPedido]));
    setMostrarResumo(true);
  }

  const totalGeral = produtos.reduce((acc, p) => acc + calcularTotal(p.quantidade, p.valorUnitario), 0);

  return (
    <div className="novo-pedido-container">
      <h2>Novo Pedido</h2>
      <form onSubmit={e => e.preventDefault()}>
        <fieldset>
          <input type="text" name="idCliente" placeholder="ID Cliente" value={pedido.idCliente} onChange={handlePedidoChange}/>
          <input type="text" name="cliente" placeholder="Cliente" value={pedido.cliente} onChange={handlePedidoChange}/>
          <input type="text" name="responsavel" placeholder="Responsável" value={pedido.responsavel} onChange={handlePedidoChange}/>
          <input type="text" name="endereco" placeholder="Endereço" value={pedido.endereco} onChange={handlePedidoChange}/>
          <input type="text" name="numero" placeholder="Número" value={pedido.numero} onChange={handlePedidoChange}/>
          <input type="text" name="bairro" placeholder="Bairro" value={pedido.bairro} onChange={handlePedidoChange}/>
          <input type="text" name="cidade" placeholder="Cidade" value={pedido.cidade} onChange={handlePedidoChange}/>
          <input type="text" name="contato" placeholder="Contato" value={pedido.contato} onChange={handlePedidoChange}/>
          <select name="tipo" value={pedido.tipo} onChange={handlePedidoChange}>
            <option value="Entrega">Entrega</option>
            <option value="Retirada">Retirada</option>
          </select>
        </fieldset>

        <fieldset>
          <select name="material" value={novoProduto.material} onChange={handleNovoProdutoChange}>
            {materiaisOpcoes.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <input type="number" name="quantidade" placeholder="Qtd" value={novoProduto.quantidade} onChange={handleNovoProdutoChange}/>
          <input type="number" name="valorUnitario" placeholder="Valor Unit." value={novoProduto.valorUnitario} onChange={handleNovoProdutoChange}/>
          <input type="number" placeholder="Total" value={calcularTotal(novoProduto.quantidade, novoProduto.valorUnitario)} readOnly/>
          <button type="button" onClick={adicionarProduto}>{editIndex !== null ? 'Atualizar' : 'Adicionar'}</button>
        </fieldset>

        {produtos.map((p,i) => (
          <div key={i}>
            <span>{p.material}</span> | <span>{p.quantidade}</span> | <span>R${p.valorUnitario}</span> | <span>R${calcularTotal(p.quantidade,p.valorUnitario)}</span>
            <button type="button" onClick={()=>{setEditIndex(i); setNovoProduto(p)}}>Editar</button>
            <button type="button" onClick={()=>removerProduto(i)}>Remover</button>
          </div>
        ))}

        <div>Total Geral: R${totalGeral}</div>
        <button type="button" onClick={gerarPedido}>Gerar Pedido</button>
      </form>

      {mostrarResumo && <LayoutPedido pedido={pedido} produtos={produtos} mostrarPreco={mostrarPreco}/>}
    </div>
  );
}
