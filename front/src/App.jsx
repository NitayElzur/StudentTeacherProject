import './App.css';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import Editor from './pages/Editor/Editor';

function App() {

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Home />} />
        <Route path='editor/:exercise' element={<Editor />} />
      </Route>
    </Routes>
  )
}

export default App
