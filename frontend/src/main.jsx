import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { store } from './redux/store'
import { Provider } from 'react-redux'
import Navbar from './components/Navbar'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <Navbar />
      <App />
    </Provider>
  </React.StrictMode>
)
