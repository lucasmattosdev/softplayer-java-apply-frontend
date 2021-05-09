import React, {Component} from 'react';
import PessoaService from '../../service/pessoa-service'
import Moment from 'moment';
import Header from '../../components/header/header';
import PessoaPageCad from './components/pessoa-page-cad'
import './pessoa-page.scss'

export default class PessoaPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      listaPessoas: undefined,
      pessoal: undefined,
      page: 1
    }
    this.pessoaService = new PessoaService();
    this.defaultDateFormat = "DD/MM/YYYY";
    this.defaultDateTimeFormat = "DD/MM/YYYY HH:mm:ss";
  }

  componentDidMount() {
    this.atualizarConsulta(1);
  }

  atualizarConsulta(page) {
    window.loadingUi(true);
    if (page !== undefined) this.setState({page: page})
    else page = this.state.page
    this.pessoaService.consulta(page, "id", "ASC").then(data => {
      window.loadingUi(false);
      this.setState({listaPessoas: data.data})
    });
  };

  setarPessoa(pessoa) {
    this.setState({pessoa: pessoa})
  };

  fecharModalPessoa() {
    this.setState({pessoa: undefined})
    this.atualizarConsulta();
  };

  deletePessoa(pessoa) {
    if(window.confirm("Você realmente deseja deletar "+pessoa.nome+"?")) {
      this.pessoaService.deletePessoa(pessoa.id).then(data => {
        this.atualizarConsulta();
      });
    }
  };

  render() {
    let firstPaginationButtonPage;
    let secondPaginationButtonPage;
    let thirdPaginationButtonPage;
    let totalPages;
    if(this.state.listaPessoas){
      firstPaginationButtonPage = this.state.page<2?1:this.state.page-1;
      secondPaginationButtonPage = this.state.page<2?2:this.state.page;
      thirdPaginationButtonPage = this.state.page<2?3:this.state.page+1;
      totalPages = window.Math.ceil(this.state.listaPessoas.totalResultCount/10);
    }
    
    return (
      <pessoa-page>
        <Header></Header>
        {!this.state.listaPessoas?(""):(
          <div className="container mt-4">
          <h1 className="display-4 mb-3">Lista de Pessoas</h1>
          <button type="button" className="btn btn-success float-right adicionar-pessoa" onClick={()=>{this.setarPessoa({});}}><i className="fas fa-user-plus"></i></button>
          <div className="table-responsive mb-3">
            <table id="lista-pessoas" className="table table-striped table-bordered table-sm mb-0" cellSpacing="0" width="100%">
              <thead>
                <tr>
                  <th className="th-sm">Ações</th>
                  <th className="th-sm">ID</th>
                  <th className="th-sm">Nome</th>
                  <th className="th-sm">Sexo</th>
                  <th className="th-sm">Email</th>
                  <th className="th-sm">Data Nascimento</th>
                  <th className="th-sm">Naturalidade</th>
                  <th className="th-sm">Nacionalidade</th>
                  <th className="th-sm">CPF</th>
                  <th className="th-sm">Criado Em</th>
                  <th className="th-sm">Ultima Modificação</th>
                </tr>
              </thead>
              <tbody>
                {this.state.listaPessoas.results.length === 0?<td className="py-3" colspan="11">Nenhuma Pessoa Encontrada</td>:
                this.state.listaPessoas.results.map(pessoa => 
                  <tr key={pessoa.id}>
                    <td>
                      <div className="btn-group" role="group" aria-label="Ações para Pessoa">
                        <button type="button" className="btn btn-warning btn-sm" onClick={()=>this.setarPessoa(pessoa)}><i className="fas fa-pencil"></i></button>
                        <button type="button" className="btn btn-danger btn-sm" onClick={()=>this.deletePessoa(pessoa)}><i className="fas fa-trash"></i></button>
                      </div>
                    </td>
                    <td>#{pessoa.id}</td>
                    <td>{pessoa.nome}</td>
                    <td>{pessoa.sexo}</td>
                    <td>{pessoa.email}</td>
                    <td>{Moment(pessoa.dataNascimento).format(this.defaultDateFormat)}</td>
                    <td>{pessoa.naturalidade}</td>
                    <td>{pessoa.nacionalidade}</td>
                    <td>{pessoa.cpf}</td>
                    <td>{Moment(pessoa.criadoEm).format(this.defaultDateTimeFormat)}</td>
                    <td>{pessoa.ultimaModificacao!==null?Moment(pessoa.ultimaModificacao).format(this.defaultDateTimeFormat):""}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <nav aria-label="Page navigation">
            <div className="row">
              <div className="col-sm-6">
                <ul className="pagination">
                  <li className="page-item">Mostrando <b>{this.state.listaPessoas.results.length}</b> de <b>{this.state.listaPessoas.totalResultCount}</b> {this.state.listaPessoas.results.length<2?"item":"itens"}</li>
                </ul>
              </div>
              <div className="col-sm-6">
                <ul className="pagination justify-content-end">
                  <li className={"page-item"+(this.state.page<2?" disabled":"")}><button className="page-link" onClick={() => this.atualizarConsulta(this.state.page-1)} tabIndex="-1">Anterior</button></li>
                  <li className={"page-item"+(this.state.page===firstPaginationButtonPage?" active":"")}><button className="page-link" onClick={() => this.atualizarConsulta(firstPaginationButtonPage)}>{firstPaginationButtonPage}</button></li>
                  <li className={"page-item"+(totalPages<secondPaginationButtonPage?" disabled":"")+(this.state.page===secondPaginationButtonPage?" active":"")}><button className="page-link" onClick={() => this.atualizarConsulta(secondPaginationButtonPage)}>{secondPaginationButtonPage}</button></li>
                  <li className={"page-item"+(totalPages<thirdPaginationButtonPage?" disabled":"")+(this.state.page===thirdPaginationButtonPage?" active":"")}><button className="page-link" onClick={() => this.atualizarConsulta(thirdPaginationButtonPage)}>{thirdPaginationButtonPage}</button></li>
                  <li className={"page-item"+(totalPages<=this.state.page?" disabled":"")}><button className="page-link" onClick={() => this.atualizarConsulta(this.state.page+1)}>Próximo</button></li>
                </ul>
              </div>
            </div>
          </nav>
          </div>
        )}

        {this.state.pessoa!==undefined?(
          <PessoaPageCad pessoa={this.state.pessoa} fecharModal={()=>{this.fecharModalPessoa();}}></PessoaPageCad>
        ):("")}
        
      </pessoa-page>
    )
  }

}
