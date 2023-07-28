function irAFormulario() {
  const formulario = document.getElementById("formulario");
  formulario.style.display = "block";

  const btnRealizarConsulta = document.getElementById("btnRealizarConsulta");
  btnRealizarConsulta.style.display = "none";
}

function buscarOrden() {
  const numeroOrden = document.getElementById("numeroOrden").value;
  const resultadoDiv = document.getElementById("resultado");
  const errorDiv = document.getElementById("errorBusqueda");

  // Limpiar contenido anterior
  resultadoDiv.innerHTML = "";
  errorDiv.style.display = "none";

  fetch(`http://localhost:3000/buscar-orden/${numeroOrden}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al buscar la orden");
      }
      return response.json();
    })
    .then((data) => mostrarResultado(data))
    .catch((error) => {
      console.error("Error al buscar la orden:", error.message);
      errorDiv.style.display = "block";
      resultadoDiv.innerHTML = "";
    });
}

function limpiarFormulario() {
  const numeroOrden = document.getElementById("numeroOrden");
  const resultadoDiv = document.getElementById("resultado");
  const errorDiv = document.getElementById("error");

  numeroOrden.value = "";
  resultadoDiv.innerHTML = "";
  errorDiv.innerHTML = "";
  document.getElementById("formulario").style.display = "none";
  document.getElementById("btnRealizarConsulta").style.display = "block";
}

function mostrarResultado(data) {
  const resultadoDiv = document.getElementById("resultado");
  const errorDiv = document.getElementById("errorBusqueda");

  resultadoDiv.innerHTML = ""; // Limpiar contenido anterior

  const { OrderID, CompanyName, Address } = data[0];
  if(OrderID){
  const infoOrden = document.createElement("div");
  infoOrden.innerHTML = `
    <h2>Información de la Orden ${OrderID || "N/A"}</h2>
    <p><strong>Nombre de la Compañía:</strong> ${CompanyName}</p>
    <p><strong>Dirección:</strong> ${Address || "N/A"}</p>
  `;
  resultadoDiv.appendChild(infoOrden);

  const productosDiv = document.createElement("div");
  productosDiv.innerHTML = "<h2>Productos de la Orden:</h2>";

  data.forEach((producto) => {
    // Verificar si los campos tienen valores antes de mostrar la información
    const { ProductName, UnitPrice, Quantity, CantidadOtrasOrdenes } = producto;
    if (ProductName || UnitPrice !== null || Quantity !== null || CantidadOtrasOrdenes !== null) {
      const productoDiv = document.createElement("div");
      productoDiv.innerHTML = `
        <p><strong>Producto:</strong> ${ProductName || "N/A"}</p>
        <p><strong>Precio Unitario:</strong> ${UnitPrice ? UnitPrice.toFixed(2) : "N/A"}</p>
        <p><strong>Cantidad:</strong> ${Quantity || "N/A"}</p>
        <p><strong>Otras Órdenes con este Producto:</strong> ${CantidadOtrasOrdenes || "N/A"}</p>
      `;
      productosDiv.appendChild(productoDiv);
    }
  });

  resultadoDiv.appendChild(productosDiv);
}else{
    const error = document.createElement("div");
  error.innerHTML = 
    '<p class="mensaje-error">No se encontró información, recuerde ingresar un número de orden existente</p>'
    resultadoDiv.appendChild(error)
}
}




