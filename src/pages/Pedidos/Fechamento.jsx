import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../../styles/Fechamento.css';

function Fechamento() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const dadosSalvos = localStorage.getItem('pedidosParaFechamento');
    if (dadosSalvos) {
      const pedidosComTotal = JSON.parse(dadosSalvos).map(pedido => {
        const total = pedido.materiais.reduce(
          (acc, mat) => acc + mat.qtd * mat.valorUnit,
          0
        );
        return { ...pedido, total };
      });
      setPedidos(pedidosComTotal);
    }
  }, []);

  const gerarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Fechamento de Pedidos', 14, 22);
    doc.setFontSize(12);

    const headers = [['Cliente', 'Responsável', 'Data', 'Status', 'Total (R$)']];
    const data = pedidos.map(p => [
      p.cliente,
      p.responsavel,
      new Date(p.data).toLocaleDateString('pt-BR'),
      p.status,
      p.total.toFixed(2).replace('.', ',')
    ]);

    doc.autoTable({
      startY: 30,
      head: headers,
      body: data,
    });

    doc.save('fechamento_pedidos.pdf');
  };

  return (
    <div className="fechamento-container">
      <h1>Fechamento de Pedidos</h1>
      <div className="fechamento-lista">
        {pedidos.length === 0 ? (
          <p>Nenhum pedido encontrado para fechamento.</p>
        ) : (
          pedidos.map((pedido, index) => (
            <div key={index} className="pedido-fechamento">
              <p><strong>Cliente:</strong> {pedido.cliente}</p>
              <p><strong>Responsável:</strong> {pedido.responsavel}</p>
              <p><strong>Data:</strong> {new Date(pedido.data).toLocaleDateString('pt-BR')}</p>
              <p><strong>Status:</strong> {pedido.status}</p>
              <p><strong>Total:</strong> R$ {pedido.total.toFixed(2).replace('.', ',')}</p>
            </div>
          ))
        )}
      </div>
      {pedidos.length > 0 && (
        <button className="botao-gerar-pdf" onClick={gerarPDF}>
          Gerar PDF
        </button>
      )}
    </div>
  );
}

export default Fechamento;
