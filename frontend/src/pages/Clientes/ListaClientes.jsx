import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/ListaClientes.css';

export default function ListaClientes() {
  const [clientes, setClientes] = useState([]);
  const [q, setQ] = useState('');
  const [order, setOrder] = useState('id');
  const [dir, setDir] = useState('asc');
  const [limit, setLimit] = useState(100);

  const fetchClientes = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/clientes/', {
        params: { q, order, dir, limit },
      });
      setClientes(res.data);
    } catch (err) {
      console.error('Erro ao buscar clientes:', err);
      alert('Erro ao buscar clientes. Veja o console para detalhes.');
    }
  };

  useEffect(() => {
    fetchClientes();
  }, [q, order, dir, limit]);

  return (
    <div className="lista-clientes-container">
      <h2>Lista de Clientes</h2>

      {/* Controles de busca e filtro */}
      <div className="lista-clientes-controls">
        <input
          type="text"
          placeholder="Buscar cliente, ID, contato ou responsável..."
          className="search-input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <div className="filters">
          <select value={order} onChange={(e) => setOrder(e.target.value)}>
            <option value="id">ID</option>
            <option value="cliente">Ordem Alfabética</option>
            <option value="created_at">Data Cadastro</option>
          </select>

          <select value={dir} onChange={(e) => setDir(e.target.value)}>
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>
        </div>
      </div>

      <table className="clientes-table">
        <thead>
          <tr>
            <th className="id-col">ID</th>
            <th>Cliente</th>
            <th>Responsável</th>
            <th>Endereço</th>
            <th>Número</th>
            <th className="cidade-col">Cidade</th>
            <th>Contato</th>
            <th className="data-col">Data Cadastro</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {clientes.length > 0 ? (
            clientes.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.cliente}</td>
                <td>{c.responsavel}</td>
                <td>{c.endereco}</td>
                <td>{c.numero}</td>
                <td>{c.cidade}</td>
                <td>{c.contato}</td>
                <td>{new Date(c.created_at).toLocaleDateString('pt-BR')}</td>
                <td>
                  <button onClick={() => alert('Editar não implementado')}>Editar</button>
                  <button onClick={() => alert('Excluir não implementado')}>Excluir</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">Nenhum cliente encontrado.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
