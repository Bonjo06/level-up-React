# 🎓 GUÍA COMPLETA: Transbank en Level-up Gamer

## 📖 ¿Qué es Transbank y cómo funciona?

**Transbank** es el principal procesador de pagos con tarjetas en Chile. **WebPay Plus** es su solución para e-commerce que permite:
- Pagos con tarjetas de crédito y débito
- Transacciones seguras con certificados
- Cumplimiento de normativas PCI
- Ambiente de pruebas gratuito

---

## 🏗️ Arquitectura Implementada

### Componentes creados:

```
📦 BACKEND (Puerto 5000)
├── server.js           → Servidor Express con 4 endpoints
├── package.json        → Dependencias (express, transbank-sdk, cors, dotenv)
├── .env               → Credenciales de integración (públicas)
└── .gitignore         → Protege archivos sensibles

📦 FRONTEND (Puerto 3000)
├── src/pages/
│   ├── Cart.js            → ✨ MODIFICADO: Botón "Proceder al pago"
│   ├── PaymentSuccess.js  → 🆕 Página de pago exitoso
│   ├── PaymentFailed.js   → 🆕 Página de pago rechazado
│   └── PaymentError.js    → 🆕 Página de error técnico
└── src/App.js           → ✨ MODIFICADO: 3 rutas nuevas
```

---

## 🔄 Flujo Completo de Pago (Paso a Paso)

### 1️⃣ Usuario en el Carrito
```javascript
// Cart.js - Usuario hace clic en "Proceder al pago"
const handleProceedToPayment = async () => {
  // Verifica sesión
  const userEmail = localStorage.getItem('UsuarioLogeado');
  
  // Genera orden única
  const buyOrder = `ORD-${Date.now()}-${Math.random()}`;
  
  // Calcula total del carrito
  const amount = Math.round(total); // $35.990 → 35990
}
```

### 2️⃣ Frontend → Backend
```javascript
// Frontend envía datos al backend
fetch('http://localhost:5000/api/payment/create', {
  method: 'POST',
  body: JSON.stringify({
    amount: 35990,           // Monto en pesos (sin decimales)
    buyOrder: "ORD-1234",    // ID único de la orden
    sessionId: "user@mail",  // Email del usuario
    returnUrl: "http://..."  // URL de retorno
  })
})
```

### 3️⃣ Backend → Transbank
```javascript
// server.js - Backend crea transacción
const response = await WebpayPlus.Transaction.create(
  buyOrder,    // Tu ID de orden
  sessionId,   // Email del usuario
  amount,      // Monto a cobrar
  returnUrl    // URL donde volver después del pago
);

// Transbank responde:
{
  token: "e9d555262db0f989...",  // Token único
  url: "https://webpay3gint.transbank.cl/..." // URL de pago
}
```

### 4️⃣ Usuario en Transbank
```
Frontend crea un formulario invisible y redirige:

<form method="POST" action="https://webpay3gint.transbank.cl/...">
  <input name="token_ws" value="e9d555262db0f989...">
</form>

El usuario ve:
┌─────────────────────────────┐
│   🏦 Transbank WebPay       │
├─────────────────────────────┤
│ Número de tarjeta: ____     │
│ CVV: ___                    │
│ Fecha venc: __/__           │
│                             │
│ [ Pagar $35.990 CLP ]       │
└─────────────────────────────┘
```

### 5️⃣ Transbank → Backend
```javascript
// Después de que el usuario paga, Transbank redirige:
GET http://localhost:5000/api/payment/confirm?token_ws=e9d555262...

// server.js - Backend valida la transacción
const response = await WebpayPlus.Transaction.commit(token_ws);

// Transbank responde el resultado:
{
  vci: "TSY",                    // Código de validación
  status: "AUTHORIZED",          // Estado: AUTHORIZED = Aprobado
  amount: 35990,                 // Monto cobrado
  authorization_code: "1213",    // Código de autorización del banco
  payment_type_code: "VD",       // Tipo: VD=Débito, VC=Crédito
  response_code: 0               // 0 = Exitoso
}
```

### 6️⃣ Backend → Frontend
```javascript
// server.js - Backend redirige según el resultado
if (response.vci === 'TSY' && response.status === 'AUTHORIZED') {
  // ✅ PAGO EXITOSO
  res.redirect('http://localhost:3000/payment/success?' +
    'buyOrder=ORD-1234&amount=35990&authCode=1213');
} else {
  // ❌ PAGO RECHAZADO
  res.redirect('http://localhost:3000/payment/failed?reason=-1');
}
```

### 7️⃣ Usuario ve el resultado
```javascript
// PaymentSuccess.js
useEffect(() => {
  // Guardar pedido en localStorage
  const pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');
  pedidos.push({
    ordenCompra: buyOrder,
    monto: amount,
    fecha: new Date().toLocaleString('es-CL'),
    estado: 'Aprobado'
  });
  localStorage.setItem('pedidos', JSON.stringify(pedidos));
  
  // Limpiar el carrito
  localStorage.setItem(`carrito_${userEmail}`, '[]');
}, []);
```

---

## 🧪 Tarjetas de Prueba

### ✅ Transacción Aprobada
```
Número: 4051 8842 3993 7763
CVV: 123
Vencimiento: 12/25
RUT: 11.111.111-1
Clave WebPay: 123
```

### ❌ Transacción Rechazada
```
Número: 4051 8842 3993 7763
CVV: 123
Vencimiento: 12/25
RUT: 11.111.111-1
Clave WebPay: 123
```

**Importante**: Estas tarjetas NO realizan cargos reales. Son solo para pruebas.

---

## 🔍 Endpoints del Backend Explicados

### 1. POST /api/payment/create
**Qué hace**: Crea una transacción nueva en Transbank

**Cuándo se usa**: Cuando el usuario hace clic en "Proceder al pago"

**Ejemplo de uso**:
```javascript
const response = await fetch('http://localhost:5000/api/payment/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 35990,
    buyOrder: 'ORD-1234567890',
    sessionId: 'usuario@gmail.com',
    returnUrl: 'http://localhost:3000/payment/result'
  })
});

// Respuesta:
{
  success: true,
  token: "e9d555262db0f989...",
  url: "https://webpay3gint.transbank.cl/..."
}
```

### 2. GET /api/payment/confirm
**Qué hace**: Valida la transacción después del pago

**Cuándo se usa**: Transbank llama automáticamente a esta URL después del pago

**Flujo**:
```
Usuario paga → Transbank procesa → 
Transbank llama: GET /api/payment/confirm?token_ws=XXX →
Backend valida con Transbank →
Backend redirige a /payment/success o /payment/failed
```

### 3. GET /api/payment/status/:token
**Qué hace**: Consulta el estado de una transacción

**Cuándo se usa**: Si quieres verificar el estado de un pago antiguo

**Ejemplo**:
```javascript
fetch('http://localhost:5000/api/payment/status/e9d555262db0f989...')
  .then(res => res.json())
  .then(data => console.log(data.status)); // "AUTHORIZED"
```

### 4. GET /api/health
**Qué hace**: Verifica que el servidor esté funcionando

**Cuándo se usa**: Para diagnóstico y monitoreo

**Ejemplo**:
```bash
curl http://localhost:5000/api/health

# Respuesta:
{
  "status": "ok",
  "message": "Backend de Level-up Gamer funcionando correctamente",
  "environment": "integration",
  "timestamp": "2025-11-06T20:30:00.000Z"
}
```

---

## 🎯 Cómo Probar Todo

### Paso 1: Iniciar ambos servidores

**Terminal 1 (Backend)**:
```bash
cd backend
node server.js
```
Deberías ver: `✅ Transbank configurado en modo INTEGRACIÓN`

**Terminal 2 (Frontend)**:
```bash
npm start
```
Se abrirá: `http://localhost:3000`

### Paso 2: Registrar un usuario
1. Ve a http://localhost:3000/registro
2. Crea una cuenta (ej: test@gmail.com / 1234)

### Paso 3: Agregar productos al carrito
1. Navega por el catálogo
2. Haz clic en "Agregar al carrito" en varios productos
3. Ve al carrito: http://localhost:3000/carrito

### Paso 4: Proceder al pago
1. Verifica el total del carrito
2. Haz clic en "💳 Proceder al pago"
3. Serás redirigido a Transbank (ambiente de pruebas)

### Paso 5: Pagar en Transbank
1. Ingresa la tarjeta de prueba: `4051 8856 0000 0002`
2. CVV: `123`
3. Vencimiento: Cualquier fecha futura (ej: `12/25`)
4. RUT: `11.111.111-1`
5. Clave: `123`
6. Haz clic en "Continuar"

### Paso 6: Ver el resultado
- Serás redirigido a `/payment/success`
- Verás: Orden de compra, monto, código de autorización
- Tu carrito se limpiará automáticamente

### Paso 7: Verificar en localStorage
Abre la consola (F12) y ejecuta:
```javascript
// Ver pedidos guardados
JSON.parse(localStorage.getItem('pedidos'))

// Ver carrito (debería estar vacío)
JSON.parse(localStorage.getItem('carrito_test@gmail.com'))
```

---

## 🐛 Debugging

### Ver logs del backend
El backend muestra logs detallados:
```
📝 Nueva solicitud de pago: { amount: 35990, buyOrder: 'ORD-...' }
✅ Transacción creada exitosamente
Token: e9d555262db0f989...
URL: https://webpay3gint.transbank.cl/...

🔍 Confirmando transacción con token: e9d555262db0f989...
📊 Respuesta de Transbank: { vci: 'TSY', status: 'AUTHORIZED', ... }
✅ Pago APROBADO
```

### Ver logs del frontend
Abre la consola del navegador (F12):
```
📦 Iniciando pago: {amount: 35990, buyOrder: "ORD-...", ...}
✅ Transacción creada: {success: true, token: "...", url: "..."}
```

---

## 🚀 Próximos Pasos

### Para Desarrollo:
- [x] Backend funcionando ✅
- [x] Frontend integrado ✅
- [ ] Probar con tarjetas de prueba
- [ ] Ver el flujo completo end-to-end

### Para Producción:
- [ ] Registrarse en Transbank como comercio
- [ ] Obtener credenciales de producción
- [ ] Cambiar `TRANSBANK_ENV=production` en `.env`
- [ ] Implementar base de datos (MongoDB/PostgreSQL)
- [ ] Agregar envío de emails de confirmación
- [ ] Desplegar en servidor con HTTPS (obligatorio)
- [ ] Implementar webhooks para notificaciones

---

## 📚 Conceptos Clave

### ¿Qué es un token_ws?
- Token único que identifica una transacción
- Generado por Transbank al crear el pago
- Tiene una duración limitada (generalmente 5 minutos)
- Se usa para confirmar y consultar la transacción

### ¿Qué es buyOrder?
- ID único de tu orden de compra
- Lo generas tú (ej: `ORD-1731877200-456`)
- Debe ser único por transacción
- Lo usas para relacionar el pago con tu pedido

### ¿Qué es sessionId?
- Identificador de la sesión del usuario
- Puede ser el email, user ID, etc.
- Transbank lo guarda para trazabilidad

### ¿Qué significa VCI: TSY?
- Validation Code Indicator
- `TSY` = Transacción autenticada exitosamente
- Otros valores: `TSN`, `TO`, `ABO`, `U3`
- Solo `TSY` + `AUTHORIZED` = Pago exitoso

### ¿Cuándo se cobra la tarjeta?
- El cargo se hace **inmediatamente** cuando el usuario paga en Transbank
- NO cuando creas la transacción con `/api/payment/create`
- El dinero llega a tu cuenta comercial en 24-48 horas

---

## 🎓 Resumen Ejecutivo

1. **Creas backend** → `server.js` maneja la comunicación con Transbank
2. **Usuario paga** → Frontend redirige a Transbank con un token
3. **Transbank procesa** → Usuario ingresa datos de tarjeta
4. **Transbank confirma** → Llama a tu backend con el resultado
5. **Backend valida** → Verifica que el pago sea legítimo
6. **Usuario ve resultado** → Redirige a página de éxito/fallo

**Todo esto ya está implementado y listo para probar** ✅

---

¿Tienes dudas sobre algún concepto? ¡Pregúntame! 🚀
