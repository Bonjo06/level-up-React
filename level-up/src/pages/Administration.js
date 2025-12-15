import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../config/axiosConfig';
import Toast from '../components/Toast';
import './Administration.css';

function Administration() {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Estados para el formulario
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    imageUrl: ''
  });
  
  // Estados para el Toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
      fetchUsers(); 
    }
  }, [isAdmin]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Verificar que tenemos el token
      const adminToken = localStorage.getItem('adminToken');
      console.log('🔑 Token de admin presente:', !!adminToken);
      
      const response = await axiosInstance.get('/api/inventario');
      
      // Extraer los productos de la estructura HAL de Spring Boot
      let productsList = [];
      
      if (response.data._embedded && response.data._embedded.inventarioList) {
        productsList = response.data._embedded.inventarioList;
      } else if (Array.isArray(response.data)) {
        productsList = response.data;
      } else if (response.data.content && Array.isArray(response.data.content)) {
        productsList = response.data.content;
      }
      
      console.log('📦 Productos cargados:', productsList);
      console.log('📦 Primer producto (para verificar estructura):', productsList[0]);
      setProducts(productsList);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      setToastMessage('Error al cargar los productos');
      setToastType('error');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/users');
      
      console.log('📊 Respuesta de usuarios:', response.data);
      
      // Extraer usuarios de la estructura de respuesta
      let usersData = [];
      if (Array.isArray(response.data)) {
        usersData = response.data;
      } else if (response.data._embedded && response.data._embedded.userList) {
        usersData = response.data._embedded.userList;
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

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        id: product.itemId,
        name: product.itemTitle || product.name,
        description: product.itemDescription || product.description,
        price: product.itemPrice || product.price,
        stock: product.itemQuantity || product.stock,
        category: product.itemCategory || product.category,
        imageUrl: product.itemImageLink || product.imageUrl || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({
        id: '',
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        imageUrl: ''
      });
    }
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      id: '',
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
      imageUrl: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.stock) {
      setToastMessage('Por favor completa los campos requeridos');
      setToastType('warning');
      setShowToast(true);
      return;
    }

    try {
      // Verificar token antes de enviar
      const adminToken = localStorage.getItem('adminToken');
      console.log('🔑 Token disponible:', !!adminToken);
      console.log('🔑 Token (primeros 20 caracteres):', adminToken?.substring(0, 20));
      
      // Mapear formData a la estructura del backend
      const productData = {
        itemTitle: formData.name,
        itemDescription: formData.description,
        itemPrice: parseFloat(formData.price),
        itemQuantity: parseInt(formData.stock),
        itemCategory: formData.category || '',
        itemImageLink: formData.imageUrl
      };
      
      if (editingProduct) {
        // Actualizar producto existente - incluir itemId en el cuerpo
        const productId = editingProduct.itemId || editingProduct.id;
        const updateData = {
          ...productData,
          itemId: productId
        };
        console.log('📝 Actualizando producto:', productId, updateData);
        await axiosInstance.put(`/api/inventario/${productId}`, updateData);
        setToastMessage('Producto actualizado exitosamente');
      } else {
        // Crear nuevo producto
        console.log('➕ Creando producto:', productData);
        await axiosInstance.post('/api/inventario', productData);
        setToastMessage('Producto creado exitosamente');
      }
      
      setToastType('success');
      setShowToast(true);
      closeModal();
      fetchProducts();
    } catch (error) {
      console.error('Error al guardar producto:', error);
      console.error('Detalles del error:', error.response);
      
      let errorMessage = 'Error al guardar el producto';
      
      if (error.response?.status === 403) {
        errorMessage = '❌ Acceso denegado. El usuario no tiene permisos de administrador. Verifica que el usuario tenga el rol ADMIN en la base de datos.';
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

  const handleDelete = async (productId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        await axiosInstance.delete(`/api/inventario/${productId}`);
        setToastMessage('Producto eliminado exitosamente');
        setToastType('success');
        setShowToast(true);
        fetchProducts();
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        setToastMessage('Error al eliminar el producto');
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
                  <h3 className="mb-0">Gestión de Inventario</h3>
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
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Nombre</th>
                          <th>Categoría</th>
                          <th>Precio</th>
                          <th>Stock</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="text-center py-4">
                              No hay productos disponibles
                            </td>
                          </tr>
                        ) : (
                          products.map((product, index) => (
                            <tr key={product.itemId || product.id || index}>
                              <td>{product.itemId || product.id }</td>
                              <td>{product.itemTitle}</td>
                              <td>{product.itemCategory || 'Sin categoría'}</td>
                              <td>${parseFloat(product.itemPrice).toFixed(2)}</td>
                              <td>
                                <span className={`badge ${product.itemQuantity > 10 ? 'bg-success' : product.itemQuantity > 0 ? 'bg-warning' : 'bg-danger'}`}>
                                  {product.itemQuantity}
                                </span>
                              </td>
                              <td>
                                <button 
                                  className="btn btn-sm btn-outline-primary me-2"
                                  onClick={() => openModal(product)}
                                >
                                  <i className="bi bi-pencil"></i> Editar
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDelete(product.itemId || product.id)}
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
      </div>

        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="mb-0">Gestión de Usuarios</h3>
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
                      <thead>
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
                              <td>{user.name }</td>
                              <td>{user.email }</td>
                              <td>{user.role }</td>
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
                  {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
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
                      <label htmlFor="category" className="form-label">Categoría</label>
                      <input
                        type="text"
                        className="form-control"
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Descripción</label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      rows="3"
                      value={formData.description}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="price" className="form-label">Precio *</label>
                      <input
                        type="number"
                        className="form-control"
                        id="price"
                        name="price"
                        step="0.01"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="stock" className="form-label">Stock *</label>
                      <input
                        type="number"
                        className="form-control"
                        id="stock"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="imageUrl" className="form-label">URL de la Imagen</label>
                    <input
                      type="text"
                      className="form-control"
                      id="imageUrl"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                    />
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
                    {editingProduct ? 'Actualizar' : 'Crear'} Producto
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Administration;
