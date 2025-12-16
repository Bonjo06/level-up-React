import axiosInstance from '../config/axiosConfig';

export const initializeAdmin = async () => {
  // Verificar si ya se inicializó en esta sesión del navegador
  const adminInitialized = sessionStorage.getItem('adminInitialized');
  if (adminInitialized === 'true') {
    return { success: true, message: 'Ya verificado', cached: true };
  }

  const ADMIN_EMAIL = 'admin@levelup.com';
  const ADMIN_PASSWORD = 'Admin123!';
  const ADMIN_NAME = 'Administrador';

  try {
    // Verificar si el admin existe consultando la lista de usuarios
    const usersResponse = await axiosInstance.get('/users');
    
    let users = [];
    if (usersResponse.data._embedded && usersResponse.data._embedded.userList) {
      users = usersResponse.data._embedded.userList;
    } else if (Array.isArray(usersResponse.data)) {
      users = usersResponse.data;
    }
    
    // Buscar si existe un admin con el email especificado
    const adminExists = users.some(user => 
      user.email === ADMIN_EMAIL || user.role === 'ADMIN'
    );
    
    if (adminExists) {
      sessionStorage.setItem('adminInitialized', 'true');
      return { success: true, message: 'Admin ya existe' };
    }
    
    // Si no existe, intentar crearlo
    
    try {
      const registerResponse = await axiosInstance.post('/api/auth/register', {
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        confirmPassword: ADMIN_PASSWORD
      });

      if (registerResponse.data.success) {
        sessionStorage.setItem('adminInitialized', 'true');
        return { success: true, message: 'Admin creado exitosamente' };
      }
    } catch (registerError) {
      console.error('Error al crear usuario administrador:', registerError);
      
      // Si el error es porque el usuario ya existe, está bien
      if (registerError.response?.status === 409 || 
          registerError.response?.status === 400 ||
          registerError.response?.data?.message?.includes('ya existe') ||
          registerError.response?.data?.message?.includes('already exists')) {
        sessionStorage.setItem('adminInitialized', 'true');
        return { success: true, message: 'Admin ya existe' };
      }
      
      return { success: false, 
        message: 'Error al crear admin',
        error: registerError.response?.data?.message || registerError.message 
      };
    }
  } catch (error) {
    console.error('Error general al verificar/crear admin:', error);
    return { 
      success: false, 
      message: 'Error en la verificación del administrador',
      error: error.message 
    };
  }
};
