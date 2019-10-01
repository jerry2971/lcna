import React from "react";
import ReactDOM from "react-dom";
import { IntlProvider } from 'react-intl';
import Home from './home.jsx';
import { httpRequest } from './lib';

const content = document.getElementById("content");

const langPath = {
  'en': '/language/en_US.json',
  'en-US': '/language/en_US.json',
  'zh-TW': '/language/zh_TW.json'
}

class App extends React.Component{

  componentDidMount = () => {
    httpRequest('GET', langPath[navigator.language], {}, (statusCode, resJson) => {
      this.setState(resJson);
    });
  }
  render() {
    return (
      <div>
        <IntlProvider locale='en' messages={this.state}>
          <Home />
        </IntlProvider>
      </div>
    );
  }
}

if(content)ReactDOM.render(<App />, content);
