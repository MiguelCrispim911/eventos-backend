// Array para almacenar los eventos
let eventos = [];

// Función para cargar eventos desde localStorage
function cargarEventos() {
    const eventosGuardados = localStorage.getItem('eventos');
    if (eventosGuardados) {
        eventos = JSON.parse(eventosGuardados);
        mostrarEventos();
    }
}

// Función para guardar eventos en localStorage
function guardarEventos() {
    localStorage.setItem('eventos', JSON.stringify(eventos));
}

// Función para mostrar eventos en la página
function mostrarEventos() {
    const listaEventos = document.getElementById('lista-eventos');
    if (listaEventos) {
        listaEventos.innerHTML = '';
        
        eventos.forEach((evento, index) => {
            const eventoCard = document.createElement('div');
            eventoCard.className = 'event-card';
            eventoCard.innerHTML = `
                <a href="funciones.html?id=${evento.id}">
                    <img src="${evento.fotoPrincipal}" alt="${evento.nombre}">
                    <h3>${evento.nombre}</h3>
                </a>
                <p>${evento.descripcion}</p>
                <p><strong>Lugar:</strong> ${evento.ciudad}</p>
                <button onclick="verFunciones(${evento.id})">Ver Funciones</button>
            `;
            listaEventos.appendChild(eventoCard);
        });
    }
}

// Función para manejar el formulario de nuevo evento
document.getElementById('form-evento')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nuevoEvento = {
        id: Date.now(), // ID único basado en timestamp
        nombre: document.getElementById('nombre').value,
        descripcion: document.getElementById('descripcion').value,
        fotoPrincipal: URL.createObjectURL(document.getElementById('foto-principal').files[0]),
        fotoSecundaria: document.getElementById('foto-secundaria').files[0] ? 
            URL.createObjectURL(document.getElementById('foto-secundaria').files[0]) : '',
        cedulaAdmin: document.getElementById('cedula').value,
        ciudad: document.getElementById('ciudad').value,
        funciones: parseInt(document.getElementById('funciones').value),
        funcionesDetalle: []
    };
    
    // Crear array para las funciones
    for (let i = 0; i < nuevoEvento.funciones; i++) {
        nuevoEvento.funcionesDetalle.push({
            id: i + 1,
            fecha: '',
            hora: '',
            precio: 0,
            asientosDisponibles: 0
        });
    }
    
    eventos.push(nuevoEvento);
    guardarEventos();
    alert('Evento registrado con éxito! ID: ' + nuevoEvento.id);
    this.reset();
});

// Función para ver funciones de un evento
function verFunciones(eventoId) {
    window.location.href = `funciones.html?id=${eventoId}`;
}

// Cargar eventos al iniciar
document.addEventListener('DOMContentLoaded', cargarEventos);
