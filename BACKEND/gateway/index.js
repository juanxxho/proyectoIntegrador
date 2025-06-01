const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// Configura cada ruta con su microservicio
app.use(
  "/auth",
  createProxyMiddleware({
    target: "http://auth-service:3001",
    changeOrigin: true,
  })
);
app.use(
  "/usuarios",
  createProxyMiddleware({
    target: "http://usuarios-service:3002",
    changeOrigin: true,
  })
);
app.use(
  "/brigadas",
  createProxyMiddleware({
    target: "http://brigadas-service:3003",
    changeOrigin: true,
  })
);
app.use(
  "/investigaciones",
  createProxyMiddleware({
    target: "http://investigaciones-service:3004",
    changeOrigin: true,
  })
);
app.use(
  "/tareas",
  createProxyMiddleware({
    target: "http://tareas-service:3005",
    changeOrigin: true,
  })
);
app.use(
  "/novedades",
  createProxyMiddleware({
    target: "http://novedades-service:3006",
    changeOrigin: true,
  })
);
app.use(
  "/muestras",
  createProxyMiddleware({
    target: "http://muestras-service:3007",
    changeOrigin: true,
  })
);
app.use(
  "/fotos",
  createProxyMiddleware({
    target: "http://fotos-service:3008",
    changeOrigin: true,
  })
);
app.use(
  "/reportes",
  createProxyMiddleware({
    target: "http://reportes-service:3009",
    changeOrigin: true,
  })
);
app.use(
  "/inventarios",
  createProxyMiddleware({
    target: "http://inventario-service:3010",
    changeOrigin: true,
  })
);

const PORT = 80;
app.listen(PORT, () => {
  console.log(`Gateway corriendo en puerto ${PORT}`);
});
