import { useState } from 'react';
import '../../styles/NovoPedido.css';
import LayoutPedido from './LayoutPedido';

const materiaisOpcoes = [
  'Areia Grossa',
  'Areia Média',
  'Areia Fina Branca',
  'Areia Fina Rosa',
  'Areia Cava',
  'Pedra',
  'Pedrisco',
  'Bica Corrida',
  'Pó de pedra',
  'Outro',
];

export default function NovoPedido() {
  const [pedido, setPedido] = useState({
    id: '',
    cliente: '',
    responsavel: '',
    endereco: '',
    numero: '',
    bairro: '',
    cidade: '',
    contato: '',
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

  function handlePedidoChange(e) {
    const { name, value } = e.target;
    setPedido((prev) => ({ ...prev, [name]: value }));
  }

  function handleNovoProdutoChange(e) {
    const { name, value } = e.target;
    setNovoProduto((prev) => ({ ...prev, [name]: value }));
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
      setProdutos((prev) => [...prev, novoProduto]);
    }

    setNovoProduto({ material: materiaisOpcoes[0], quantidade: '', valorUnitario: '' });
  }

  function removerProduto(index) {
    setProdutos((prev) => prev.filter((_, i) => i !== index));
    if (editIndex === index) {
      setEditIndex(null);
      setNovoProduto({ material: materiaisOpcoes[0], quantidade: '', valorUnitario: '' });
    }
  }

  const totalGeral = produtos.reduce(
    (acc, p) => acc + calcularTotal(p.quantidade, p.valorUnitario),
    0
  );

  function toggleMostrarPreco() {
    setMostrarPreco((prev) => !prev);
  }

  return (
    <div className="novo-pedido-container">
      <h2>Novo Pedido</h2>

      <form className="novo-pedido-form" onSubmit={(e) => e.preventDefault()}>
        <legend className="form-title">Dados do Cliente</legend>
        <fieldset className="form-bloco cliente-fieldset">
          <input type="text" name="id" placeholder="ID" value={pedido.id} onChange={handlePedidoChange} />
          <input type="text" name="cliente" placeholder="Cliente" value={pedido.cliente} onChange={handlePedidoChange} />
          <input type="text" name="responsavel" placeholder="Responsável" value={pedido.responsavel} onChange={handlePedidoChange} />
          <input type="text" name="endereco" placeholder="Endereço" value={pedido.endereco} onChange={handlePedidoChange} />
          <input type="text" name="numero" placeholder="Número" value={pedido.numero} onChange={handlePedidoChange} />
          <input type="text" name="bairro" placeholder="Bairro" value={pedido.bairro} onChange={handlePedidoChange} />
          <input type="text" name="cidade" placeholder="Cidade" value={pedido.cidade} onChange={handlePedidoChange} />
          <input type="text" name="contato" placeholder="Contato" value={pedido.contato} onChange={handlePedidoChange} />
        </fieldset>

        <legend className="form-title">Produtos do Pedido</legend>

        <div className="produto-linha novo-produto">
          <select name="material" value={novoProduto.material} onChange={handleNovoProdutoChange}>
            {materiaisOpcoes.map((mat) => (
              <option key={mat} value={mat}>{mat}</option>
            ))}
          </select>

          <input
            type="number"
            name="quantidade"
            placeholder="Qtd"
            value={novoProduto.quantidade}
            onChange={handleNovoProdutoChange}
            min="0"
          />
          <input
            type="number"
            name="valorUnitario"
            placeholder="Valor Unit."
            value={novoProduto.valorUnitario}
            onChange={handleNovoProdutoChange}
            min="0"
            step="0.01"
          />
          <input
            type="number"
            name="total"
            placeholder="Total"
            value={calcularTotal(novoProduto.quantidade, novoProduto.valorUnitario).toFixed(2)}
            readOnly
          />

          <button type="button" onClick={adicionarProduto} className="btn-adicionar">
            {editIndex !== null ? 'Atualizar' : 'Adicionar'}
          </button>
        </div>

        <div className="produtos-cabecalho">
          <div className="col material">Material</div>
          <div className="col quantidade">Quantidade</div>
          <div className="col valor-unitario">Valor Unit.</div>
          <div className="col total">Total</div>
          <div className="col acoes">Ações</div>
        </div>

        {produtos.map((produto, index) => {
          const isEditing = editIndex === index;
          return (
            <div key={index} className="produto-linha">
              <div className="col material">
                {isEditing ? (
                  <select name="material" value={novoProduto.material} onChange={handleNovoProdutoChange}>
                    {materiaisOpcoes.map((mat) => (
                      <option key={mat} value={mat}>{mat}</option>
                    ))}
                  </select>
                ) : (
                  produto.material
                )}
              </div>

              <div className="col quantidade">
                {isEditing ? (
                  <input
                    type="number"
                    name="quantidade"
                    value={novoProduto.quantidade}
                    onChange={handleNovoProdutoChange}
                    min="0"
                  />
                ) : (
                  produto.quantidade
                )}
              </div>

              <div className="col valor-unitario">
                {isEditing ? (
                  <input
                    type="number"
                    name="valorUnitario"
                    value={novoProduto.valorUnitario}
                    onChange={handleNovoProdutoChange}
                    min="0"
                    step="0.01"
                  />
                ) : (
                  <span className="preco">
                    <span className="simbolo">R$</span>&nbsp;
                    {Number(produto.valorUnitario).toFixed(2)}
                  </span>
                )}
              </div>

              <div className="col total">
                <span className="preco">
                  <span className="simbolo">R$</span>&nbsp;
                  {calcularTotal(produto.quantidade, produto.valorUnitario).toFixed(2)}
                </span>
              </div>

              <div className="col acoes">
                {isEditing ? (
                  <>
                    <button type="button" className="btn-adicionar" onClick={adicionarProduto}>Salvar</button>
                    <button
                      type="button"
                      className="btn-remover"
                      onClick={() => {
                        setEditIndex(null);
                        setNovoProduto({ material: materiaisOpcoes[0], quantidade: '', valorUnitario: '' });
                      }}
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="btn-editar"
                      onClick={() => {
                        setEditIndex(index);
                        setNovoProduto(produto);
                      }}
                    >
                      Editar
                    </button>
                    <button type="button" className="btn-remover" onClick={() => removerProduto(index)}>
                      Remover
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}

        <div className="total-geral">Total R${totalGeral.toFixed(2)}</div>

        <div className="botao-container">
          <button type="button" className="btn-fazer-pedido" onClick={() => setMostrarResumo(true)}>
            Gerar
          </button>
        </div>
      </form>

      {/* Só mostra o layout se mostrarResumo for true */}
      {mostrarResumo && (
        <>
          {/* Container com id para impressão */}
          <div id="print-layout-container">
            <LayoutPedido pedido={pedido} produtos={produtos} mostrarPreco={mostrarPreco} />
          </div>

          <div className="botoes-container">
            <button className="btn-toggle" onClick={toggleMostrarPreco}>
              {mostrarPreco ? 'Esconder Preço' : 'Mostrar Preço'}
            </button>

            <button
              className="btn-fazer-pedido"
              onClick={() => alert('Pedido enviado! (implemente a lógica aqui)')}
            >
              Fazer Pedido
            </button>

            <button className="btn-fazer-pedido" onClick={() => window.print()}>
              Imprimir
            </button>
          </div>
        </>
      )}
    </div>
  );
}
