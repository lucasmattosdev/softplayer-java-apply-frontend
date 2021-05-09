import AbstractService from './abstract-service'

export default class PessoaService extends AbstractService {
  constructor(){
    super("pessoa");
    
    this.consulta = (page, orderColumn, orderBy, filter)=>{
      return this.post('consulta', {page: page, orderColumn: orderColumn, orderBy: orderBy, filter: filter});
    }
    
    this.getPessoa = (idPessoa)=>{
      return this.get(idPessoa);
    }
    
    this.deletePessoa = (idPessoa)=>{
      return this.delete(idPessoa);
    }
    
    this.postPessoa = (pessoa)=>{
      return this.post("", pessoa);
    }
    
    this.putPessoa = (pessoa)=>{
      return this.put("", pessoa);
    }
  }
}