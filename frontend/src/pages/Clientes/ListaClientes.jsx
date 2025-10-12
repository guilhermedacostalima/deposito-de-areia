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
      alert('Erro ao buscar clientes. Veja console.');
    }
  };

  useEffect(() => {
    fetchClientes();
    window.addEventListener('clientesUpdated', fetchClientes);
    return () => window.removeEventListener('clientesUpdated', fetchClientes);
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
      alert('Erro ao salvar cliente. Veja console.');
    }
  };

  const deleteCliente = async (id) => {
    if (!window.confirm('Deseja realmente excluir este cliente?')) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/clientes/${id}/`);
      fetchClientes();
    } catch (err) {
      console.error('Erro ao deletar cliente:', err);
      alert('Erro ao deletar cliente. Veja console.');
    }
  };

  const handleChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  return (
    <div className="lista-clientes-container">
      <h2>Lista de Clientes</h2>
      <input type="text" placeholder="Buscar..." value={q} onChange={(e) => setQ(e.target.value)} />
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Cliente</th><th>Responsável</th><th>Endereço</th><th>Número</th>
            <th>Bairro</th><th>Cidade</th><th>Contato</th><th>Data</th><th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {clientes.length > 0 ? clientes.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{editingId === c.id ? <input value={formData.cliente} onChange={e => handleChange(e,'cliente')}/> : c.cliente}</td>
              <td>{editingId === c.id ? <input value={formData.responsavel} onChange={e => handleChange(e,'responsavel')}/> : c.responsavel}</td>
              <td>{editingId === c.id ? <input value={formData.endereco} onChange={e => handleChange(e,'endereco')}/> : c.endereco || ''}</td>
              <td>{editingId === c.id ? <input value={formData.numero} onChange={e => handleChange(e,'numero')}/> : c.numero || ''}</td>
              <td>{editingId === c.id ? <input value={formData.bairro} onChange={e => handleChange(e,'bairro')}/> : c.bairro || ''}</td>
              <td>{editingId === c.id ? <input value={formData.cidade} onChange={e => handleChange(e,'cidade')}/> : c.cidade}</td>
              <td>{editingId === c.id ? <input value={formData.contato} onChange={e => handleChange(e,'contato')}/> : c.contato || ''}</td>
              <td>{new Date(c.created_at).toLocaleDateString('pt-BR')}</td>
              <td>
                {editingId === c.id ? 
                  <>
                    <button onClick={() => saveEditing(c.id)}>Salvar</button>
                    <button onClick={cancelEditing}>Cancelar</button>
                  </> :
                  <>
                    <button onClick={() => startEditing(c)}>Editar</button>
                    <button onClick={() => deleteCliente(c.id)}>Excluir</button>
                  </>
                }
              </td>
            </tr>
          )) : <tr><td colSpan="10">Nenhum cliente encontrado.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
