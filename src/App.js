import Home from './components/Home'
import Layout from './components/Layout'
import Soundbar from './components/Soundbar'
import './App.scss'

function App() {
  return (
    <>
      <Soundbar />
      <Layout>
        <Home />
      </Layout>
    </>
  )
}

export default App
