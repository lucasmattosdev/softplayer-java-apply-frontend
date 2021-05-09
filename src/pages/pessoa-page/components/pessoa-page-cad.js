import React, {Component} from 'react';
import PessoaService from '../../../service/pessoa-service'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Alert from 'react-bootstrap/Alert';
import Moment from 'moment';

export default class PessoaPageCad extends Component {
  constructor(props) {
    super(props)
    this.pessoaService = new PessoaService();
    this.defaultDateFormat = "DD/MM/YYYY";
    this.state = {
      error: undefined,
      errorServer: undefined,
      pessoa: props.pessoa,
      dataNascimentoString: props.pessoa.dataNascimento!==undefined?Moment(props.pessoa.dataNascimento).format(this.defaultDateFormat):'',
    };
    this.fecharModal = props.fecharModal;
  }

  componentDidMount() {
    if (this.state.pessoa.id !== undefined){
      window.loadingUi(true);
      this.pessoaService.getPessoa(this.state.pessoa.id).then((data)=>{
        let pessoa = data.data;
        this.setState(pessoa);
        window.loadingUi(false);
      });
    }
  }

  persistPessoa(e){
    e.preventDefault();
    window.loadingUi(true);
    this.setState({error: undefined, errorServer: undefined});

    let errorList = {};
    if (!this.validarCPF(this.state.pessoa.cpf.replace(/\D/g, "")))errorList["cpf"] = "Digite um CPF válido";
    if (isNaN(this.state.pessoa.dataNascimento))errorList["dataNascimento"] = "Digite uma Data de Nascimento válida";
    else if (this.state.pessoa.dataNascimento > Moment().valueOf())errorList["dataNascimento"] = "A Data de Nascimento não pode ser posterior a data de Hoje";

    if (Object.keys(errorList).length>0){
      this.setState({error: errorList});
      window.loadingUi(false);
      return;
    }

    let callFunction;
    if (this.state.pessoa.id !== undefined){
      callFunction = this.pessoaService.postPessoa;
    } else {
      callFunction = this.pessoaService.putPessoa;
    }

    callFunction(this.state.pessoa).then((_)=>{
      window.loadingUi(false);
      this.fecharModal();
    }).catch((error)=>{
      window.loadingUi(false);
      if (error.response){
        this.setState({errorServer: error.response.data.error !== undefined ?
          error.response.data.error:error.response.data });
      } else {
        this.setState({ errorServer: error.toString() });
      }
    })
  }

  validarCPF(strCPF) {
    var Soma;
    var Resto;
    Soma = 0;
    if (strCPF === "00000000000") return false;
    if (strCPF === "12345678909") return false;

    for (let i=1; i<=9; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto === 10) || (Resto === 11))  Resto = 0;
    if (Resto !== parseInt(strCPF.substring(9, 10)) ) return false;

    Soma = 0;
    for (let i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto === 10) || (Resto === 11))  Resto = 0;
    if (Resto !== parseInt(strCPF.substring(10, 11) ) ) return false;
    return true;
  }

  atualizarCPF(cpf){
    let formatedCpf = cpf.replace(/\D/g, "").replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').replace(/(-\d{2})\d+?$/, '$1');
    this.atualizarCampoPessoa("cpf", formatedCpf);
  }

  atualizarDataNascimento(dataNascimento){
    let formateddataNascimento = dataNascimento.replace(/\D/g, "").replace(/(\d{2})(\d)/, '$1/$2').replace(/(\d{2})(\d)/, '$1/$2');
    this.setState({dataNascimentoString: formateddataNascimento});
    if (formateddataNascimento.length === 10){
      this.atualizarCampoPessoa("dataNascimento", Moment(formateddataNascimento, 'DD-MM-YYYY').valueOf());
      
    }
  }

  atualizarCampoPessoa(campo, valor){
    let pessoa = {...this.state.pessoa};
    pessoa[campo] = valor;
    this.setState({pessoa: pessoa});
  }

  converterValorInput(valor){
    if (valor===undefined || valor === null) return ""
    return valor;
  }

  render() {
    return (
      <pessoa-page-cad>
        {this.state.pessoa!==undefined?(
          <Modal show={this.state.pessoa!==undefined} onHide={()=>{this.fecharModal()}}>
            <Form onSubmit={(e)=>this.persistPessoa(e)}>
              <Modal.Header closeButton>
                <Modal.Title className="text-truncate">{this.state.pessoa.id?"Editando "+this.state.pessoa.nome:"Cadastrar Pessoa"}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
              {this.state.errorServer !== undefined?(<Alert variant="danger">{this.state.errorServer}</Alert>):("")}
                {/* NOME */}
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="inputGroup-nome">Nome <span className="text-danger pl-1">*</span></InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    aria-label="Nome"
                    aria-describedby="inputGroup-nome"
                    name="inputGroup-nome"
                    minLength="2"
                    maxLength="50"
                    required
                    value={this.converterValorInput(this.state.pessoa.nome)}
                    onChange={e => this.atualizarCampoPessoa("nome", e.target.value)}
                  />
                </InputGroup>

                {/* SEXO */}
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="inputGroup-nome">Sexo</InputGroup.Text>
                  </InputGroup.Prepend>
                  <ButtonGroup className="form-control p-0">
                    <Button variant={this.state.pessoa.sexo==="MASCULINO"?"success":"ligth"} onClick={()=>{this.atualizarCampoPessoa("sexo", this.state.pessoa.sexo==="MASCULINO"?undefined:"MASCULINO")}}>MASCULINO</Button>
                    <Button variant={this.state.pessoa.sexo==="FEMININO"?"success":"ligth"} onClick={()=>{this.atualizarCampoPessoa("sexo", this.state.pessoa.sexo==="FEMININO"?undefined:"FEMININO")}}>FEMININO</Button>
                    <Button variant={this.state.pessoa.sexo==="OUTRO"?"success":"ligth"} onClick={()=>{this.atualizarCampoPessoa("sexo", this.state.pessoa.sexo==="OUTRO"?undefined:"OUTRO")}}>OUTRO</Button>
                  </ButtonGroup>
                </InputGroup>

                {/* EMAIL */}
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="inputGroup-email">Email</InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    aria-label="Email"
                    aria-describedby="inputGroup-email"
                    name="inputGroup-email"
                    type="email"
                    maxLength="80"
                    value={this.converterValorInput(this.state.pessoa.email)}
                    onChange={e => this.atualizarCampoPessoa("email", e.target.value)}
                  />
                </InputGroup>

                {/* DATA NASCIMENTO */}
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="inputGroup-nome">Data Nascimento <span className="text-danger pl-1">*</span></InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    aria-label="Data Nascimento"
                    aria-describedby="inputGroup-data-nascimento"
                    name="inputGroup-data-nascimento"
                    minLength="10"
                    maxLength="10"
                    required
                    value={this.state.dataNascimentoString}
                    onChange={e => this.atualizarDataNascimento(e.target.value)}
                    isInvalid={this.state.error!==undefined&&this.state.error["dataNascimento"]!==undefined}
                  />
                  {this.state.error!==undefined&&this.state.error["dataNascimento"]!==undefined?
                    (<Form.Control.Feedback type="invalid">
                        {this.state.error["dataNascimento"]}
                      </Form.Control.Feedback>)
                    :""}
                </InputGroup>

                {/* NATURALIDADE */}
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="inputGroup-naturalidade">Naturalidade</InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    aria-label="Naturalidade"
                    aria-describedby="inputGroup-naturalidade"
                    name="inputGroup-naturalidade"
                    minLength="3"
                    maxLength="30"
                    value={this.converterValorInput(this.state.pessoa.naturalidade)}
                    onChange={e => this.atualizarCampoPessoa("naturalidade", e.target.value)}
                  />
                </InputGroup>

                {/* NACIONALIDADE */}
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="inputGroup-nacionalidade">Nacionalidade</InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    aria-label="Nacionalidade"
                    aria-describedby="inputGroup-nacionalidade"
                    name="inputGroup-nacionalidade"
                    minLength="3"
                    maxLength="30"
                    value={this.converterValorInput(this.state.pessoa.nacionalidade)}
                    onChange={e => this.atualizarCampoPessoa("nacionalidade", e.target.value)}
                  />
                </InputGroup>

                {/* CPF */}
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="inputGroup-nome">CPF <span className="text-danger pl-1">*</span></InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    aria-label="CPF"
                    aria-describedby="inputGroup-cpf"
                    name="inputGroup-cpf"
                    minLength="14"
                    maxLength="14"
                    required
                    value={this.state.pessoa.cpf}
                    onChange={e => this.atualizarCPF(e.target.value)}
                    isInvalid={this.state.error!==undefined&&this.state.error["cpf"]!==undefined}
                  />
                  {this.state.error!==undefined&&this.state.error["cpf"]!==undefined?
                    (<Form.Control.Feedback type="invalid">
                        {this.state.error["cpf"]}
                      </Form.Control.Feedback>)
                    :""}
                </InputGroup>
                <h6 className="float-right"><span className="text-danger">*</span> campos obrigatórios</h6>
                <br />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" type="submit">
                {this.state.pessoa.id?"Salvar":"Adicionar"}
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>
        ):("")}
      </pessoa-page-cad>
    )
  }

}
