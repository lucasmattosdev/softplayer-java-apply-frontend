import React, {Component} from 'react';
import AuthUtil from '../../util/auth-util';
import './header.scss';

export default class Header extends Component {

  constructor(props) {
    super(props)
    this.sair = () => {
      AuthUtil.logout();
    }
  }
  
  render() {
    return (
      <header>
        <div className="navbar navbar-dark box-shadow bg-dark">
          <div className="container d-flex justify-content-between">
            <img src="/img/logo-light.png" alt="Logo" height="60" className="logo" />
            <button className="btn btn-outline-primary" onClick={()=>this.sair()}>Sair</button>
          </div>
        </div>
      </header>
    )
  }

}
