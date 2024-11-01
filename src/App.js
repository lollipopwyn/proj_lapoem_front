import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Main from './components/Main/Main';
import Booklist from './components/BookList/Booklist';
import Stella from './components/Stella/Stella';
import Community from './components/Community/Community';
import Community_detail from './components/Community/Community_detail';
import NewForum from './components/Community/NewForum';

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
          <Route path="/new-forum" element={<NewForum />} />
          <Route path="/community_detail" element={<Community_detail />} />

          <Route
            path="/community/:communityid"
            element={<Community_detail />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        {/* Catch all unmatched routes and redirect to Home */}
      </div>
    </BrowserRouter>
  );
}

export default App;
