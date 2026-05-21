import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Alert, Spinner, Modal } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { mascotaService } from '../services/api';

const MascotaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mascota, setMascota] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchMascota();
  }, [id]);

  const fetchMascota = async () => {
    try {
      setLoading(true);
      const data = await mascotaService.getById(id);
      if (data) {
        setMascota(data);
      } else {
        setError('No se encontró la mascota');
      }
    } catch (err) {
      setError('Error al cargar los datos de la mascota');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await mascotaService.delete(id);
      navigate('/mascotas');
    } catch (err) {
      setError('Error al eliminar la mascota');
      console.error('Error:', err);
      setShowDeleteModal(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  };

  const calculateAge = (dateString) => {
    if (!dateString) return 'Desconocida';
    const birthDate = new Date(dateString);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        {error}
        <div className="mt-2">
          <Button variant="primary" onClick={() => navigate('/mascotas')}>
            Volver al listado
          </Button>
        </div>
      </Alert>
    );
  }

  if (!mascota) {
    return (
      <Alert variant="warning">
        Mascota no encontrada
        <div className="mt-2">
          <Button variant="primary" onClick={() => navigate('/mascotas')}>
            Volver al listado
          </Button>
        </div>
      </Alert>
    );
  }

  return (
    <div>
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h3>🐾 Detalles de la Mascota</h3>
          <div>
            <Button 
              variant="warning" 
              className="me-2"
              onClick={() => navigate(`/mascotas/${id}/edit`)}
            >
              ✏️ Editar
            </Button>
            <Button 
              variant="danger"
              onClick={() => setShowDeleteModal(true)}
            >
              🗑️ Eliminar
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Row className="mb-4">
            <Col md={8}>
              <h4 className="text-primary mb-3">{mascota.nombre}</h4>
              <div className="d-flex flex-wrap gap-2 mb-3">
                <span className="badge bg-info">{mascota.especie}</span>
                <span className="badge bg-secondary">{mascota.sexo}</span>
                <span className="badge bg-success">Edad: {calculateAge(mascota.fechaNacimiento)} años</span>
              </div>
            </Col>
            <Col md={4} className="text-end">
              <div className="text-muted">
                <small>ID: #{mascota.id}</small>
                <br />
                <small>Registrado: {formatDate(mascota.fechaRegistro)}</small>
              </div>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <h5 className="mb-3">📋 Información General</h5>
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <td><strong>Nombre:</strong></td>
                    <td>{mascota.nombre}</td>
                  </tr>
                  <tr>
                    <td><strong>Especie:</strong></td>
                    <td>{mascota.especie}</td>
                  </tr>
                  <tr>
                    <td><strong>Raza:</strong></td>
                    <td>{mascota.raza || 'No especificada'}</td>
                  </tr>
                  <tr>
                    <td><strong>Sexo:</strong></td>
                    <td>{mascota.sexo}</td>
                  </tr>
                  <tr>
                    <td><strong>Color:</strong></td>
                    <td>{mascota.color || 'No especificado'}</td>
                  </tr>
                  <tr>
                    <td><strong>Peso:</strong></td>
                    <td>{mascota.peso ? `${mascota.peso} kg` : 'No especificado'}</td>
                  </tr>
                  <tr>
                    <td><strong>Fecha de Nacimiento:</strong></td>
                    <td>{formatDate(mascota.fechaNacimiento)}</td>
                  </tr>
                </tbody>
              </table>
            </Col>

            <Col md={6}>
              <h5 className="mb-3">👤 Información del Dueño</h5>
              {mascota.dueno ? (
                <div className="card">
                  <div className="card-body">
                    <h6 className="card-title text-primary">{mascota.dueno.nombreCompleto}</h6>
                    <table className="table table-sm table-borderless">
                      <tbody>
                        <tr>
                          <td><strong>Documento:</strong></td>
                          <td>{mascota.dueno.documentoIdentidad}</td>
                        </tr>
                        <tr>
                          <td><strong>Teléfono:</strong></td>
                          <td>{mascota.dueno.telefono || 'No especificado'}</td>
                        </tr>
                        <tr>
                          <td><strong>Email:</strong></td>
                          <td>{mascota.dueno.email || 'No especificado'}</td>
                        </tr>
                        <tr>
                          <td><strong>Dirección:</strong></td>
                          <td>{mascota.dueno.direccion || 'No especificada'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <Alert variant="warning">
                  Esta mascota no tiene un dueño asignado
                </Alert>
              )}
            </Col>
          </Row>

          <hr className="my-4" />

          <div className="d-flex justify-content-between">
            <Button variant="secondary" onClick={() => navigate('/mascotas')}>
              ← Volver al listado
            </Button>
            <div>
              <Button 
                variant="warning" 
                className="me-2"
                onClick={() => navigate(`/mascotas/${id}/edit`)}
              >
                ✏️ Editar
              </Button>
              <Button 
                variant="danger"
                onClick={() => setShowDeleteModal(true)}
              >
                🗑️ Eliminar
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Modal de confirmación de eliminación */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro de que desea eliminar a <strong>{mascota.nombre}</strong>?
          <br />
          Esta acción no se puede deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MascotaDetail;