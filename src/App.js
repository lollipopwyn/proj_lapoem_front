import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Main from './components/Main/Main';
import Booklist from './components/BookList/Booklist';
import Stella from './components/Stella/Stella';
import Community from './components/Community/Community';
import Community_detail from './components/Community/Community_detail';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/booklist" element={<Booklist />} />
          <Route path="/chatstella" element={<Stella />} />
          <Route path="/community" element={<Community />} />
          <Route
            path="/community/:communityid"
            element={<Community_detail />}
          />
        </Routes>

        {/* Catch all unmatched routes and redirect to Home */}
        <Route path="*" element={<Navigate to="/" />} />
      </div>
    </BrowserRouter>
  );
}

export default App;
