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
    <div>
      <Card className="mb-4">
        <Card.Header>
          <h3>🐾 Listado de Mascotas</h3>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSearch} className="mb-4">
            <Row className="align-items-end">
              <Col md={5}>
                <Form.Group>
                  <Form.Label>Buscar por nombre:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese el nombre de la mascota..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Filtrar por especie:</Form.Label>
                  <Form.Select
                    value={filterEspecie}
                    onChange={(e) => setFilterEspecie(e.target.value)}
                  >
                    <option value="">Todas las especies</option>
                    <option value="Perro">Perro</option>
                    <option value="Gato">Gato</option>
                    <option value="Ave">Ave</option>
                    <option value="Conejo">Conejo</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Button type="submit" variant="primary">
                  🔍 Buscar
                </Button>
              </Col>
              <Col md={2}>
                <Link to="/mascotas/new">
                  <Button variant="success" className="w-100">
                    ➕ Nueva Mascota
                  </Button>
                </Link>
              </Col>
            </Row>
          </Form>

          {filteredMascotas.length === 0 ? (
            <Alert variant="info">
              {searchTerm || filterEspecie 
                ? 'No se encontraron mascotas que coincidan con los criterios de búsqueda.'
                : 'No hay mascotas registradas.'}
            </Alert>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Especie</th>
                    <th>Raza</th>
                    <th>Sexo</th>
                    <th>Dueño</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMascotas.map((mascota) => (
                    <tr key={mascota.id}>
                      <td>{mascota.id}</td>
                      <td>{mascota.nombre}</td>
                      <td>{mascota.especie}</td>
                      <td>{mascota.raza || '-'}</td>
                      <td>{mascota.sexo}</td>
                      <td>{mascota.dueno?.nombreCompleto || 'Sin dueño'}</td>
                      <td>
                        <div className="btn-group" role="group">
                          <Link to={`/mascotas/${mascota.id}`}>
                            <Button variant="info" size="sm">
                              👁️ Ver
                            </Button>
                          </Link>
                          <Link to={`/mascotas/${mascota.id}/edit`}>
                            <Button variant="warning" size="sm">
                              ✏️ Editar
                            </Button>
                          </Link>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(mascota.id, mascota.nombre)}
                          >
                            🗑️ Eliminar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}

          <div className="mt-3">
            <small className="text-muted">
              Total de mascotas: {filteredMascotas.length}
            </small>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default MascotaList;