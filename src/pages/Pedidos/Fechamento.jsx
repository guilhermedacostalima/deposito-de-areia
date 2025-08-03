import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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
    try {
      const doc = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'landscape' });
      doc.setFontSize(14);
      doc.text('Fechamento de Pedidos', 40, 40);

      const headers = [
        [
          'Data',
          'Pedido',
          'Cliente',
          'Responsável',
          'Endereço',
          'Material',
          'Qtd',
          'Valor Unit.',
          'Total Material',
          'Total Pedido',
        ],
      ];

      const body = [];
      const pedidoIndices = []; // Para controlar a cor por pedido

      pedidos.forEach((p, pedidoIndex) => {
        p.materiais.forEach((mat, matIndex) => {
          const enderecoExibir =
            p.tipoPedido === 'Retirada'
              ? 'Retirada'
              : `${p.endereco.rua}, ${p.endereco.numero} - ${p.endereco.bairro}, ${p.endereco.cidade}`;

          body.push([
            matIndex === 0 ? new Date(p.data).toLocaleDateString('pt-BR') : '',
            matIndex === 0 ? (p.id?.toString() || '') : '',
            matIndex === 0 ? p.cliente : '',
            matIndex === 0 ? p.responsavel : '',
            matIndex === 0 ? enderecoExibir : '',
            mat.nome,
            mat.qtd.toString(),
            'R$ ' + mat.valorUnit.toFixed(2).replace('.', ','),
            'R$ ' + (mat.qtd * mat.valorUnit).toFixed(2).replace('.', ','),
            matIndex === p.materiais.length - 1
              ? 'R$ ' + p.total.toFixed(2).replace('.', ',')
              : '',
          ]);
          pedidoIndices.push(pedidoIndex);
        });
      });

      autoTable(doc, {
        head: headers,
        body: body,
        startY: 60,
        margin: { left: 30, right: 30 },
        styles: { fontSize: 11, cellPadding: 3 },
        headStyles: { fillColor: [0, 123, 255] },
        columnStyles: {
          0: { cellWidth: 70 },
          1: { cellWidth: 45 },
          2: { cellWidth: 100 },
          3: { cellWidth: 100 },
          4: { cellWidth: 150 },
          5: { cellWidth: 80 },
          6: { cellWidth: 25, halign: 'right' },
          7: { cellWidth: 60, halign: 'right' },
          8: { cellWidth: 70, halign: 'right' },
          9: { cellWidth: 70, halign: 'right' },
        },
        didDrawPage: (data) => {
          const pageCount = doc.internal.getNumberOfPages();
          doc.setFontSize(9);
          doc.text(
            `Página ${data.pageNumber} de ${pageCount}`,
            doc.internal.pageSize.getWidth() - 60,
            doc.internal.pageSize.getHeight() - 10
          );
        },
        didParseCell: (data) => {
          if (data.section === 'body') {
            const pedidoIndex = pedidoIndices[data.row.index];
            if (pedidoIndex % 2 === 0) {
              data.cell.styles.fillColor = [245, 245, 245]; // Cor clara
            } else {
              data.cell.styles.fillColor = [225, 235, 255]; // Cor azulada clara
            }
          }
        },
      });

      const totalPedidos = pedidos.length;
      const somaTotalFechamento = pedidos.reduce((acc, p) => acc + p.total, 0);
      const finalY = doc.lastAutoTable.finalY || 60;
      doc.setFontSize(12);
      doc.text(
        `Total Pedidos: ${totalPedidos}    Total Fechamento: R$ ${somaTotalFechamento.toFixed(2).replace('.', ',')}`,
        40,
        finalY + 30
      );

      doc.save('fechamento_pedidos.pdf');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Veja o console para detalhes.');
    }
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
              <p>
                <strong>Endereço:</strong>{' '}
                {pedido.tipoPedido === 'Retirada'
                  ? 'Retirada'
                  : `${pedido.endereco.rua}, ${pedido.endereco.numero} - ${pedido.endereco.bairro}, ${pedido.endereco.cidade}`}
              </p>
              <p><strong>Data:</strong> {new Date(pedido.data).toLocaleDateString('pt-BR')}</p>

              <table>
                <thead>
                  <tr>
                    <th>Material</th>
                    <th>Qtd</th>
                    <th>Valor Unit.</th>
                    <th>Total Material</th>
                  </tr>
                </thead>
                <tbody>
                  {pedido.materiais.map((mat, i) => (
                    <tr key={i}>
                      <td>{mat.nome}</td>
                      <td>{mat.qtd}</td>
                      <td>R$ {mat.valorUnit.toFixed(2).replace('.', ',')}</td>
                      <td>R$ {(mat.qtd * mat.valorUnit).toFixed(2).replace('.', ',')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p style={{ marginTop: '8px', fontWeight: 'bold' }}>
                Total do Pedido: R$ {pedido.total.toFixed(2).replace('.', ',')}
              </p>
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
