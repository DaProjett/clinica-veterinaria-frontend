import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MascotaList from './components/MascotaList';
import MascotaForm from './components/MascotaForm';
import MascotaDetail from './components/MascotaDetail';
import Navbar from './components/Navbar';
import { Container } from 'react-bootstrap';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Container className="mt-4">
          <Routes>
            <Route path="/" element={<MascotaList />} />
            <Route path="/mascotas" element={<MascotaList />} />
            <Route path="/mascotas/new" element={<MascotaForm />} />
            <Route path="/mascotas/:id" element={<MascotaDetail />} />
            <Route path="/mascotas/:id/edit" element={<MascotaForm />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;