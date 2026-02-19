# Pre Entrega N°2 - Backend I

Repositorio correspondiente a la Pre Entrega N°2 del curso Backend I (Coderhouse), realizado por María Macarena Damiani.

## Descripción del proyecto

Este proyecto implementa una API REST para la gestión de productos y carritos de compra utilizando Node.js y Express. Los datos se persisten en archivos JSON.

## Tecnologías utilizadas

- Node.js
- Express
- Express Handlebars
- Socket.IO

## Instalación y ejecución

1. Clonar el repositorio.
2. Instalar dependencias: npm install
3. Iniciar el servidor:node app.js
4. La aplicación quedará disponible en: `http://localhost:8080`

## Funcionalidad en tiempo real (Socket.IO)

La vista en tiempo real está disponible en:

- `GET /realtimeproducts`

En esa pantalla, el cliente se conecta por Socket.IO y utiliza estos eventos:

- `addProduct`: envía un nuevo producto al servidor.
- `deleteProduct`: solicita eliminar un producto por ID.
- `updateProducts`: el servidor emite la lista actualizada para todos los clientes conectados.
- `error`: el servidor envía mensajes de error al cliente cuando ocurre una validación o falla.

De esta forma, cuando un usuario agrega o elimina productos, todos los navegadores conectados a `/realtimeproducts` reciben la actualización sin recargar la página.

## Endpoints

### Productos

- `GET /api/products`: obtiene todos los productos (acepta `?limit=n` para limitar resultados).
- `GET /api/products/:pid`: obtiene un producto por su ID.
- `POST /api/products`: crea un nuevo producto.
- `PUT /api/products/:pid`: actualiza un producto existente por su ID.
- `DELETE /api/products/:pid`: elimina un producto por su ID.

### Carritos

- `POST /api/carts`: crea un nuevo carrito vacío.
- `GET /api/carts/:cid`: obtiene los productos de un carrito específico.
- `POST /api/carts/:cid/product/:pid`: agrega un producto al carrito (incrementa `quantity` si ya existe).