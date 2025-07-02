import React from 'react';
import '../../styles/LayoutPedido.css';

export default function LayoutPedido({ pedido }) {
  if (!pedido) return null;

  return (
    <div className="layout-pedido-container">
      <div className="layout-pedido-data">
        {new Date().toLocaleDateString()}
      </div>

      <div className="layout-pedido-info-container">
        <div className="layout-pedido-info-title">DADOS DO CLIENTE</div>
        <div className="layout-pedido-info-text">
          <strong>ID:</strong> {pedido.id} &nbsp;&nbsp;&nbsp;
          <strong>Cliente:</strong> {pedido.cliente} &nbsp;&nbsp;&nbsp;
          <strong>Responsável:</strong> {pedido.responsavel}
        </div>

        <div className="layout-pedido-info-title">ENDEREÇO</div>
        <div className="layout-pedido-info-text">
          <strong>Endereço:</strong> {pedido.endereco}
        </div>
        <div className="layout-pedido-info-text">
          <strong>Número:</strong> {pedido.numero} &nbsp;&nbsp;&nbsp;
          <strong>Bairro:</strong> {pedido.bairro}
        </div>
        <div className="layout-pedido-info-text">
          <strong>Cidade:</strong> {pedido.cidade} &nbsp;&nbsp;&nbsp;
          <strong>Contato:</strong> {pedido.contato}
        </div>
      </div>
    </div>
  );
}
