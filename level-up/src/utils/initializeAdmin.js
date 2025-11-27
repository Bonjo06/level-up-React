import axiosInstance from '../config/axiosConfig';

export const initializeAdmin = async () => {
  // ⭐ Verificar si ya se inicializó en esta sesión del navegador
  const adminInitialized = sessionStorage.getItem('adminInitialized');
  if (adminInitialized === 'true') {
    console.log('✅ Verificación de admin ya realizada en esta sesión');
    return { success: true, message: 'Ya verificado', cached: true };
  }

  const ADMIN_EMAIL = 'admin@levelup.com';
  const ADMIN_PASSWORD = 'Admin123!';
  const ADMIN_NAME = 'Administrador';

  try {
    // Verificar si el admin existe intentando hacer login
    const loginResponse = await axiosInstance.post('/api/auth/login', {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });

    if (loginResponse.data.success) {
      console.log('✅ Usuario administrador ya existe');
      // ⭐ Marcar como inicializado para esta sesión
      sessionStorage.setItem('adminInitialized', 'true');
      return { success: true, message: 'Admin ya existe' };
    }
  } catch (loginError) {
    // Si el login falla, significa que el usuario no existe, intentar crearlo
    console.log('📝 Usuario administrador no existe, creando...');
    
    try {
      const registerResponse = await axiosInstance.post('/api/auth/register', {
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        confirmPassword: ADMIN_PASSWORD
      });

      if (registerResponse.data.success) {
        console.log('✅ Usuario administrador creado con rol ADMIN (asignado automáticamente por el backend)');
        // ⭐ Marcar como inicializado para esta sesión
        sessionStorage.setItem('adminInitialized', 'true');
        return { success: true, message: 'Admin creado exitosamente' };
      }
    } catch (registerError) {
      console.error('❌ Error al crear usuario administrador:', registerError);
      
      // Si el error es porque el usuario ya existe, está bien
      if (registerError.response?.status === 409 || 
          registerError.response?.data?.message?.includes('ya existe') ||
          registerError.response?.data?.message?.includes('already exists')) {
        console.log('✅ Usuario administrador ya existe en el sistema');
        // ⭐ Marcar como inicializado para esta sesión
        sessionStorage.setItem('adminInitialized', 'true');
        return { success: true, message: 'Admin ya existe' };
      }
      
      return { 
        success: false, 
        message: 'Error al crear admin',
        error: registerError.response?.data?.message || registerError.message 
      };
    }
  }
};
