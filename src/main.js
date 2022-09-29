import  express from "express"; 

import { Server as HttpServer } from 'http'
import { Server as Socket } from 'socket.io'

import ContenedorSQL from './contenedores/ContenedorSQL.js'
import ContenedorArchivo from './contenedores/ContenedorArchivo.js'

import config from './config.js'

//--------------------------------------------
// instancio servidor, socket y api

const app = express()
const httpServer = new HttpServer(app)
const io = new Socket(httpServer)

const productosApi = new ContenedorSQL(config.mariaDb, 'productos')
const mensajesApi = new ContenedorArchivo(`${config.fileSystem.path}/mensajes.json`)
 
//--------------------------------------------
// NORMALIZACIÓN DE MENSAJES
import {normalize , schema, denormalize } from 'normalizr'
 //       import normalizr from 'normalizr';
 //       const normalize = normalizr.normalize;
 //       const schema = normalizr.schema;
  //      const denormalize = normalizr.denormalize;

// Definimos un esquema de autor
 const autorSchema = new schema.Entity('author',{} ,{idAttribute: 'email'});

// Definimos un esquema de mensaje

const mensajeSchema = new schema.Entity('text')
// Definimos un esquema de posts

const postSchema = new schema.Entity('posts', {
    author: autorSchema,
    mensaje : [mensajeSchema]
})

//--------------------------------------------
// configuro el socket

io.on('connection', async socket => {
    console.log('Nuevo cliente conectado!');

    console.log('conectado')
    socket.emit('productos', await productosApi.listarAll())

    socket.on('update', async (producto) => { 
        productosApi.guardar(producto);
        const productos =  await productosApi.listarAll()
        io.sockets.emit('productos', productos );
    });
    const msj = await listarMensajesNormalizados(await mensajesApi.listarAll());
    
    socket.emit('mensajes',  msj);

    socket.on('nuevoMensaje', async (data) => {
        
        mensajesApi.guardar(data)
        const mensajesN = await listarMensajesNormalizados(await mensajesApi.listarAll()) 
        
        io.sockets.emit('mensajes', mensajesN);
    });
});



async function listarMensajesNormalizados(msj) {
    return normalize(msj,postSchema)
}

import util from 'util';

function print(objeto) {
    console.log(util.inspect(objeto, false, 12, true));
}

//--------------------------------------------
// agrego middlewares

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

//--------------------------------------------

app.get('/api/productos-test', (req, res) => {
    
})

//--------------------------------------------
// inicio el servidor

const PORT = 8080
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))

export {schema , denormalize} ; 