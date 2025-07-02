import { useState } from 'react';
import dayjs from 'dayjs';
import '../../styles/NovoFuncionario.css';

export default function RegistrarFuncionario() {
  const [funcionario, setFuncionario] = useState({
    nome: '',
    cargo: '',
    dataAdmissao: '',
    dataDemissao: '',
    dataNascimento: '',
    salarioBase: '',
    tipoRemuneracao: 'Salario Fixo',
    contato: '',
    endereco: '',
    numero: '',
    bairro: '',
    cidade: '',
  });

  const handleChange = (e) => {
    setFuncionario({ ...funcionario, [e.target.name]: e.target.value });
  };

  const calcularTempoAtividade = (dataAdmissao, dataDemissao) => {
    if (!dataAdmissao) return null;
    const admissao = dayjs(dataAdmissao);
    const demissao = dataDemissao ? dayjs(dataDemissao) : dayjs();
    if (demissao.isBefore(admissao)) return null;

    const anos = demissao.diff(admissao, 'year');
    const meses = demissao.subtract(anos, 'year').diff(admissao, 'month');
    const dias = demissao
      .subtract(anos, 'year')
      .subtract(meses, 'month')
      .diff(admissao, 'day');

    let resultado = '';
    if (anos > 0) resultado += `${anos} ano${anos > 1 ? 's' : ''} `;
    if (meses > 0) resultado += `${meses} mês${meses > 1 ? 'es' : ''} `;
    if (dias > 0) resultado += `${dias} dia${dias > 1 ? 's' : ''}`;

    return resultado.trim() || '0 dias';
  };

  const tempoAtividade = calcularTempoAtividade(funcionario.dataAdmissao, funcionario.dataDemissao);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Funcionário cadastrado:', funcionario);

    setFuncionario({
      nome: '',
      cargo: '',
      dataAdmissao: '',
      dataDemissao: '',
      dataNascimento: '',
      salarioBase: '',
      tipoRemuneracao: 'Salario Fixo',
      contato: '',
      endereco: '',
      numero: '',
      bairro: '',
      cidade: '',
    });
  };

  return (
    <div className="novo-funcionario-container">
      <h2>Cadastrar Novo Funcionário</h2>

      <form className="novo-funcionario-form" onSubmit={handleSubmit}>
        {/* Dados */}
        <fieldset>
          <legend>Dados</legend>

          <input
            type="text"
            name="nome"
            placeholder="Nome"
            value={funcionario.nome}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="cargo"
            placeholder="Cargo"
            value={funcionario.cargo}
            onChange={handleChange}
          />

          <input
            type="text"
            name="contato"
            placeholder="Contato"
            value={funcionario.contato}
            onChange={handleChange}
          />
        </fieldset>

        {/* Endereço */}
        <fieldset>
          <legend>Endereço</legend>

          <input
            type="text"
            name="endereco"
            placeholder="Endereço"
            value={funcionario.endereco}
            onChange={handleChange}
          />

          <div className="numero-bairro-container">
            <input
              type="text"
              name="numero"
              placeholder="Número"
              value={funcionario.numero}
              onChange={handleChange}
            />
            <input
              type="text"
              name="bairro"
              placeholder="Bairro"
              value={funcionario.bairro}
              onChange={handleChange}
            />
          </div>

          <input
            type="text"
            name="cidade"
            placeholder="Cidade"
            value={funcionario.cidade}
            onChange={handleChange}
          />
        </fieldset>

        {/* Informações Contratuais */}
        <fieldset>
          <legend>Informações Contratuais</legend>

          <div className="grid-2-cols">
            <div className="input-com-label">
              <input
                type="date"
                name="dataAdmissao"
                value={funcionario.dataAdmissao}
                onChange={handleChange}
                placeholder="Data de Admissão"
              />
            </div>

            <div className="input-com-label">
              <input
                type="date"
                name="dataDemissao"
                value={funcionario.dataDemissao}
                onChange={handleChange}
                placeholder="Data de Demissão"
              />
            </div>
          </div>

          {tempoAtividade && (
            <div className="info-dinamica">
              <strong>Tempo em atividade:</strong> {tempoAtividade}
            </div>
          )}

          <div className="grid-2-cols">
            <input
              type="number"
              name="salarioBase"
              placeholder="Salário Base"
              value={funcionario.salarioBase}
              onChange={handleChange}
            />

            <select
              name="tipoRemuneracao"
              value={funcionario.tipoRemuneracao}
              onChange={handleChange}
            >
              <option value="Salario Fixo">Salário Fixo</option>
              <option value="Comissionado">Comissionado</option>
            </select>
          </div>
        </fieldset>

        <button type="submit">Salvar Funcionário</button>
      </form>
    </div>
  );
}
