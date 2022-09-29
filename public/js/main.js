const socket = io.connect();

//------------------------------------------------------------------------------------

const formAgregarProducto = document.getElementById('formAgregarProducto')
formAgregarProducto.addEventListener('submit', e => {
    e.preventDefault()
    const producto = {
        title: formAgregarProducto[0].value,
        price: formAgregarProducto[1].value,
        thumbnail: formAgregarProducto[2].value
    }
    socket.emit('update', producto);
    formAgregarProducto.reset()
})

socket.on('productos', productos => {
    makeHtmlTable(productos).then(html => {
        document.getElementById('productos').innerHTML = html
    })
});

function makeHtmlTable(productos) {
    return fetch('plantillas/tabla-productos.hbs')
        .then(respuesta => respuesta.text())
        .then(plantilla => {
            const template = Handlebars.compile(plantilla);
            const html = template({ productos })
            return html
        })
}

//-------------------------------------------------------------------------------------

// MENSAJES

/* --------------------- DESNORMALIZACIÓN DE MENSAJES ---------------------------- */

import {schema , denormalize} from "../src/main.js" ;

// Definimos un esquema de autor
 const autorSchema = new schema.Entity('author',{} ,{idAttribute: 'email'});

// Definimos un esquema de mensaje

const mensajeSchema = new schema.Entity('text')
// Definimos un esquema de posts

const postSchema = new schema.Entity('posts', {
    author: autorSchema,
    mensaje : [mensajeSchema]
})




function print(objeto) {
    console.log(util.inspect(objeto, false, 12, true));
}
/* ----------------------------------------------------------------------------- */

const inputUsername = document.getElementById('username')
const inputMensaje = document.getElementById('inputMensaje')
const btnEnviar = document.getElementById('btnEnviar')

const formPublicarMensaje = document.getElementById('formPublicarMensaje')
formPublicarMensaje.addEventListener('submit', e => {
    e.preventDefault()

    const mensaje = {
        author: {
            email: inputUsername.value,
            nombre: document.getElementById('firstname').value,
            apellido: document.getElementById('lastname').value,
            edad: document.getElementById('age').value,
            alias: document.getElementById('alias').value,
            avatar: document.getElementById('avatar').value
        },
        text: inputMensaje.value
    }

    socket.emit('nuevoMensaje', mensaje);
   
    formPublicarMensaje.reset()
    inputMensaje.focus()
})

socket.on('mensajes', (mensajesN) => {
   
    const mensajesD = denormalize(mensajesN.result , postSchema , mensajesN.entities)
    console.log(mensajesD)
    console.log(`Porcentaje de compresión ${porcentajeC}%`)
    document.getElementById('compresion-info').innerText = porcentajeC

    console.log(mensajesD.mensajes);
    const html = makeHtmlList(mensajesD.mensajes)
    document.getElementById('mensajes').innerHTML = html;
})

function makeHtmlList(mensajes) {
    return mensajes.map(mensaje => {
        return (`
        <div>
            <b style="color:blue;">${mensaje.author.email}</b>
            [<span style="color:brown;">${mensaje.fyh}</span>] :
            <i style="color:green;">${mensaje.text}</i>
            <img width="50" src="${mensaje.author.avatar}" alt=" ">
        </div>
    `)
    }).join(" ");
}

inputUsername.addEventListener('input', () => {
    const hayEmail = inputUsername.value.length
    const hayTexto = inputMensaje.value.length
    inputMensaje.disabled = !hayEmail
    btnEnviar.disabled = !hayEmail || !hayTexto
})

inputMensaje.addEventListener('input', () => {
    const hayTexto = inputMensaje.value.length
    btnEnviar.disabled = !hayTexto
})