import React, {Component} from 'react';
import CryptoJS from 'crypto-js';
import './login-page.scss'
import UsuarioService from '../../service/usuario-service'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Spinner from 'react-bootstrap/Spinner'
import Alert from 'react-bootstrap/Alert'

export default class LoginPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      nome: "soft",
      senha: "123",
      isLoading: false,
      errorMessage: undefined
    }
    this.usuarioService = new UsuarioService();
    
    this.validarUsuarioSenha = (e)=>{
      e.preventDefault();

      if (!this.state.isLoading){
        this.setState({ errorMessage: undefined });
        this.setState({ isLoading: true });

        let senhaCrip = CryptoJS.SHA256(this.state.senha).toString();
        this.usuarioService.validarNomeSenha(this.state.nome, senhaCrip).then(_=>{
          this.setState({ isLoading: false });
          window.localStorage.nome = this.state.nome;
          window.localStorage.credential = btoa(this.state.nome+":"+senhaCrip);
          window.location.href = "/";
        }).catch((error)=>{
          this.setState({ isLoading: false });
          if (error.response){
            this.setState({ errorMessage: error.response.data.error !== undefined ?
              error.response.data.error:error.response.data });
          } else {
            this.setState({ errorMessage: error.toString() });
          }
        });
      }
    }
  }

  render() {
    return (
      <login-page>
        <div className="form-signin">
          <img className="mb-4" src="/img/logo-dark.png" alt="" width="200" height="100" />

          <Form onSubmit={this.validarUsuarioSenha}>
            {this.state.errorMessage !== undefined?(<Alert variant="danger">{this.state.errorMessage}</Alert>):("")}

            <label htmlFor="inputNome" className="sr-only">Nome</label>
            <FormControl type="text" id="inputNome" className="form-control" placeholder="Nome" required={true}
                value={this.state.nome}
                onChange={e => this.setState({ nome: e.target.value })}
                disabled={this.state.isLoading}/>
            <label htmlFor="inputPassword" className="sr-only">Senha</label>
            <FormControl type="password" id="inputPassword" className="form-control" placeholder="Senha" required={true} 
                value={this.state.senha}
                onChange={e => this.setState({ senha: e.target.value })}
                disabled={this.state.isLoading} />
            <button className="btn btn-lg btn-primary btn-block" type="submit">
              {!this.state.isLoading?("Acessar"):(<Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner>)}
            </button>
          </Form>

          <p className="mt-5 mb-3 text-muted">© {new Date().getFullYear()} Lucas Mattos. Todos os direitos reservados.</p>
        </div>
      </login-page>
    )
  }

}
