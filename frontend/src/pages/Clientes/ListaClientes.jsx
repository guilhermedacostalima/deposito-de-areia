import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/ListaClientes.css';

export default function ListaClientes() {
  const [clientes, setClientes] = useState([]);
  const [q, setQ] = useState('');
  const [order, setOrder] = useState('id');
  const [dir, setDir] = useState('asc');
  const [limit, setLimit] = useState(100);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});

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

  const startEditing = (cliente) => {
    setEditingId(cliente.id);
    setFormData({ ...cliente });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setFormData({});
  };

  const saveEditing = async (id) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/clientes/${id}/`, formData);
      fetchClientes();
      cancelEditing();
    } catch (err) {
      console.error('Erro ao salvar cliente:', err);
      alert('Erro ao salvar cliente. Veja o console para detalhes.');
    }
  };

  const deleteCliente = async (id) => {
    if (!window.confirm('Deseja realmente excluir este cliente?')) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/clientes/${id}/`);
      fetchClientes();
    } catch (err) {
      console.error('Erro ao deletar cliente:', err);
      alert('Erro ao deletar cliente. Veja o console para detalhes.');
    }
  };

  const handleChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  return (
    <div className="lista-clientes-container">
      <h2>Lista de Clientes</h2>

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
            <option value="cliente">Cliente</option>
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
                <td>
                  {editingId === c.id ? (
                    <input value={formData.cliente} onChange={(e) => handleChange(e, 'cliente')} />
                  ) : (
                    c.cliente
                  )}
                </td>
                <td>
                  {editingId === c.id ? (
                    <input value={formData.responsavel} onChange={(e) => handleChange(e, 'responsavel')} />
                  ) : (
                    c.responsavel
                  )}
                </td>
                <td>
                  {editingId === c.id ? (
                    <input value={formData.endereco} onChange={(e) => handleChange(e, 'endereco')} />
                  ) : (
                    c.endereco
                  )}
                </td>
                <td>
                  {editingId === c.id ? (
                    <input value={formData.numero} onChange={(e) => handleChange(e, 'numero')} />
                  ) : (
                    c.numero
                  )}
                </td>
                <td>
                  {editingId === c.id ? (
                    <input value={formData.cidade} onChange={(e) => handleChange(e, 'cidade')} />
                  ) : (
                    c.cidade
                  )}
                </td>
                <td>
                  {editingId === c.id ? (
                    <input value={formData.contato} onChange={(e) => handleChange(e, 'contato')} />
                  ) : (
                    c.contato
                  )}
                </td>
                <td>{new Date(c.created_at).toLocaleDateString('pt-BR')}</td>
                <td className="acoes-col">
                  {editingId === c.id ? (
                    <>
                      <button className="btn-edit" onClick={() => saveEditing(c.id)}>Salvar</button>
                      <button className="btn-delete" onClick={cancelEditing}>Cancelar</button>
                    </>
                  ) : (
                    <>
                      <button className="btn-edit" onClick={() => startEditing(c)}>Editar</button>
                      <button className="btn-delete" onClick={() => deleteCliente(c.id)}>Excluir</button>
                    </>
                  )}
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
