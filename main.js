fetch('./data.json').then(respuesta => respuesta.json()).then(assortment => { miPrograma(assortment)
})

function miPrograma(assortment){

    let products = assortment.map(({id,name,price, stock, category, posterUrl}) => new Products(id, name, price, stock, category, posterUrl))
    let carrito = []
    let botonComprar =document.getElementById("compraFinalizada")
    botonComprar.addEventListener("click", finalizarCompra)
    function finalizarCompra(){
        
        let valorTotal = 0
        for (let index = 0; index < carrito.length; index++) {
            valorTotal += carrito[index].subtotal
            
        }
        Swal.fire({
            title: 'Compra Finalizada!',
            text: `Valor a pagar $${valorTotal}`,
            icon: 'success',
            confirmButtonText: 'Cool'
          })
        //alert(`Muchas gracias por su compra, el valor a pagar es $${valorTotal}.`)
        
        localStorage.removeItem("carrito")
        carrito = []
        renderizarCarrito(carrito)
        
        
    }
    
    let carritoDOM = document.getElementById("carrito")
    if(localStorage.getItem("carrito")){
        carrito = JSON.parse(localStorage.getItem("carrito"))
        renderizarCarrito(carrito)
    }
    
    
    renderizarProductos(products)
    function renderizarProductos(arrayProductos){
        let contenedor = document.getElementById("contenedorProductos")
        contenedor.innerHTML = ""
        arrayProductos.forEach(({id,name,category, posterUrl, price }) => {
            let tarjetaProducto = document.createElement("div")
            tarjetaProducto.className = "tarjetaProducto"
    
            tarjetaProducto.innerHTML = `
            <h2 class= tituloProducto>${name}</h2>
            <p>${category}</p>
            <img src = ${posterUrl}>
            <h3> Precio: ${price} </h3>
            <button id=${id}>Agregar al carrito</button> 
            `
            contenedor.appendChild(tarjetaProducto)
    
            let boton = document.getElementById(id)
            boton.addEventListener("click",agregarProductoAlCarrito)
        })
    }
    
    function agregarProductoAlCarrito(e){
        let productoAgregado = products.find(({id}) => id == e.target.id)
        if(carrito.some(producto => producto.id == productoAgregado.id)){
            let pos = carrito.findIndex(producto => producto.id == productoAgregado.id)
            carrito[pos].units++
            carrito[pos].subtotal = carrito[pos].priceUnit * carrito[pos].units     
        }else{
            carrito.push({
                id: productoAgregado.id,
                name: productoAgregado.name,
                priceUnit : productoAgregado.price,
                units: 1,
                subtotal: productoAgregado.price
            })
        }
        localStorage.setItem("carrito", JSON.stringify(carrito))
        renderizarCarrito(carrito)
    }
    
    function renderizarCarrito(arrayProductos){
        carritoDOM.innerHTML = ""
        arrayProductos.forEach(({name, units}) => {
            carritoDOM.innerHTML += `<h3> Unidades totales de ${name} ${units}  </h3>` 
        }
    
        )
    }
    
    let productoBuscado = document.getElementById("productoBuscado")
    productoBuscado.addEventListener("change", filtrar)
    let buscador = document.getElementById("buscador")
    buscador.addEventListener("click", filtrar)
    
    function filtrar(){
        let arrayFiltrado = products.filter(({name}) => name.toLowerCase().includes(productoBuscado.value.toLowerCase()))
        renderizarProductos(arrayFiltrado)
        
    }
    
    function categorias(arrayProductos){
        let categorias = arrayProductos.map(({category}) => category)
        const catArray = new Set(categorias)
        let categoriasUnicas = [...catArray]
        let contenedorCategorias = document.getElementById("contenedorCategorias")
        categoriasUnicas.forEach(categoria => {
            
            let boxcategoria = document.createElement("div")
            boxcategoria.className = "tarjetacategoria"
            boxcategoria.innerHTML = `
            <input id=${categoria} type="checkbox" value=${categoria}>
            <label for="vehicle1"> ${categoria}</label>
            `
            contenedorCategorias.appendChild(boxcategoria)
            let boton = document.getElementById(categoria)
            boton.addEventListener("click", filtrarCategoria)
            function filtrarCategoria(){
                let arrayFiltrado = products.filter(({category}) => category == boton.value)
                renderizarProductos(arrayFiltrado)
                
            }
    
        })
    }
    categorias(products)
}

