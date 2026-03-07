# Entrega Final - Backend I

Proyecto final de Backend I (Coderhouse) con persistencia principal en MongoDB, API REST completa de productos/carritos, paginación profesional y vistas con Handlebars.

## Tecnologías

- Node.js
- Express
- MongoDB + Mongoose
- Express Handlebars

## Configuración

1. Instalar dependencias:
	- `npm install`
2. Crear archivo `.env` a partir de `.env.example`
3. Configurar `MONGO_URI`
4. Ejecutar:
	- `npm start`

Servidor: http://localhost:8080

## Estructura

- Todo el código de la aplicación está dentro de `src/`:
	- `src/app.js`
	- `src/config`
	- `src/models`
	- `src/managers`
	- `src/routes`
	- `src/views`
	- `src/public`

## Endpoints API

### Productos

- `GET /api/products`
  - Query params opcionales: `limit`, `page`, `sort` (`asc`/`desc`), `query`
	- `query` admite categoría o disponibilidad (ej: `query=ropa`, `query=true`, `query=false`)
  - Respuesta:
	 - `status`
	 - `payload`
	 - `totalPages`
	 - `prevPage`
	 - `nextPage`
	 - `page`
	 - `hasPrevPage`
	 - `hasNextPage`
	 - `prevLink`
	 - `nextLink`
- `GET /api/products/:pid`
- `POST /api/products`
- `PUT /api/products/:pid`
- `DELETE /api/products/:pid`

### Carritos

- `POST /api/carts`
- `GET /api/carts/:cid` (incluye `populate` de productos)
- `POST /api/carts/:cid/products/:pid`
- `DELETE /api/carts/:cid/products/:pid`
- `PUT /api/carts/:cid` (reemplaza arreglo completo de productos)
- `PUT /api/carts/:cid/products/:pid` (actualiza solo `quantity`)
- `DELETE /api/carts/:cid` (vacía carrito)

## Vistas

- `GET /products`: listado paginado + filtros/orden + botón agregar al carrito
- `GET /products/:pid`: detalle completo + botón agregar al carrito
- `GET /carts/:cid`: vista de carrito específico