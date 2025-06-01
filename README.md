# Proyecto Integrador - Sistema de Gestión de Brigadas
## 📦 Requisitos

- [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (solo si vas a correr el frontend fuera de Docker)
- Git

Este proyecto implementa una arquitectura de microservicios para la gestión de brigadas, expertos y demás entidades necesarias.

## 🧱 Tecnologías principales

- Node.js (con Express)
- Sequelize ORM
- MySQL y PostgreSQL
- Docker & Docker Compose
- Git y GitHub
- React con js y ts

## 🚀 ¿Cómo levantar el proyecto?

1. Clona el repositorio:

```bash
git clone https://github.com/juanxxho/proyectoIntegrador.git
cd proyectoIntegrador
||||||||||||||||||||
en otro bash
cd frontend
npm install
npm run dev
|||||||||||||
en otro bash
cd BACKEND
docker-compose down
docker-compose up -d
