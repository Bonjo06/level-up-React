# 🚀 Guía de Despliegue en AWS EC2 Ubuntu

Esta guía te ayudará a desplegar **Level-up Gamer** en una instancia EC2 de AWS paso a paso.

---

## 📋 **Requisitos Previos**

- ✅ Instancia EC2 Ubuntu (t2.micro o superior)
- ✅ Security Group con puertos abiertos: 22, 80, 3000, 5000
- ✅ Par de claves SSH (.pem)
- ✅ Repositorio en GitHub

---

## 🔧 **PASO 1: Conectarse a EC2**

### Desde Windows (PowerShell):
```powershell
ssh -i "tu-clave.pem" ubuntu@tu-ip-publica-ec2
```

### Desde Linux/Mac:
```bash
chmod 400 tu-clave.pem
ssh -i tu-clave.pem ubuntu@tu-ip-publica-ec2
```

---

## 📦 **PASO 2: Instalar Node.js y npm**

```bash
# Actualizar paquetes del sistema
sudo apt update
sudo apt upgrade -y

# Instalar Node.js 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalación
node --version    # Debe mostrar v20.x.x
npm --version     # Debe mostrar 10.x.x
```

---

## 📥 **PASO 3: Clonar el Repositorio**

```bash
# Navegar al directorio home
cd ~

# Clonar tu repositorio
git clone https://github.com/Bonjo06/level-up-React.git

# Entrar al proyecto
cd level-up-React/level-up
```

---

## ⚙️ **PASO 4: Configurar el Backend**

### 4.1 Instalar dependencias del backend
```bash
cd ~/level-up-React/level-up/backend
npm install
```

### 4.2 Obtener la IP pública de tu EC2
```bash
curl http://checkip.amazonaws.com
```
**Anota esta IP** (ejemplo: 54.123.45.67)

### 4.3 Crear archivo .env
```bash
nano .env
```

### 4.4 Pegar esta configuración (MODIFICA LA IP):
```env
# Configuración del servidor
PORT=5000

# Ambiente de Transbank (integration o production)
TRANSBANK_ENV=integration

# URL del frontend - REEMPLAZA CON TU IP PÚBLICA
FRONTEND_URL=http://TU_IP_PUBLICA:3000

# Credenciales de integración de Transbank (públicas para pruebas)
TRANSBANK_COMMERCE_CODE=597055555532
TRANSBANK_API_KEY=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C
```

**Ejemplo con IP real:**
```env
FRONTEND_URL=http://54.123.45.67:3000
```

### 4.5 Guardar el archivo
- Presiona `Ctrl + X`
- Presiona `Y`
- Presiona `Enter`

---

## ⚙️ **PASO 5: Configurar el Frontend**

### 5.1 Volver al directorio principal e instalar dependencias
```bash
cd ~/level-up-React/level-up
npm install
```

**Nota:** Este proceso puede tardar 5-10 minutos

---

## 🔄 **PASO 6: Instalar PM2 (Process Manager)**

PM2 mantendrá tus aplicaciones corriendo 24/7

```bash
sudo npm install -g pm2
```

---

## 🚀 **PASO 7: Iniciar las Aplicaciones con PM2**

### 7.1 Iniciar el Backend
```bash
cd ~/level-up-React/level-up/backend
pm2 start server.js --name "level-up-backend"
```

Deberías ver:
```
[PM2] Process successfully started
┌─────┬────────────────────┬─────────┬──────┐
│ id  │ name               │ status  │ cpu  │
├─────┼────────────────────┼─────────┼──────┤
│ 0   │ level-up-backend   │ online  │ 0%   │
└─────┴────────────────────┴─────────┴──────┘
```

### 7.2 Iniciar el Frontend
```bash
cd ~/level-up-React/level-up
pm2 start npm --name "level-up-frontend" -- start
```

### 7.3 Verificar que ambas apps estén corriendo
```bash
pm2 list
```

Deberías ver:
```
┌─────┬────────────────────┬─────────┬──────┬─────┐
│ id  │ name               │ status  │ cpu  │ mem │
├─────┼────────────────────┼─────────┼──────┼─────┤
│ 0   │ level-up-backend   │ online  │ 0%   │ 45MB│
│ 1   │ level-up-frontend  │ online  │ 0%   │ 120MB│
└─────┴────────────────────┴─────────┴──────┴─────┘
```

---

## 🔍 **PASO 8: Verificar que Todo Funcione**

### 8.1 Ver logs del backend
```bash
pm2 logs level-up-backend
```

Deberías ver:
```
✅ Transbank configurado en modo INTEGRACIÓN (pruebas)
🚀 Servidor Backend iniciado correctamente
📍 URL: http://localhost:5000
```

### 8.2 Ver logs del frontend
```bash
pm2 logs level-up-frontend
```

Deberías ver:
```
Compiled successfully!
You can now view level-up in the browser.
Local: http://localhost:3000
```

### 8.3 Probar desde el navegador
Abre tu navegador y ve a:
```
http://TU_IP_PUBLICA:3000
```
Ejemplo: `http://54.123.45.67:3000`

---

## 💾 **PASO 9: Guardar Configuración de PM2**

```bash
# Guardar la configuración actual
pm2 save

# Configurar PM2 para inicio automático
pm2 startup

# PM2 te dará un comando para ejecutar, ejemplo:
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu
# Copia y ejecuta ese comando
```

Ahora, si reinicias tu EC2, las aplicaciones se iniciarán automáticamente ✨

---

## 📊 **Comandos Útiles de PM2**

```bash
# Ver todas las aplicaciones
pm2 list

# Ver logs en tiempo real
pm2 logs

# Ver logs solo del backend
pm2 logs level-up-backend

# Ver logs solo del frontend
pm2 logs level-up-frontend

# Ver uso de CPU y RAM
pm2 monit

# Reiniciar el backend
pm2 restart level-up-backend

# Reiniciar el frontend
pm2 restart level-up-frontend

# Detener el backend
pm2 stop level-up-backend

# Detener el frontend
pm2 stop level-up-frontend

# Eliminar una aplicación
pm2 delete level-up-backend

# Reiniciar todo
pm2 restart all

# Detener todo
pm2 stop all
```

---

## 🔒 **PASO 10: Configurar Security Group en AWS**

### Ve a tu consola de AWS → EC2 → Security Groups:

**Reglas de entrada (Inbound Rules):**

| Tipo          | Protocolo | Puerto | Origen       | Descripción           |
|---------------|-----------|--------|-------------|-----------------------|
| SSH           | TCP       | 22     | Tu IP       | Acceso SSH            |
| Custom TCP    | TCP       | 3000   | 0.0.0.0/0   | Frontend React        |
| Custom TCP    | TCP       | 5000   | 0.0.0.0/0   | Backend Node.js       |
| HTTP          | TCP       | 80     | 0.0.0.0/0   | HTTP (opcional)       |
| HTTPS         | TCP       | 443    | 0.0.0.0/0   | HTTPS (opcional)      |

---

## 🧪 **PASO 11: Probar la Integración de Transbank**

1. Abre tu navegador: `http://TU_IP_PUBLICA:3000`
2. Regístrate o inicia sesión
3. Agrega productos al carrito
4. Haz clic en "Proceder al pago"
5. Usa estas tarjetas de prueba:

**Transacción APROBADA:**
```
Número: 4051 8856 0044 6623
CVV: 123
Fecha: 12/25
RUT: 11.111.111-1
Clave: 123
```

**Transacción RECHAZADA:**
```
Número: 5186 0595 5959 0568
CVV: 123
Fecha: 12/25
RUT: 11.111.111-1
Clave: 123
```

---

## 🔄 **PASO 12: Actualizar el Código (Git Pull)**

Si haces cambios en tu código y quieres actualizarlos en EC2:

```bash
# Detener las apps
pm2 stop all

# Actualizar código
cd ~/level-up-React/level-up
git pull origin bonjo

# Reinstalar dependencias (si es necesario)
npm install
cd backend && npm install

# Reiniciar apps
pm2 restart all
```

---

## 🐛 **Solución de Problemas**

### Problema 1: "Cannot connect to backend"
```bash
# Verifica que el backend esté corriendo
pm2 list

# Ver logs del backend
pm2 logs level-up-backend

# Reiniciar backend
pm2 restart level-up-backend
```

### Problema 2: "Error: listen EADDRINUSE"
```bash
# El puerto está ocupado, reinicia PM2
pm2 delete all
pm2 start server.js --name "level-up-backend"
cd .. && pm2 start npm --name "level-up-frontend" -- start
```

### Problema 3: "npm ERR! EACCES: permission denied"
```bash
# Cambiar permisos del directorio
sudo chown -R ubuntu:ubuntu ~/level-up-React
```

### Problema 4: No puedo acceder desde el navegador
```bash
# Verifica el Security Group en AWS
# Asegúrate de que los puertos 3000 y 5000 estén abiertos

# Verifica la IP pública
curl http://checkip.amazonaws.com
```

### Problema 5: Error en las rutas de Transbank
```bash
# Verifica el archivo .env
cat ~/level-up-React/level-up/backend/.env

# Asegúrate de que FRONTEND_URL tenga la IP correcta
# FRONTEND_URL=http://TU_IP_PUBLICA:3000
```

---

## 📝 **Variables de Entorno (.env) - Referencia Rápida**

```env
# Backend (.env)
PORT=5000
TRANSBANK_ENV=integration
FRONTEND_URL=http://TU_IP_PUBLICA:3000
TRANSBANK_COMMERCE_CODE=597055555532
TRANSBANK_API_KEY=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C
```

---

## 🎯 **Checklist Final**

- [ ] Instancia EC2 creada y en ejecución
- [ ] Node.js y npm instalados
- [ ] Repositorio clonado
- [ ] Dependencias instaladas (frontend y backend)
- [ ] Archivo .env creado con IP correcta
- [ ] PM2 instalado
- [ ] Backend corriendo con PM2
- [ ] Frontend corriendo con PM2
- [ ] Security Group configurado (puertos 22, 3000, 5000)
- [ ] Aplicación accesible desde el navegador
- [ ] Prueba de pago con Transbank exitosa

---

## 🚀 **¡Listo!**

Tu aplicación **Level-up Gamer** está ahora desplegada en AWS EC2 y disponible 24/7.

**URL de acceso:** `http://TU_IP_PUBLICA:3000`

---

## 📞 **Soporte**

Si tienes problemas:
1. Revisa los logs: `pm2 logs`
2. Verifica el Security Group
3. Asegúrate de que el .env tenga la IP correcta
4. Reinicia las apps: `pm2 restart all`

---

**Desarrollado por:** Benjamín  
**Fecha:** Noviembre 2025  
**Proyecto:** Level-up Gamer con Transbank WebPay Plus
