// Este servidor maneja las transacciones con Transbank WebPay Plus

require('dotenv').config(); // Carga las variables de entorno del archivo .env
const express = require('express');
const cors = require('cors'); // Permite que React (puerto 3000) se comunique con el backend (puerto 5000)
const { WebpayPlus } = require('transbank-sdk'); // SDK oficial de Transbank

const app = express();
const PORT = process.env.PORT || 5000;


// CONFIGURACIÓN DE TRANSBANK
let transaction;

if (process.env.TRANSBANK_ENV === 'integration') {
  // Ambiente de pruebas
  const { Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } = require('transbank-sdk');
  
  transaction = new WebpayPlus.Transaction(
    new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration)
  );
  
  console.log('✅ Transbank configurado en modo INTEGRACIÓN (pruebas)');
} else {
  // Ambiente de producción - necesitarías tus propias credenciales
  const { Options, Environment } = require('transbank-sdk');
  
  transaction = new WebpayPlus.Transaction(
    new Options(process.env.TRANSBANK_COMMERCE_CODE, process.env.TRANSBANK_API_KEY, Environment.Production)
  );
  
  console.log('✅ Transbank configurado en modo PRODUCCIÓN');
}

// Permiten procesar datos JSON y habilitar CORS
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cors({
  origin: process.env.FRONTEND_URL, 
  credentials: true
}));



const transacciones = new Map();


// CREAR TRANSACCIÓN
// Esta ruta recibe el carrito desde React y crea una transacción en Transbank
app.post('/api/payment/create', async (req, res) => {
  try {
    const { amount, buyOrder, sessionId, returnUrl } = req.body;

    console.log('📝 Nueva solicitud de pago:', {
      amount,
      buyOrder,
      sessionId
    });

    // Validaciones 
    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        error: 'El monto debe ser mayor a 0' 
      });
    }

    if (!buyOrder || !sessionId) {
      return res.status(400).json({ 
        error: 'Faltan datos requeridos (buyOrder o sessionId)' 
      });
    }

    // Crear la transacción en Transbank
    // buyOrder: ID único de tu orden de compra
    // sessionId: ID de la sesión del usuario 
    // amount: Monto total en PESOS CHILENOS 
    // returnUrl: URL a la que Transbank redirigirá después del pago 
    //returnUrl || `http://34.201.202.181:${PORT}/api/payment/confirm`
    const response = await transaction.create(
      buyOrder,
      sessionId,
      amount,
      returnUrl || `http://localhost:${PORT}/api/payment/confirm`
    );

    // Guardar la información de la transacción 
    transacciones.set(response.token, {
      buyOrder,
      sessionId,
      amount,
      timestamp: new Date().toISOString()
    });

    console.log('✅ Transacción creada exitosamente');
    console.log('Token:', response.token);
    console.log('URL:', response.url);

    
    // El frontend redirigirá al usuario a esta URL para pagar
    res.json({
      success: true,
      token: response.token,
      url: response.url
    });

  } catch (error) {
    console.error('❌ Error al crear transacción:', error);
    res.status(500).json({
      error: 'Error al crear la transacción',
      details: error.message
    });
  }
});

// CONFIRMAR TRANSACCIÓN
// Transbank redirige aquí después de que el usuario paga (o cancela)
// valida el pago con Transbank
app.get('/api/payment/confirm', async (req, res) => {
  try {
    const token_ws = req.query.token_ws; 

    if (!token_ws) {
      return res.redirect(`${process.env.FRONTEND_URL}/payment/error`);
    }

    console.log('🔍 Confirmando transacción con token:', token_ws);

    // Consultar el estado de la transacción en Transbank
    const response = await transaction.commit(token_ws);

    console.log('📊 Respuesta de Transbank:', {
      vci: response.vci,
      status: response.status,
      amount: response.amount,
      authorizationCode: response.authorization_code
    });

    // Obtener la información de la transacción guardada
    const transaccionInfo = transacciones.get(token_ws);

    // Verificar si el pago fue exitoso
    // VCI: Validation Code Indicator
    // Status: AUTHORIZED = pago exitoso
    const isApproved = response.vci === 'TSY' && response.status === 'AUTHORIZED';

    if (isApproved) {
      console.log('✅ Pago APROBADO');
      
      // Aquí deberías:
      // 1. Guardar el pedido en una base de datos
      // 2. Enviar email de confirmación
      // 3. Actualizar inventario
      // 4. Limpiar el carrito del usuario
      
      // Por ahora redirigimos al frontend con la información
      res.redirect(
        `${process.env.FRONTEND_URL}/payment/success?` +
        `buyOrder=${response.buy_order}&` +
        `amount=${response.amount}&` +
        `authCode=${response.authorization_code}`
      );
    } else {
      console.log('❌ Pago RECHAZADO');
      res.redirect(
        `${process.env.FRONTEND_URL}/payment/failed?` +
        `reason=${response.response_code}`
      );
    }

    // Limpiar la transacción de memoria
    transacciones.delete(token_ws);

  } catch (error) {
    console.error('❌ Error al confirmar transacción:', error);
    res.redirect(`${process.env.FRONTEND_URL}/payment/error`);
  }
});


// CONSULTAR ESTADO DE TRANSACCIÓN
// Permite consultar el estado de una transacción desde el frontend
app.get('/api/payment/status/:token', async (req, res) => {
  try {
    const { token } = req.params;

    console.log('🔍 Consultando estado de transacción:', token);

    const response = await transaction.status(token);

    res.json({
      success: true,
      data: {
        status: response.status,
        amount: response.amount,
        authorizationCode: response.authorization_code,
        paymentTypeCode: response.payment_type_code,
        responseCode: response.response_code
      }
    });

  } catch (error) {
    console.error('❌ Error al consultar estado:', error);
    res.status(500).json({
      error: 'Error al consultar el estado de la transacción',
      details: error.message
    });
  }
});



// verificar que el servidor está funcionando
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend de Level-up Gamer funcionando correctamente',
    environment: process.env.TRANSBANK_ENV,
    timestamp: new Date().toISOString()
  });
});


// ver transacciones activas (debug)
app.get('/api/transactions', (req, res) => {
  const activeTransactions = Array.from(transacciones.entries()).map(([token, data]) => ({
    token: token.substring(0, 20) + '...', // Ocultamos parte del token por seguridad
    ...data
  }));

  res.json({
    total: activeTransactions.length,
    transactions: activeTransactions
  });
});

// INICIAR SERVIDOR
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 ============================================');
  console.log('🚀  Servidor Backend iniciado correctamente');
  console.log('🚀 ============================================');
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.TRANSBANK_ENV}`);
  console.log(`🔗 Frontend: ${process.env.FRONTEND_URL}`);
  console.log('🚀 ============================================');
  console.log('');
  console.log('📝 Rutas disponibles:');
  console.log(`   POST   /api/payment/create    - Crear transacción`);
  console.log(`   GET    /api/payment/confirm   - Confirmar pago`);
  console.log(`   GET    /api/payment/status    - Consultar estado`);
  console.log(`   GET    /api/health            - Health check`);
  console.log('');
});
