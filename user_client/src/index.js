import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


const user_api_link = 'http://127.0.0.1:8080';

fetch(user_api_link + '/attempts', { method : 'POST' })
. then( (response) => response.json() )
. then( attempt => {
  ReactDOM.render(
    <React.StrictMode>
      <App data={attempt} />
    </React.StrictMode>,
    document.getElementById('root')
  );
})
. catch((error) => console.log(error))



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
