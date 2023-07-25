let pasajes = [
  { id: 1, destino: "BARCELONA", precio: 1249, categoria: "EUROPA", asientosDisponibles: 34, rutaImagen: "./image/01.jpg" },
  { id: 2, destino: "PARIS", precio: 1430, categoria: "EUROPA", asientosDisponibles: 24, rutaImagen: "./image/02.jpg" },
  { id: 3, destino: "LISBOA", precio: 1590, categoria: "EUROPA", asientosDisponibles: 18, rutaImagen: "./image/03.jpg" },
  { id: 4, destino: "VENECIA", precio: 1730, categoria: "EUROPA", asientosDisponibles: 3, rutaImagen: "./image/04.jpg" },
  { id: 5, destino: "LONDRES", precio: 1350, categoria: "EUROPA", asientosDisponibles: 29, rutaImagen: "./image/05.jpg" },
  { id: 6, destino: "BANGKOK", precio: 2470, categoria: "ASIA", asientosDisponibles: 5, rutaImagen: "./image/06.jpg" },
  { id: 7, destino: "TOKIO", precio: 2380, categoria: "ASIA", asientosDisponibles: 15, rutaImagen: "./image/07.jpg" },
  { id: 8, destino: "DUBAI", precio: 2000, categoria: "ASIA", asientosDisponibles: 7, rutaImagen: "./image/08.jpg" },
  { id: 9, destino: "TORONTO", precio: 1036, categoria: "AMERICA", asientosDisponibles: 23, rutaImagen: "./image/09.jpg" },
  { id: 10, destino: "CALIFORNIA", precio: 1363, categoria: "AMERICA", asientosDisponibles: 15, rutaImagen: "./image/10.jpg" },
]

let contenedor = document.getElementById("destinos")
let btnVerCarrito = document.getElementById("btnVerCarrito")
let carritoLabel = document.getElementById("carritoLabel")
let totalLabel = document.getElementById("totalLabel")
let btnsFiltrarCategoria = document.getElementsByClassName("btnFiltrarCategoria")

let carritoJSON = JSON.parse(localStorage.getItem("carrito"))
let carrito = carritoJSON ? carritoJSON : []

let pasajesJSON = JSON.parse(localStorage.getItem("pasajes"))
pasajes = pasajesJSON ? pasajesJSON : pasajes

crearTarjetas(pasajes)

Array.from(btnsFiltrarCategoria).forEach((btn) => {
  btn.addEventListener("click", filtrarPorCategoria)
})

let buscador = document.getElementById("buscador")
buscador.addEventListener("input", filtrar)

function filtrar() {
  let busqueda = buscador.value.toUpperCase()
  let arrayFiltrado = pasajes.filter(
    (producto) =>
      producto.destino.toUpperCase().includes(busqueda) ||
      producto.categoria.toUpperCase().includes(busqueda)
  )
  crearTarjetas(arrayFiltrado)
}

function crearTarjetas(pasajes) {
  contenedor.innerHTML = ""
  pasajes.forEach(({ destino, rutaImagen, precio, categoria, asientosDisponibles, id }) => {
    let tarjeta = document.createElement("div")
    tarjeta.className = "tarjeta"
    tarjeta.innerHTML = `
        <h4>${destino}</h4>
        <div class=image style="background-image: url(${rutaImagen})"></div>
        <p>Precio: USD$ ${precio}</p>
        <p>Categoría: ${categoria}</p>
        <p>Asientos Disponibles: ${asientosDisponibles}</p>
        <button class="btnAgregarCarrito" data-id="${id}">Agregar al Carrito</button>
      `
    contenedor.appendChild(tarjeta)
  })

  let btnsAgregarCarrito = document.getElementsByClassName("btnAgregarCarrito")
  Array.from(btnsAgregarCarrito).forEach((btn) => {
    btn.addEventListener("click", agregarAlCarrito)
  })
}

function agregarAlCarrito(event) {
  let pasajeId = parseInt(event.target.getAttribute("data-id"))
  let pasaje = pasajes.find((e) => e.id === pasajeId)

  if (pasaje && pasaje.asientosDisponibles > 0) {
    carrito.push(pasaje)

    let nuevosPasajes = [...pasajes]
    let pasajeIndex = nuevosPasajes.findIndex((e) => e.id === pasajeId)
    nuevosPasajes[pasajeIndex] = {
      ...nuevosPasajes[pasajeIndex],
      asientosDisponibles: nuevosPasajes[pasajeIndex].asientosDisponibles - 1,
    }
    pasajes = nuevosPasajes

    actualizarCarrito()
    crearTarjetas(pasajes)
    clickAlCarro()

  }
}

function mostrarCarrito() {
  let carritoHTML = ""
  let total = 0
  carrito.forEach(({ destino, precio }) => {
    carritoHTML += `<p>${destino} - USD$ ${precio}</p>`
    total += precio
  })
  carritoLabel.innerHTML = carritoHTML
  totalLabel.innerHTML = `Total: USD$ ${total}`
}

function actualizarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito))
  localStorage.setItem("pasajes", JSON.stringify(pasajes))
}

function filtrarPorCategoria(event) {
  let categoria = event.target.getAttribute("data-categoria")

  if (categoria === "todos") {
    crearTarjetas(pasajes)
  } else {
    let arrayFiltrado = pasajes.filter((pasaje) => pasaje.categoria === categoria)
    crearTarjetas(arrayFiltrado)
  }
}

btnVerCarrito.addEventListener("click", () => {
  mostrarCarrito()
  scrollToTop()

  let cancelarCompraBtn = document.getElementById("cancelarCompra")
  cancelarCompraBtn.style.display = "block"

  finalizarCompraBtn.style.display = "block"
})

let finalizarCompraBtn = document.getElementById("finalizarCompra")
finalizarCompraBtn.addEventListener("click", finalizarCompra)

function finalizarCompra() {
  if (carrito.length === 0) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No hay productos para finalizar la compra.',
    })
  } else {

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Una vez finalizada la compra, no podrás deshacerlo.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, finalizar compra'
    }).then((result) => {
      if (result.isConfirmed) {
        carrito = []
        actualizarCarrito()
        contenedor.innerHTML = ""

        Swal.fire(
          '¡Compra finalizada!',
          'El carrito está vacío.',
          'success'
        )

        mostrarCarrito()

        let cancelarCompraBtn = document.getElementById("cancelarCompra")
        cancelarCompraBtn.style.display = "none"

        finalizarCompraBtn.style.display = "none"
      }
    })
  }
}

let cancelarCompraBtn = document.getElementById("cancelarCompra")
cancelarCompraBtn.addEventListener("click", cancelarCompra)

function cancelarCompra() {

  Swal.fire({
    title: '¿Estás seguro?',
    text: '¡No podrás revertir esto!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, cancelar compra'
  }).then((result) => {
    if (result.isConfirmed) {
      carrito.forEach((pasajeCarrito) => {
        let pasajeStock = pasajes.find((pasaje) => pasaje.id === pasajeCarrito.id)
        if (pasajeStock) {
          pasajeStock.asientosDisponibles++
        }
      })

      carrito = []
      actualizarCarrito()
      crearTarjetas(pasajes)

      cancelarCompraBtn.style.display = 'none'

      carritoLabel.innerHTML = ''
      totalLabel.innerHTML = 'Total: USD$ 0'

      Swal.fire(
        '¡Compra cancelada!',
        'Tu carrito está vacío.',
        'success'
      )
    }
  })
}

function scrollToTop() {
  let scrollOptions = {
    top: 0,
    behavior: "smooth"
  }
  window.scrollTo(scrollOptions)
}

function clickAlCarro() {
  Toastify({
    text: "Pasaje agregado",
    className: "info",
    duration: 2000,
    position: "left",
    style: {
      background: "linear-gradient(to right, #d14141a4, #6e3dc986)",
    }
  }).showToast()
}

document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault()

  let username = document.getElementById('username').value
  let password = document.getElementById('password').value

  fetch('users.json')
    .then(response => response.json())
    .then(data => {
      let user = data.users.find(user => user.username === username && user.password === password)

      if (user) {
        Swal.fire({
      icon: 'success',
      title: 'Inicio de sesión exitoso',
      text: '¡Bienvenido!',
    })
      } else {
        Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Usuario o contraseña incorrectos. Inténtalo de nuevo.',
    })
      }
    })
    .catch(error => console.error('Error al cargar el archivo JSON:', error))
})
document.getElementById('mostrarForm').addEventListener('click', function() {
  document.getElementById('labelIzquierdo').style.display = 'block'
  document.getElementById('loginForm').style.display = 'block'
  this.style.display = 'none'
})

