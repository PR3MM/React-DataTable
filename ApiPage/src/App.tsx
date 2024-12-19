import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import BasicDemo from './components/DataTable'
import 'primereact/resources/themes/lara-light-indigo/theme.css'; 
import 'primereact/resources/primereact.min.css'; 
import 'primeicons/primeicons.css'; 


function App() {
  const [count, setCount] = useState(0)

  return (
    <>

      <BasicDemo/>

    </>
  )
}

export default App
