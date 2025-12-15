import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../config/axiosConfig';
import Toast from '../components/Toast';
import './Administration.css';


function AdministrationUsers() {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  // Estados para el formulario
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
    role: ''
  }); 
  
  // Estados para el Toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    if (isAdmin) {
      fetchUsers(); 
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/users');
      console.log('📊 Respuesta de usuarios:', response.data);
      let usersData = [];
      if (response.data._embedded && response.data._embedded.userList) {
        usersData = response.data._embedded.userList;
      } else if (Array.isArray(response.data)) {
        usersData = response.data;
      } else if (response.data.content) {
        usersData = response.data.content;
      }
      console.log('👥 Usuarios procesados:', usersData);
      setUsers(usersData);
    } catch (error) {
      console.error('❌ Error al cargar usuarios:', error);
      setToastMessage('Error al cargar usuarios');
      setToastType('error');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setToastMessage('Sesión cerrada exitosamente');
    setToastType('success');
    setShowToast(true);
    setTimeout(() => {
      navigate('/iniciarsesion');
    }, 1000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const openModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role || ''
      });
    } else {
      setEditingUser(null);
      setFormData({
        id: '',
        name: '',
        email: '',
        password: '',
        role: ''
      });
    }
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({
      id: '',
      name: '',
      email: '',
      password: '',
      role: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      setToastMessage('Por favor completa los campos requeridos');
      setToastType('warning');
      setShowToast(true);
      return;
    }

    try {
      // Mapear formData a la estructura del backend
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };
      if (editingUser) {
        // Actualizar usuario existente
        const userId = editingUser.id;
        await axiosInstance.put(`/users/${userId}`, userData);
        setToastMessage('Usuario actualizado exitosamente');
      } else {
        // Crear nuevo usuario
        await axiosInstance.post('/api/auth/register', userData);
        setToastMessage('Usuario creado exitosamente');
      }
      setToastType('success');
      setShowToast(true);
      closeModal();
      fetchUsers();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      let errorMessage = 'Error al guardar el usuario';
      if (error.response?.status === 403) {
        errorMessage = '❌ Acceso denegado. El usuario no tiene permisos de administrador.';
      } else if (error.response?.status === 401) {
        errorMessage = '❌ No autorizado. Por favor inicia sesión nuevamente.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      setToastMessage(errorMessage);
      setToastType('error');
      setShowToast(true);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        await axiosInstance.delete(`/users/${userId}`);
        setToastMessage('Usuario eliminado exitosamente');
        setToastType('success');
        setShowToast(true);
        fetchUsers();
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        setToastMessage('Error al eliminar el usuario');
        setToastType('error');
        setShowToast(true);
      }
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="administration-page">
      <Toast 
        show={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />

      <div className="container-fluid py-4">
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="mb-0">Panel de Administración LevelUp</h1>
              </div>
              <button 
                className="btn btn-danger"
                onClick={handleLogout}
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="mb-0">Gestión de Usuarios</h3>
                  <button 
                    className="btn btn-primary"
                    onClick={() => openModal()}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Agregar Producto
                  </button>
                </div>

                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Nombre</th>
                          <th>Correo Electrónico</th>
                          <th>Rol</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.length === 0 ? (
                          <tr>
                            <td colSpan="4" className="text-center py-4">
                              No hay usuarios registrados
                            </td>
                          </tr>
                        ) : (
                          users.map((user, index) => (
                            <tr key={user.id || index}>
                              <td>{user.id}</td>
                              <td>{user.name}</td>
                              <td>{user.email}</td>
                              <td>{user.role}</td>
                              <td>
                                <button 
                                  className="btn btn-sm btn-outline-primary me-2"
                                  onClick={() => openModal(user)}
                                >
                                  <i className="bi bi-pencil"></i> Editar
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDelete(user.id)}
                                >
                                  <i className="bi bi-trash"></i> Eliminar
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      {/* Modal para agregar/editar producto */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={closeModal}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="name" className="form-label">Nombre *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="email" className="form-label">Correo Electrónico *</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Contraseña *</label>
                    <textarea
                      className="form-control"
                      id="password"
                      name="password"
                      rows="3"
                      value={formData.password}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={closeModal}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingUser ? 'Actualizar' : 'Crear'} Usuario
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}

export default AdministrationUsers;
