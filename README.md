# Level-up Gamer 🎮

E-commerce de productos gamer desarrollado con React y Spring Boot, con integración de pagos mediante Transbank WebPay Plus.

## 📋 Descripción

Level-up Gamer es una plataforma de comercio electrónico especializada en productos gaming, que incluye:
- Catálogo de productos con búsqueda y filtros
- Sistema de carrito de compras
- Integración de pagos con Transbank
- Panel de administración para gestión de inventario y usuarios
- Autenticación JWT para usuarios y administradores
- Sistema de contacto
- Mapa interactivo de ubicación

## 🛠️ Tecnologías

### Frontend
- **React 19** - Framework principal
- **React Router v7** - Navegación
- **Bootstrap 5** - Estilos y componentes
- **Axios** - Peticiones HTTP
- **Leaflet** - Mapas interactivos
- **Swiper** - Carruseles de productos
- **Material-UI** - Componentes adicionales

### Backend
- **Spring Boot** - API REST (Java)
- **Node.js/Express** - Servidor de pagos
- **MySQL** - Base de datos
- **JWT** - Autenticación
- **Transbank SDK** - Procesamiento de pagos
- [Repositorio Backend del proyecto](https://github.com/Bonjo06/backend-levelup.git)

## 📁 Estructura del Proyecto

```
level-up-React/
├── level-up/                    # Frontend React
│   ├── src/
│   │   ├── components/         # Componentes reutilizables
│   │   ├── pages/              # Páginas de la aplicación
│   │   ├── context/            # Context API (Auth, Cart)
│   │   ├── config/             # Configuración (axios, API)
│   │   └── assets/             # Imágenes y recursos
│   ├── public/                 # Archivos públicos
│   └── backend/                # Servidor Node.js (pagos)
└── README.md
```

## 🚀 Instalación y Configuración

### Requisitos Previos
- Node.js 16+
- Java 17+ (para backend Spring Boot)
- MySQL 8+
- npm o yarn

### 1. Clonar el Repositorio
```bash
git clone https://github.com/Bonjo06/level-up-React.git
cd level-up-React
```

### 2. Configurar Frontend

```bash
cd level-up
npm install
```

Crear archivo `src/config/apiConfig.js`:
```javascript
export const API_BASE_URL = 'http://localhost:8080';
export const PAYMENT_BASE_URL = 'http://localhost:5000';

const config = { API_BASE_URL, PAYMENT_BASE_URL };
export default config;
```

### 3. Configurar Backend de Pagos

```bash
cd level-up/backend
npm install
```

Crear archivo `.env`:
```env
PORT=5000
TRANSBANK_ENV=integration
FRONTEND_URL=http://localhost:3000
TRANSBANK_COMMERCE_CODE=597055555532
TRANSBANK_API_KEY=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C
```


*El usuario admin se crea automáticamente al iniciar la aplicación si no existe.*

## 🌐 Endpoints Principales

### Backend Spring Boot (Puerto 8080)
- `POST /api/auth/login` - Login de usuarios
- `POST /api/auth/register` - Registro de usuarios
- `GET /api/inventario` - Listar productos
- `POST /api/inventario` - Crear producto (admin)
- `PUT /api/inventario/{id}` - Actualizar producto (admin)
- `DELETE /api/inventario/{id}` - Eliminar producto (admin)
- `GET /users` - Listar usuarios (admin)

### Backend Node.js (Puerto 5000)
- `POST /api/payment/create` - Crear transacción Transbank
- `GET /api/payment/confirm` - Confirmar pago
- `GET /api/payment/status/:token` - Consultar estado de pago
- `GET /api/health` - Health check

## 📦 Deploy

El proyecto está desplegado en AWS EC2 con PM2 para gestión de procesos. Los servicios se inician automáticamente al arrancar la instancia.


## 📖 Manual de Usuario

### Para Clientes

1. **Registro e Inicio de Sesión**
   - Ingrese al apartado "Iniciar Sesión" para acceder a todas las funcionalidades
   - Si no tiene cuenta, puede registrarse con su correo electrónico

2. **Explorar y Comprar Productos**
   - Navegue por el catálogo de productos gaming
   - Agregue productos al carrito de compras
   - Revise su carrito y ajuste las cantidades según necesite

3. **Proceso de Pago**
   - Dentro del carrito, presione el botón **"Proceder al pago"**
   - Será redirigido a WebPay Plus (entorno de pruebas de Transbank)
   - Use una de las [tarjetas de prueba de Transbank](https://www.transbankdevelopers.cl/documentacion/como_empezar#tarjetas-de-prueba)
   - Complete el proceso de pago
   - Recibirá una confirmación del estado de su compra (exitosa, fallida o error)

### Para Administradores

1. **Acceso al Panel de Administración**
   - Inicie sesión con credenciales de administrador

2. **Gestión de Inventario**
   - Agregue nuevos productos al catálogo
   - Edite información de productos existentes (nombre, precio, stock, imagen)
   - Elimine productos del inventario
   - Soporte para imágenes Base64 o URLs

3. **Gestión de Usuarios**
   - Visualice la lista completa de usuarios registrados
   - Consulte información de roles y permisos
