import AbstractService from './abstract-service'

export default class UsuarioService extends AbstractService {
  constructor(){
    super("usuario");
    
    this.validarNomeSenha = (nome, senha)=>{
      return this.post('validarNomeSenha', {nome: nome, senha: senha});
    }
  }
}