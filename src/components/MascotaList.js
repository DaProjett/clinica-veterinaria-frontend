import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Form, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { mascotaService } from '../services/api';

const MascotaList = () => {
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEspecie, setFilterEspecie] = useState('');
  
  // Especies para el filtro
  const especies = ['Perro', 'Gato', 'Ave', 'Roedor', 'Otro'];

  useEffect(() => {
    fetchMascotas();
  }, []);

  const fetchMascotas = async () => {
    try {
      setLoading(true);
      const data = await mascotaService.getAll();
      console.log('Data received:', data);
      setMascotas(data);
      setError('');
    } catch (err) {
      setError('Error al cargar las mascotas. Por favor intente nuevamente.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, nombre) => {
    if (window.confirm(`¿Está seguro de que desea eliminar a ${nombre}?`)) {
      try {
        await mascotaService.delete(id);
        setMascotas(mascotas.filter(m => m.id !== id));
      } catch (err) {
        setError('Error al eliminar la mascota. Por favor intente nuevamente.');
        console.error('Error:', err);
      }
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (searchTerm) {
        const data = await mascotaService.searchByName(searchTerm);
        setMascotas(data);
      } else {
        const data = await mascotaService.getAll();
        setMascotas(data);
      }
    } catch (err) {
      setError('Error en la búsqueda. Por favor intente nuevamente.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMascotas = Array.isArray(mascotas) ? mascotas.filter(mascota => {
    if (!mascota || !mascota.nombre) return false;
    const matchesSearch = searchTerm === '' ||
      mascota.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEspecie = filterEspecie === '' ||
      (mascota.especie === filterEspecie);
    return matchesSearch && matchesEspecie;
  }) : [];

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    );
  }

return (
    <div className="mascota-list-container fade-in">
      {/* Header */}
      <div className="mascota-header mb-5">
        <h2 className="mascota-title">
          <span className="title-icon">🐾</span>
          Lista de Mascotas
        </h2>
        <p className="mascota-subtitle">
          Gestiona el registro completo de mascotas en la clínica
        </p>
      </div>
      
      {/* Error Alert */}
      {error && (
        <Alert variant="danger" className="fade-in">
          <strong>⚠️ Error:</strong> {error}
          <Button 
            variant="outline-light" 
            size="sm" 
            className="ms-2"
            onClick={() => setError('')}
          >
            ×
          </Button>
        </Alert>
      )}
      
      {/* Search and Filter Section */}
      <Card className="search-card mb-4 fade-in">
        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <Form onSubmit={handleSearch}>
                <Form.Group>
                  <Form.Label className="form-label-custom">
                    <span className="label-icon">🔍</span>
                    Buscar por nombre:
                  </Form.Label>
                  <div className="input-group">
                    <Form.Control
                      type="text"
                      placeholder="Ingrese el nombre de la mascota"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="form-control-custom"
                    />
                    <Button type="submit" variant="primary" className="btn-custom">
                      {loading ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        <>
                          <span className="btn-icon">🔍</span>
                          Buscar
                        </>
                      )}
                    </Button>
                  </div>
                </Form.Group>
              </Form>
            </Col>
            
            <Col md={6}>
              <Form.Group>
                <Form.Label className="form-label-custom">
                  <span className="label-icon">🏷️</span>
                  Filtrar por especie:
                </Form.Label>
                <Form.Select 
                  value={filterEspecie} 
                  onChange={(e) => setFilterEspecie(e.target.value)}
                  className="form-select-custom"
                >
                  <option value="">Todas las especies</option>
                  {especies.map(especie => (
                    <option key={especie} value={especie}>{especie}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {/* Stats and New Mascota */}
      <div className="d-flex justify-content-between align-items-center mb-4 fade-in">
        <div className="stats-info">
          <h3 className="stats-title">
            <span className="stats-icon">📊</span>
            Total de mascotas: {filteredMascotas.length}
          </h3>
        </div>
        <Link to="/mascotas/new">
          <Button variant="success" className="btn-custom btn-lg">
            <span className="btn-icon">➕</span>
            Nueva Mascota
          </Button>
        </Link>
      </div>
      
      {/* Mascotas Table */}
      {loading ? (
        <div className="loading-container fade-in">
          <Spinner animation="border" variant="primary" className="loading-spinner" />
          <p className="loading-text">Cargando mascotas...</p>
        </div>
      ) : (
        <Card className="mascota-table-card fade-in">
          <Card.Header className="table-header-custom">
            <h4 className="table-title">
              <span className="table-icon">📋</span>
              Registro de Mascotas
            </h4>
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover responsive className="mascota-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Especie</th>
                  <th>Raza</th>
                  <th>Dueño</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredMascotas.length > 0 ? (
                  filteredMascotas.map((mascota) => (
                    <tr key={mascota.id} className="mascota-row">
                      <td><span className="badge bg-primary">{mascota.id}</span></td>
                      <td><strong>{mascota.nombre}</strong></td>
                      <td>
                        <span className="badge bg-secondary especie-badge">
                          {mascota.especie}
                        </span>
                      </td>
                      <td>{mascota.raza}</td>
                      <td>{mascota.dueno?.nombreCompleto || mascota.dueno?.nombre || 'N/A'}</td>
                      <td>
                        <div className="action-buttons">
                          <Link to={`/mascotas/${mascota.id}`}>
                            <Button variant="info" size="sm" className="btn-action">
                              <span className="btn-icon">👁️</span>
                            </Button>
                          </Link>
                          <Link to={`/mascotas/${mascota.id}/edit`}>
                            <Button variant="warning" size="sm" className="btn-action">
                              <span className="btn-icon">✏️</span>
                            </Button>
                          </Link>
                          <Button 
                            variant="danger" 
                            size="sm" 
                            className="btn-action"
                            onClick={() => handleDelete(mascota.id, mascota.nombre)}
                          >
                            <span className="btn-icon">🗑️</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center empty-state">
                      <div className="empty-icon">🐕</div>
                      <p>No se encontraron mascotas</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default MascotaList;