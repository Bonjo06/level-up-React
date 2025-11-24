# 🏪 Level-up Gamer - Integración con Transbank WebPay Plus

## 📋 Descripción

Este proyecto incluye una integración completa con **Transbank WebPay Plus** para procesar pagos en línea de forma segura.

---

## 🏗️ Arquitectura

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   React     │  HTTP   │   Backend   │   API   │  Transbank  │
│  Frontend   │ ──────> │  (Node.js)  │ ──────> │   WebPay    │
│  (Puerto    │         │  (Puerto    │         │   Plus      │
│   3000)     │ <────── │   5000)     │ <────── │             │
└─────────────┘         └─────────────┘         └─────────────┘
```

### ¿Por qué necesitamos un backend?

1. **Seguridad**: Las credenciales de Transbank NO pueden estar en el frontend
2. **Firma digital**: Transbank requiere firmar las transacciones del lado del servidor
3. **Validación**: Debemos verificar las respuestas de Transbank de forma segura

---

## 🚀 Instalación y Configuración

### Paso 1: Instalar dependencias del Frontend

```bash
# Desde la raíz del proyecto
npm install
```

### Paso 2: Instalar dependencias del Backend

```bash
# Navegar a la carpeta backend
cd backend

# Instalar dependencias
npm install
```

### Paso 3: Configurar variables de entorno

El archivo `.env` en la carpeta `backend` ya está configurado con las credenciales de **integración (pruebas)** públicas de Transbank:

```env
PORT=5000
TRANSBANK_ENV=integration
FRONTEND_URL=http://localhost:3000
TRANSBANK_COMMERCE_CODE=597055555532
TRANSBANK_API_KEY=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C
```

**Estas credenciales son públicas y gratuitas**, no necesitas registrarte para usarlas en desarrollo.

---

## ▶️ Ejecutar el Proyecto

### Opción A: Dos terminales separadas (Recomendado)

**Terminal 1 - Frontend (React):**
```bash
npm start
```
El frontend se abrirá en: `http://localhost:3000`

**Terminal 2 - Backend (Node.js):**
```bash
cd backend
npm start
```
El backend se iniciará en: `http://localhost:5000`

### Opción B: Script único (próximamente)

Puedes crear un script en el `package.json` principal para ejecutar ambos simultáneamente:

```json
"scripts": {
  "dev": "concurrently \"npm start\" \"cd backend && npm start\""
}
```

---

## 🧪 Probar Pagos con Tarjetas de Prueba

Transbank proporciona tarjetas de prueba que NO realizan cargos reales:

### ✅ Transacción Aprobada

- **Número de tarjeta**: `4051 8856 0000 0002`
- **CVV**: `123`
- **Fecha de vencimiento**: Cualquier fecha futura (ej: 12/25)
- **RUT**: `11.111.111-1`
- **Clave**: `123`

### ❌ Transacción Rechazada

- **Número de tarjeta**: `4051 8842 3993 7763`
- **CVV**: `123`
- **Fecha de vencimiento**: Cualquier fecha futura
- **RUT**: `11.111.111-1`
- **Clave**: `123`

Más tarjetas de prueba: [Documentación oficial de Transbank](https://www.transbankdevelopers.cl/documentacion/como_empezar#tarjetas-de-prueba)

---

## 📊 Flujo de Pago

1. **Usuario agrega productos al carrito**
   - Los productos se guardan en localStorage por usuario

2. **Usuario hace clic en "Proceder al pago"**
   - El frontend verifica que haya sesión iniciada
   - Calcula el total del carrito

3. **Frontend llama al backend** (`POST /api/payment/create`)
   - Envía: monto, orden de compra, email del usuario

4. **Backend crea transacción en Transbank**
   - Transbank devuelve un token y URL de pago

5. **Usuario es redirigido a Transbank**
   - Ingresa los datos de su tarjeta
   - Transbank procesa el pago

6. **Transbank redirige de vuelta** (`GET /api/payment/confirm`)
   - El backend valida la transacción
   - Confirma si fue aprobada o rechazada

7. **Usuario ve el resultado**
   - ✅ `/payment/success` - Pago exitoso
   - ❌ `/payment/failed` - Pago rechazado
   - ⚠️ `/payment/error` - Error técnico

---

## 🔍 API Endpoints del Backend

### `POST /api/payment/create`
Crea una nueva transacción en Transbank

**Request Body:**
```json
{
  "amount": 35990,
  "buyOrder": "ORD-1234567890",
  "sessionId": "usuario@gmail.com",
  "returnUrl": "http://localhost:3000/payment/result"
}
```

**Response:**
```json
{
  "success": true,
  "token": "e9d555262db0f989e49d724b4db0b0af367cc415cde41f500a776550fc5fddd3",
  "url": "https://webpay3gint.transbank.cl/webpayserver/initTransaction"
}
```

### `GET /api/payment/confirm?token_ws=XXX`
Confirma y valida una transacción después del pago

### `GET /api/payment/status/:token`
Consulta el estado de una transacción

### `GET /api/health`
Verifica que el servidor esté funcionando

---

## 🎯 Verificar que Todo Funciona

1. **Backend funcionando**:
   - Abre: `http://localhost:5000/api/health`
   - Deberías ver: `{"status":"ok", ...}`

2. **Frontend conectado**:
   - Agrega productos al carrito
   - Verifica que aparezca el botón "Proceder al pago"

3. **Proceso completo**:
   - Haz clic en "Proceder al pago"
   - Serás redirigido a Transbank
   - Usa una tarjeta de prueba
   - Verifica que regreses a la página de éxito/fallo

---

## 🔐 Producción

Para usar en producción necesitas:

1. **Cuenta en Transbank**:
   - Registrarte como comercio en [Transbank](https://www.transbank.cl)
   - Obtener tus credenciales de producción

2. **Actualizar `.env`**:
```env
TRANSBANK_ENV=production
TRANSBANK_COMMERCE_CODE=tu_codigo_comercio
TRANSBANK_API_KEY=tu_api_key_secreta
```

3. **HTTPS obligatorio**:
   - Transbank requiere HTTPS en producción
   - Usa un certificado SSL válido

4. **Base de datos**:
   - Implementar MongoDB/PostgreSQL para guardar pedidos
   - Actualmente se usa memoria temporal (Map)

---

## 📁 Estructura de Archivos

```
level-up/
├── backend/
│   ├── server.js          # Servidor Express con Transbank
│   ├── package.json       # Dependencias del backend
│   ├── .env              # Variables de entorno
│   └── .gitignore        # Archivos ignorados
├── src/
│   ├── pages/
│   │   ├── Cart.js           # Carrito con integración de pago
│   │   ├── PaymentSuccess.js # Página de pago exitoso
│   │   ├── PaymentFailed.js  # Página de pago fallido
│   │   └── PaymentError.js   # Página de error técnico
│   ├── context/
│   │   └── CartContext.js    # Contexto del carrito por usuario
│   └── App.js               # Rutas de la aplicación
└── README_TRANSBANK.md      # Esta documentación
```

---

## 🐛 Solución de Problemas

### Error: "Cannot connect to backend"
- Verifica que el backend esté corriendo en `http://localhost:5000`
- Revisa que CORS esté habilitado en el backend

### Error: "TransbankException"
- Verifica las credenciales en `.env`
- Asegúrate de estar en modo `integration` para pruebas

### El pago se queda "Procesando..."
- Abre la consola del navegador (F12)
- Busca errores en la pestaña "Console"
- Revisa los logs del backend en la terminal

### No redirige de vuelta después del pago
- Verifica la URL de retorno en `.env` (`FRONTEND_URL`)
- Debe ser exactamente `http://localhost:3000`

---

## 📚 Recursos Adicionales

- [Documentación oficial de Transbank](https://www.transbankdevelopers.cl/)
- [SDK de Transbank para Node.js](https://github.com/TransbankDevelopers/transbank-sdk-nodejs)
- [Tarjetas de prueba](https://www.transbankdevelopers.cl/documentacion/como_empezar#tarjetas-de-prueba)
- [Códigos de respuesta](https://www.transbankdevelopers.cl/documentacion/webpay-plus#codigos-de-respuesta)

---

## ✅ Checklist de Implementación

- [x] Backend creado con Express
- [x] SDK de Transbank instalado
- [x] Rutas de pago configuradas
- [x] Frontend integrado con botón de pago
- [x] Páginas de resultado creadas
- [x] Carrito por usuario implementado
- [x] Credenciales de integración configuradas
- [ ] Probar con tarjetas de prueba
- [ ] Documentación completa

---

## 🤝 Soporte

Si tienes problemas con la integración:
1. Revisa los logs del backend en la terminal
2. Abre la consola del navegador (F12)
3. Consulta la documentación oficial de Transbank
4. Verifica que ambos servidores estén corriendo

---

**Desarrollado para Level-up Gamer** 🎮
