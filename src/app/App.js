import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Redirect} from 'react-router-dom';
import AxiosUtil from '../util/axios-util'
import AuthRoute from '../components/auth-route'
import PessoaPage from '../pages/pessoa-page/pessoa-page'
import LoginPage from '../pages/login-page/login-page'
import SourcePage from '../pages/source-page/source-page'
import LoadingUI from '../components/loading-ui/loading-ui';

class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      isLoading: false
    }

    window.loadingUi = (isLoading)=>{
      this.setState({isLoading: isLoading})
    }

    //Configura AXIOS para as comunicações com o servidor
    AxiosUtil.configure(this.updateLoading);
  }

  render() {
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <div className="App">
          {this.state.isLoading?(
            <LoadingUI></LoadingUI>
          ):("")}
          <Switch>
                <AuthRoute type="comAuth" exact path= "/"><Redirect from="*" to="/pessoa" /></AuthRoute>
                <AuthRoute type="comAuth" exact path= "/pessoa" component={PessoaPage}/>
                <AuthRoute type="semAuth" exact path='/login' component={LoginPage}/>
                <AuthRoute type="publico" exact path='/source' component={SourcePage}/>
                <Redirect from="*" to="/" />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
