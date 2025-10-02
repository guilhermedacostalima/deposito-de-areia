import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/NovoCliente.css';

export default function NovoCliente() {
  const [formData, setFormData] = useState({
    cliente: '',
    responsavel: '',
    endereco: '',
    numero: '',
    bairro: '',
    cidade: '',
    contato: '',
  });
  const [nextId, setNextId] = useState(null);
  const [loadingId, setLoadingId] = useState(true);
  const [saving, setSaving] = useState(false);

  // Formata telefone
  function formatarTelefone(valor) {
    return valor
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d{4})$/, '$1-$2');
  }

  // Busca próximo ID
  async function fetchNextId() {
    setLoadingId(true);
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/clientes/');
      const clientes = res.data;
      const maxId = clientes.length > 0 ? Math.max(...clientes.map(c => c.id)) : 0;
      setNextId(maxId + 1);
    } catch (err) {
      console.error(err);
      setNextId(null);
    } finally {
      setLoadingId(false);
    }
  }

  useEffect(() => { fetchNextId(); }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    const novoValor = name === 'contato' ? formatarTelefone(value) : value;
    setFormData(prev => ({ ...prev, [name]: novoValor }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.cliente || !formData.cidade) {
      alert('Preencha Cliente e Cidade.');
      return;
    }

    setSaving(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/clientes/', formData);
      alert(`Cliente cadastrado com ID ${response.data.id}`);

      setFormData({ cliente:'', responsavel:'', endereco:'', numero:'', bairro:'', cidade:'', contato:'' });
      fetchNextId();
      window.dispatchEvent(new Event('clientesUpdated'));
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      alert('Erro ao cadastrar cliente. Veja console.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group cod">
        <label>Cód:</label>
        <input type="text" value={loadingId ? '...' : nextId?.toString().padStart(3,'0')} readOnly />
      </div>
      <div className="form-group cliente">
        <label>Cliente:</label>
        <input type="text" name="cliente" value={formData.cliente} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Responsável:</label>
        <input type="text" name="responsavel" value={formData.responsavel} onChange={handleChange} />
      </div>
      <div className="form-group form-group-full">
        <label>Endereço:</label>
        <input type="text" name="endereco" value={formData.endereco} onChange={handleChange} />
      </div>
      <div className="form-group numero">
        <label>Número:</label>
        <input type="text" name="numero" value={formData.numero} onChange={handleChange} />
      </div>
      <div className="form-group bairro">
        <label>Bairro:</label>
        <input type="text" name="bairro" value={formData.bairro} onChange={handleChange} />
      </div>
      <div className="form-group cidade">
        <label>Cidade:</label>
        <select name="cidade" value={formData.cidade} onChange={handleChange} required>
          <option value="">-- Selecione --</option>
          <option value="Santa Barbara D'Oeste">Santa Barbara D'Oeste</option>
          <option value="Americana">Americana</option>
          <option value="Nova Odessa">Nova Odessa</option>
          <option value="Limeira">Limeira</option>
          <option value="Mombuca">Mombuca</option>
          <option value="Rafard">Rafard</option>
          <option value="Campinas">Campinas</option>
          <option value="Piracicaba">Piracicaba</option>
          <option value="Outra">Outra</option>
        </select>
      </div>
      <div className="form-group contato">
        <label>Contato:</label>
        <input type="tel" name="contato" value={formData.contato} onChange={handleChange} placeholder="(00) 00000-0000" />
      </div>
      <button type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Cadastrar Cliente'}</button>
    </form>
  );
}
