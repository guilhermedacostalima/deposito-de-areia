import React, { useState } from 'react';
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

  const codigo = '001';

  function formatarTelefone(valor) {
    return valor
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d{4})$/, '$1-$2');
  }

  function handleChange(e) {
    const { name, value } = e.target;
    const novoValor = name === 'contato' ? formatarTelefone(value) : value;
    setFormData(prev => ({ ...prev, [name]: novoValor }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log('Formulário enviado:', formData);
    setFormData({
      cliente: '',
      responsavel: '',
      endereco: '',
      numero: '',
      bairro: '',
      cidade: '',
      contato: '',
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group cod">
        <label>Cód:</label>
        <input type="text" name="codigo" value={codigo} readOnly />
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
        <input
          type="tel"
          name="contato"
          value={formData.contato}
          onChange={handleChange}
          placeholder="(00) 00000-0000"
        />
      </div>

      <button type="submit">Cadastrar Cliente</button>
    </form>
  );
}
