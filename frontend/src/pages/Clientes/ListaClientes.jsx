import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/ListaClientes.css';

export default function ListaClientes() {
  const [clientes, setClientes] = useState([]);
  const [search, setSearch] = useState('');
  const [pagina, setPagina] = useState(1);
  const clientesPorPagina = 30;

  // Busca todos os clientes
  async function fetchClientes() {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/clientes/');
      // Ordena alfabeticamente pelo nome do cliente
      const ordenados = res.data.sort((a, b) => a.cliente.localeCompare(b.cliente));
      setClientes(ordenados);
    } catch (err) {
      console.error('Erro ao buscar clientes:', err);
      alert('Erro ao buscar clientes');
    }
  }

  useEffect(() => {
    fetchClientes();
  }, []);

  // Filtra clientes de acordo com search
  const clientesFiltrados = clientes.filter(c =>
    c.cliente.toLowerCase().includes(search.toLowerCase()) ||
    c.responsavel.toLowerCase().includes(search.toLowerCase()) ||
    c.contato.toLowerCase().includes(search.toLowerCase()) ||
    String(c.id) === search
  );

  // Paginação
  const totalPaginas = Math.ceil(clientesFiltrados.length / clientesPorPagina);
  const clientesPaginaAtual = clientesFiltrados.slice(
    (pagina - 1) * clientesPorPagina,
    pagina * clientesPorPagina
  );

  // Ações de editar/deletar (só exemplo)
  function editarCliente(cliente) {
    alert(`Editar cliente ID ${cliente.id} (implementar lógica)`);
  }

  async function deletarCliente(cliente) {
    if (!window.confirm(`Deseja deletar o cliente ${cliente.cliente}?`)) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/clientes/${cliente.id}/`);
      setClientes(prev => prev.filter(c => c.id !== cliente.id));
      alert('Cliente deletado!');
    } catch (err) {
      console.error(err);
      alert('Erro ao deletar cliente');
    }
  }

  return (
    <div className="lista-clientes-container">
      <h2>Clientes Cadastrados</h2>

      <input
        type="text"
        placeholder="Pesquisar por nome, ID, responsável ou contato..."
        value={search}
        onChange={e => {
          setSearch(e.target.value);
          setPagina(1); // reseta pra primeira página ao pesquisar
        }}
        className="search-input"
      />

      {clientesPaginaAtual.length === 0 ? (
        <p>Nenhum cliente encontrado.</p>
      ) : (
        <>
          <table className="clientes-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Responsável</th>
                <th>Endereço</th>
                <th>Bairro</th>
                <th>Cidade</th>
                <th>Contato</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientesPaginaAtual.map(cliente => (
                <tr key={cliente.id}>
                  <td>{cliente.id}</td>
                  <td>{cliente.cliente}</td>
                  <td>{cliente.responsavel}</td>
                  <td>{cliente.endereco}</td>
                  <td>{cliente.bairro}</td>
                  <td>{cliente.cidade}</td>
                  <td>{cliente.contato}</td>
                  <td>
                    <button onClick={() => editarCliente(cliente)}>✏️</button>
                    <button onClick={() => deletarCliente(cliente)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginação */}
          <div className="paginacao">
            <button onClick={() => setPagina(p => Math.max(p - 1, 1))} disabled={pagina === 1}>
              ◀️
            </button>
            <span>Página {pagina} de {totalPaginas}</span>
            <button onClick={() => setPagina(p => Math.min(p + 1, totalPaginas))} disabled={pagina === totalPaginas}>
              ▶️
            </button>
          </div>
        </>
      )}
    </div>
  );
}
