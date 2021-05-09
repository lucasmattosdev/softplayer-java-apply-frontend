import React, {Component} from 'react';
import './source-page.scss';

export default class SourcePage extends Component {
  render() {
    return (
      <source-page>
        <section className="jumbotron text-center">
          <div className="container">
            <h1 className="jumbotron-heading">SOURCE</h1>
            <p className="lead text-muted">
              Aplicação dividida em Backend e Frontend<br/>
              Abaixo os respectivos links do projeto no Github
            </p>
            <p>
              <a href="https://github.com/lucasmattooos/softplayer-java-apply-backend" target="_blank" rel="noreferrer" className="btn btn-primary m-2">BACKEND</a>
              <a href="https://github.com/lucasmattooos/softplayer-java-apply-frontend" target="_blank" rel="noreferrer" className="btn btn-primary m-2">FRONTEND</a>
            </p>
          </div>
        </section>
      </source-page>
    );
  }

}
