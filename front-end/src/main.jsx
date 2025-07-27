import { createRoot } from 'react-dom/client'
import App from './app.jsx'
import './main.css'
import { Provider } from 'react-redux'
import store from './Store/Store.js'


createRoot(document.getElementById('root')).render(
  <Provider store ={store}>
    <App />
  </Provider>,
)
