import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { mascotaService, duenoService } from '../services/api';

const MascotaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [duenos, setDuenos] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    nombre: '',
    especie: '',
    raza: '',
    fechaNacimiento: '',
    sexo: '',
    color: '',
    peso: '',
    duenoId: ''
  });

  const isEditing = Boolean(id);

  useEffect(() => {
    fetchDuenos();
    if (isEditing) {
      fetchMascota();
    }
  }, [id, isEditing]);

  const fetchDuenos = async () => {
    try {
      console.log('Cargando dueños...');
      const data = await duenoService.getAll();
      console.log('Dueños recibidos:', data);
      // Asegurar que data sea un array
      const duenosArray = Array.isArray(data) ? data : [];
      setDuenos(duenosArray);
    } catch (err) {
      console.error('Error al cargar dueños:', err);
      setError('Error al cargar la lista de dueños');
      setDuenos([]);
    }
  };

  const fetchMascota = async () => {
    try {
      setLoading(true);
      const mascota = await mascotaService.getById(id);
      if (mascota) {
        setFormData({
          nombre: mascota.nombre || '',
          especie: mascota.especie || '',
          raza: mascota.raza || '',
          fechaNacimiento: mascota.fechaNacimiento || '',
          sexo: mascota.sexo || '',
          color: mascota.color || '',
          peso: mascota.peso || '',
          duenoId: mascota.dueno?.id || ''
        });
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      setLoading(true);

      // Validaciones básicas
      if (!formData.nombre.trim()) {
        setError('El nombre de la mascota es obligatorio');
        return;
      }

      if (!formData.especie.trim()) {
        setError('La especie es obligatoria');
        return;
      }

      if (!formData.sexo) {
        setError('El sexo es obligatorio');
        return;
      }

      if (!formData.duenoId) {
        setError('Debe seleccionar un dueño');
        return;
      }

      // Preparar datos para enviar
      const mascotaData = {
        nombre: formData.nombre,
        especie: formData.especie,
        raza: formData.raza || null,
        fechaNacimiento: formData.fechaNacimiento || null,
        sexo: formData.sexo,
        color: formData.color || null,
        peso: formData.peso ? parseFloat(formData.peso) : null,
        duenoId: parseInt(formData.duenoId)
      };

      if (isEditing) {
        await mascotaService.update(id, mascotaData);
        setSuccess('Mascota actualizada exitosamente');
      } else {
        await mascotaService.create(mascotaData);
        setSuccess('Mascota creada exitosamente');
      }

      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/mascotas');
      }, 2000);

    } catch (err) {
      setError(err.message || `Error al ${isEditing ? 'actualizar' : 'crear'} la mascota. Por favor intente nuevamente.`);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Card>
      <Card.Header>
        <h3>{isEditing ? '✏️ Editar Mascota' : '➕ Registrar Nueva Mascota'}</h3>
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Nombre de la Mascota *</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ingrese el nombre"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Especie *</Form.Label>
                <Form.Select
                  name="especie"
                  value={formData.especie}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione una especie</option>
                  <option value="Perro">Perro</option>
                  <option value="Gato">Gato</option>
                  <option value="Ave">Ave</option>
                  <option value="Conejo">Conejo</option>
                  <option value="Hamster">Hamster</option>
                  <option value="Otro">Otro</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Raza</Form.Label>
                <Form.Control
                  type="text"
                  name="raza"
                  value={formData.raza}
                  onChange={handleChange}
                  placeholder="Ingrese la raza"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Fecha de Nacimiento</Form.Label>
                <Form.Control
                  type="date"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Sexo *</Form.Label>
                <Form.Select
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione el sexo</option>
                  <option value="MACHO">Macho</option>
                  <option value="HEMBRA">Hembra</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Color</Form.Label>
                <Form.Control
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="Ingrese el color"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Peso (kg)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.1"
                  name="peso"
                  value={formData.peso}
                  onChange={handleChange}
                  placeholder="Ej: 25.5"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Dueño *</Form.Label>
                <Form.Select
                  name="duenoId"
                  value={formData.duenoId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione un dueño</option>
                  {duenos.map(dueno => (
                    <option key={dueno.id} value={dueno.id}>
                      {dueno.nombreCompleto || `Dueño #${dueno.id}`} - {dueno.telefono || 'Sin teléfono'}
                    </option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">
                  Seleccione el dueño de la mascota
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-between">
            <Button
              variant="secondary"
              onClick={() => navigate('/mascotas')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" />
                  {' '}Guardando...
                </>
              ) : (
                <>
                  {isEditing ? '💾 Actualizar Mascota' : '➕ Crear Mascota'}
                </>
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default MascotaForm;