import React, {Component} from 'react';
import './loading-ui.scss';

export default class LoadingUI extends Component {  
  render() {
    return (
      <loading-ui>
        <div className="spinner-border" role="status">
          <span className="sr-only">Carregando...</span>
        </div>
      </loading-ui>
    )
  }

}
