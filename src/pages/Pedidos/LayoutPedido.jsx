import React from 'react';
import '../../styles/LayoutPedido.css';

function InfoLine({ label, value }) {
  return (
    <span>
      <strong>{label}:</strong> {value}
    </span>
  );
}

export default function LayoutPedido({ pedido }) {
  if (!pedido) return null;

  const hoje = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div className="layout-pedido-container">
      <div className="layout-pedido-data">{hoje}</div>

      <div className="layout-pedido-info-container">
        {/* Dados do Cliente com borda */}
        <div className="cliente-container">
          <div className="layout-pedido-info-title">DADOS DO CLIENTE</div>
          <div className="layout-pedido-info-text idcliente-responsavel-group">
            <InfoLine label="ID" value={pedido.id} />
            <div className="cliente-responsavel-subgroup">
              <InfoLine label="Cliente" value={pedido.cliente} />
              <InfoLine label="Responsável" value={pedido.responsavel} />
            </div>
          </div>
        </div>

        {/* Endereço com borda */}
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

      {/* Container Material */}
      <div className="material-container">
        <div className="material-title">MATERIAL</div>
        <div className="material-header">
          <span className="material-col material-name">Material</span>
          <span className="material-col material-qty">Qtd</span>
          <span className="material-col material-unit-value">Valor Unt</span>
          <span className="material-col material-total">Total</span>
        </div>
        {/* Aqui depois você pode mapear os materiais do pedido */}
      </div>
    </div>
  );
}
