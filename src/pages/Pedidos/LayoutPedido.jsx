import React from 'react';
import '../../styles/LayoutPedido.css';

function InfoLine({ label, value }) {
  return (
    <span>
      <strong>{label}:</strong> {value}
    </span>
  );
}

export default function LayoutPedido({ pedido, produtos, mostrarPreco }) {
  if (!pedido) return null;

  const hoje = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const totalGeral = mostrarPreco
    ? produtos.reduce((acc, p) => {
        const qtd = Number(p.quantidade);
        const valor = Number(p.valorUnitario);
        return acc + (isNaN(qtd) || isNaN(valor) ? 0 : qtd * valor);
      }, 0)
    : 0;

  return (
    <div className="layout-pedido-container">
      <div className="layout-pedido-data">{hoje}</div>

      <div className="layout-pedido-info-container">
        <div className="cliente-container">
          <div className="layout-pedido-info-title">DADOS DO CLIENTE</div>
          <div className="layout-pedido-info-text idcliente-responsavel-group">
            <InfoLine label="Pedido" value="Será gerado automaticamente" />
            <div className="cliente-responsavel-subgroup">
              <InfoLine label="Cliente" value={pedido.cliente} />
              <InfoLine label="Responsável" value={pedido.responsavel} />
            </div>
          </div>
        </div>

        <div className="endereco-container">
          <div className="layout-pedido-info-title">ENDEREÇO</div>
          <div className="layout-pedido-info-text grupo-endereco-detalhes">
            <InfoLine label="Endereço" value={pedido.endereco} />
            <div className="numerobairro-group">
              <InfoLine label="Número" value={pedido.numero} />
              <InfoLine label="Bairro" value={pedido.bairro} />
            </div>
            <div className="cidadecontato-group">
              <InfoLine label="Cidade" value={pedido.cidade} />
              <InfoLine label="Contato" value={pedido.contato} />
            </div>
          </div>
        </div>
      </div>

      <div className="material-container">
        <div className="material-title">MATERIAL</div>
        <div className="material-header">
          <span className="material-col material-name">Material</span>
          <span className="material-col material-qty">Qtd</span>
          <span className="material-col material-unit-value">Valor Unt</span>
          <span className="material-col material-total">Total</span>
        </div>

        {produtos &&
          produtos.map((p, index) => (
            <div key={index} className="material-row">
              <span className="material-col material-name">{p.material}</span>
              <span className="material-col material-qty">{p.quantidade}</span>
              <span className="material-col material-unit-value">
                {mostrarPreco ? `R$${Number(p.valorUnitario).toFixed(2)}` : ''}
              </span>
              <span className="material-col material-total">
                {mostrarPreco ? `R$${(Number(p.quantidade) * Number(p.valorUnitario)).toFixed(2)}` : ''}
              </span>
            </div>
          ))}

        <div className="material-footer-line" />

        <div className="total-geral">
          <span>Total R$</span>
          <span className={`total-geral-valor ${mostrarPreco ? '' : 'vazio'}`}>
            {mostrarPreco ? totalGeral.toFixed(2) : ''}
          </span>
        </div>
      </div>
    </div>
  );
}
