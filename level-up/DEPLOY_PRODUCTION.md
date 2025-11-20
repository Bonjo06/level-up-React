# 🚀 Guía de Deployment a Producción (AWS EC2)

Esta guía te ayudará a configurar correctamente las variables de entorno para desplegar la aplicación en AWS EC2.

---

## 📋 Pre-requisitos

- Instancia EC2 activa (Ubuntu/Amazon Linux)
- Node.js instalado
- Java 17+ instalado
- PostgreSQL o MySQL configurado
- Puertos abiertos: 3000 (Frontend), 8080 (Backend), 5000 (Transbank)

---

## 🔧 Configuración del Frontend (React)

### 1. Crear archivo `.env` en la raíz del proyecto React

**Ubicación:** `/level-up/.env`

```env
# URL del backend Spring Boot
REACT_APP_API_URL=http://TU-IP-EC2:8080

# URL del servidor de pagos Transbank
REACT_APP_PAYMENT_URL=http://TU-IP-EC2:5000
```

**Ejemplo con IP real:**
```env
REACT_APP_API_URL=http://54.123.45.67:8080
REACT_APP_PAYMENT_URL=http://54.123.45.67:5000
```

### 2. Actualizar `axiosConfig.js`

Editar: `/level-up/src/config/axiosConfig.js`

```javascript
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  timeout: 10000,
});
```

### 3. Actualizar URLs en `Cart.js` (pagos)

Buscar las URLs hardcodeadas y reemplazar:

```javascript
// Línea ~105 - Crear orden
const orderResponse = await fetch(`${process.env.REACT_APP_API_URL}/purchase-orders/create-from-cart`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(orderData)
});

// Línea ~138 - Crear transacción Transbank
const response = await fetch(`${process.env.REACT_APP_PAYMENT_URL}/api/payment/create`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(paymentData)
});
```

---

## 🔧 Configuración del Backend (Spring Boot)

### 1. Actualizar `application.properties`

**Ubicación:** `/level-up/backend/src/main/resources/application.properties`

```properties
# Puerto del servidor
server.port=8080

# CORS - Permitir requests desde el frontend
cors.allowed.origins=${CORS_ORIGINS:http://localhost:3000}

# JWT Secret (CAMBIAR EN PRODUCCIÓN)
jwt.secret=${JWT_SECRET:TuClaveSecretaSuperSeguraDeAlMenos256BitsParaHS256}

# Base de datos PostgreSQL (ajustar según tu BD)
spring.datasource.url=${DB_URL:jdbc:postgresql://localhost:5432/levelup}
spring.datasource.username=${DB_USER:postgres}
spring.datasource.password=${DB_PASSWORD:password}

spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect

# Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

### 2. Actualizar `SecurityConfig.java`

Editar: `/backend/src/main/java/com/levelup/config/SecurityConfig.java`

Buscar la configuración de CORS y actualizar:

```java
@Value("${cors.allowed.origins:http://localhost:3000}")
private String allowedOrigins;

@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

---

## 🖥️ Pasos para Deploy en EC2

### 1. Conectar a tu instancia EC2

```bash
ssh -i tu-llave.pem ubuntu@tu-ip-ec2
```

### 2. Clonar el repositorio

```bash
git clone https://github.com/Bonjo06/level-up-React.git
cd level-up-React/level-up
```

### 3. Configurar variables de entorno en EC2

#### Opción A: Exportar directamente en terminal

```bash
export CORS_ORIGINS=http://54.123.45.67:3000
export JWT_SECRET=mi-clave-super-segura-produccion-2024
export DB_URL=jdbc:postgresql://localhost:5432/levelup
export DB_USER=tu_usuario
export DB_PASSWORD=tu_contraseña_segura
```

#### Opción B: Crear script de inicio `start-backend.sh`

```bash
#!/bin/bash
export CORS_ORIGINS=http://TU-IP-EC2:3000
export JWT_SECRET=clave-super-segura-produccion
export DB_URL=jdbc:postgresql://localhost:5432/levelup
export DB_USER=postgres
export DB_PASSWORD=password

cd backend
./mvnw spring-boot:run
```

Dar permisos de ejecución:
```bash
chmod +x start-backend.sh
```

### 4. Crear archivo `.env` para React en EC2

```bash
cd level-up
nano .env
```

Contenido:
```env
REACT_APP_API_URL=http://TU-IP-EC2:8080
REACT_APP_PAYMENT_URL=http://TU-IP-EC2:5000
```

### 5. Instalar dependencias y compilar

**Frontend:**
```bash
cd level-up
npm install
npm run build
```

**Backend:**
```bash
cd backend
./mvnw clean package
```

### 6. Ejecutar en producción

**Backend (puerto 8080):**
```bash
cd backend
java -jar target/*.jar
```

**Frontend (puerto 3000):**
```bash
cd level-up
npm start
```

O con `serve` para producción:
```bash
npm install -g serve
serve -s build -l 3000
```

**Servidor Transbank (puerto 5000):**
```bash
cd backend
node server.js
```

---

## 🔒 Configurar Security Groups en AWS

En tu instancia EC2, permite los siguientes puertos:

| Puerto | Protocolo | Descripción |
|--------|-----------|-------------|
| 22     | TCP       | SSH         |
| 80     | TCP       | HTTP        |
| 443    | TCP       | HTTPS       |
| 3000   | TCP       | React       |
| 5000   | TCP       | Transbank   |
| 8080   | TCP       | Spring Boot |

---

## 📝 Checklist de Variables a Cambiar

### Frontend (.env)
- [ ] `REACT_APP_API_URL` → IP de tu EC2
- [ ] `REACT_APP_PAYMENT_URL` → IP de tu EC2

### Backend (Variables de entorno)
- [ ] `CORS_ORIGINS` → IP de tu EC2 con puerto 3000
- [ ] `JWT_SECRET` → Nueva clave segura (distinta a desarrollo)
- [ ] `DB_URL` → URL de tu base de datos
- [ ] `DB_USER` → Usuario de BD en producción
- [ ] `DB_PASSWORD` → Contraseña de BD en producción

---

## 🎯 Ejemplo Real de Configuración

Supongamos que tu IP de EC2 es: **54.123.45.67**

### Frontend `.env`:
```env
REACT_APP_API_URL=http://54.123.45.67:8080
REACT_APP_PAYMENT_URL=http://54.123.45.67:5000
```

### Backend (export en EC2):
```bash
export CORS_ORIGINS=http://54.123.45.67:3000
export JWT_SECRET=Pr0duc3i0n$3cr3tK3y!2024#L3v3lUp
export DB_URL=jdbc:postgresql://localhost:5432/levelup_prod
export DB_USER=levelup_user
export DB_PASSWORD=Sup3rS3cur3P@ssw0rd!
```

---

## ⚠️ Notas Importantes

1. **Nunca commitees** archivos `.env` con credenciales reales al repositorio
2. **Cambia el JWT_SECRET** en producción - usa algo más seguro
3. **Configura HTTPS** para producción (usa Let's Encrypt con Nginx)
4. **Usa PM2** para mantener los procesos corriendo:
   ```bash
   npm install -g pm2
   pm2 start npm --name "react-app" -- start
   pm2 start backend/target/*.jar --name "spring-boot"
   pm2 start backend/server.js --name "transbank"
   pm2 save
   pm2 startup
   ```

---

## 🐛 Troubleshooting

### Error de CORS
- Verifica que `CORS_ORIGINS` incluya tu IP con el puerto correcto
- Revisa que el frontend esté usando la IP correcta en `.env`

### JWT Token inválido
- Asegúrate de que el `JWT_SECRET` sea el mismo que generó los tokens
- Limpia localStorage en el navegador y vuelve a hacer login

### Base de datos no conecta
- Verifica que PostgreSQL esté corriendo: `sudo systemctl status postgresql`
- Revisa las credenciales en las variables de entorno
- Confirma que la BD `levelup` exista

### Puerto ya en uso
```bash
# Ver qué proceso usa el puerto
sudo lsof -i :8080

# Matar el proceso
kill -9 PID
```

---

## 📚 Recursos Adicionales

- [Documentación AWS EC2](https://docs.aws.amazon.com/ec2/)
- [Spring Boot Deployment](https://spring.io/guides/gs/spring-boot/)
- [React Deployment](https://create-react-app.dev/docs/deployment/)
- [PM2 Process Manager](https://pm2.keymetrics.io/)

---

¡Buena suerte con el deployment! 🚀
