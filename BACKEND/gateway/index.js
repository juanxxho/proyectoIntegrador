const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Configura cada ruta con su microservicio
app.use('/auth', createProxyMiddleware({ target: 'http://backend-auth-service-1:3001', changeOrigin: true }));
app.use('/usuarios', createProxyMiddleware({ target: 'http://backend-usuarios-service-1:3002', changeOrigin: true }));
app.use('/brigadas', createProxyMiddleware({ target: 'http://backend-brigadas-service-1:3003', changeOrigin: true }));
app.use('/investigaciones', createProxyMiddleware({ target: 'http://backend-investigaciones-service-1:3004', changeOrigin: true }));
app.use('/tareas', createProxyMiddleware({ target: 'http://backend-tareas-service-1:3005', changeOrigin: true }));
app.use('/novedades', createProxyMiddleware({ target: 'http://backend-novedades-service-1:3006', changeOrigin: true }));
app.use('/muestras', createProxyMiddleware({ target: 'http://backend-muestras-service-1:3007', changeOrigin: true }));
app.use('/fotos', createProxyMiddleware({ target: 'http://backend-fotos-service:3008', changeOrigin: true }));
app.use('/reportes', createProxyMiddleware({ target: 'http://backend-reportes-service-1:3009', changeOrigin: true }));
app.use('/inventarios', createProxyMiddleware({ target: 'http://backend-inventario-service-1:3010', changeOrigin: true }));


const PORT = 80;
app.listen(PORT, () => {
    console.log(`Gateway corriendo en puerto ${PORT}`);
});
