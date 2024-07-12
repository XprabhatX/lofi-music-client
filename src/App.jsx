import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Playlists from './components/Playlists';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/playlists' element={<Playlists />} />
      </Routes>
    </Router>
  )
}

export default App;