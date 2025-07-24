document.addEventListener("DOMContentLoaded", () => {
  //Declaración de variables
  const productosDiv = document.getElementById("productos");
  const agregarBtn = document.getElementById("agregarProducto");
  const previewDiv = document.getElementById("preview");
  const clienteFinalCheckbox = document.getElementById("clienteFinal");
  const clienteFerreteroCheckbox = document.getElementById("clienteFerretero");
  const deliveryLocationSelect = document.getElementById("deliveryLocation");

  const ajustesPrecioPorUbicacion = {
    cantera: 1.0,
    chiclayo: 1.01,
    chongoyape: 1.02,
    patapo: 1.03,
    lambayeque: 1.04,
    pimentel: 1.05,
    santarosa: 1.06,
    monsefu: 1.07,
    morrope: 1.08,
    ferreñafe: 1.09,
    picsi: 1.10,
    trancafanupe: 1.11,
    etenciudad: 1.12,
    etenpuerto: 1.13,
    reque: 1.14,
    montegrande: 1.15,
    pomalca: 1.16,
    tuman: 1.17,
    sanjose: 1.18,
    mochumi: 1.19,
    punto4: 1.20,
    pitipo: 1.21,
    tucume: 1.22,
    illimo: 1.23,
    pacora: 1.24,
    jayanca: 1.25,
    sipan: 1.26,
    pacherres: 1.27,
    colliquealto: 1.28,
    zaña: 1.29,
  };

  //Ubicación por defecto
  let ubicacionSeleccionada = deliveryLocationSelect.value || "cantera";

  //Datos de productos
  const marcasLadrillos = {
    beta: { nombre: "Beta", precio: 50.0 },
    ceramicosLambayeque: { nombre: "Cerámicos Lambayeque", precio: 60.0 },
    chalpon: { nombre: "Chalpón", precio: 55.0 },
    fortaleza: { nombre: "Fortaleza", precio: 55.0 },
    ital: { nombre: "Ital", precio: 55.0 },
    ladrinorte: { nombre: "Ladrinorte", precio: 55.0 },
    norton: { nombre: "Norton", precio: 55.0 },
    sipan: { nombre: "Sipán", precio: 55.0 },
    tayson: { nombre: "Tayson", precio: 55.0 },
  };

  const datosProductos = {
    agregados: {
      afirmado: { nombre: "Afirmado", precio: 10.5 },
      arenaAmarilla: { nombre: "Arena Amarilla", precio: 20.0 },
      arenaFina: { nombre: "Arena Fina", precio: 15.75 },
      confitillo: { nombre: "Confitillo", precio: 15.75 },
      hormigon: { nombre: "Hormigón", precio: 15.75 },
      piedraBase: { nombre: "Piedra Base", precio: 15.75 },
      piedraChancada12: { nombre: "Piedra Chancada 1/2", precio: 15.75 },
      piedraChancada34: { nombre: "Piedra Chancada 3/4", precio: 15.75 },
      piedraOver: { nombre: "Piedra Over", precio: 15.75 },
    },

    ladrillos: {
      kingkongStandard: { nombre: "King Kong Standard", marcas: marcasLadrillos },
      kingkongTipoIV: { nombre: "King Kong Tipo IV", marcas: marcasLadrillos },
      pandereta: { nombre: "Pandereta", marcas: marcasLadrillos },
      pandereton: { nombre: "Panderetón", marcas: marcasLadrillos },
      pastelero: { nombre: "Pastelero", marcas: marcasLadrillos },
      superKingkong: { nombre: "Super King Kong", marcas: marcasLadrillos },
      techo8: { nombre: "Techo #8", marcas: marcasLadrillos },
      techo12: { nombre: "Techo #12", marcas: marcasLadrillos },
      techo15: { nombre: "Techo #15", marcas: marcasLadrillos },
      techo20: { nombre: "Techo #20", marcas: marcasLadrillos },
    },

    productosVarios: {
      mochicaAzul: { nombre: "Mochica Azul", precio: 50.0 },
      mochicaRojo: { nombre: "Mochica Rojo", precio: 60.0 },
      pacasmayoExtraforte: { nombre: "Pacasmayo Extraforte", precio: 55.0 },
      pacasmayoFortimax: { nombre: "Pacasmayo Fortimax", precio: 55.0 },
      rapimixAsentado: { nombre: "Rapimix Asentado", precio: 55.0 },
      rapimixTarrajeo: { nombre: "Rapimix Tarrajeo", precio: 55.0 },
    },
  };

  //Función de utilidad 1
  const fillSelect = (selectElement, dataObject) => {
    selectElement.innerHTML = '<option value="">Selecciona una opción</option>';
    if (!dataObject) return;
    for (const [key, item] of Object.entries(dataObject)) {
      const optionElement = document.createElement("option");
      optionElement.value = key;
      optionElement.textContent = item.nombre;
      selectElement.appendChild(optionElement);
    }
  };

  //Función de utilidad 2
  const handleClientCheckboxChange = (event) => {
    const clickedCheckbox = event.target;
    const otherCheckbox =
      clickedCheckbox === clienteFinalCheckbox
        ? clienteFerreteroCheckbox
        : clienteFinalCheckbox;

    if (clickedCheckbox.checked) {
      otherCheckbox.checked = false;
    } else if (!otherCheckbox.checked) {
      clickedCheckbox.checked = true;
    }
    updateQuotationPreview();
  };

  //Función recalcular y mostrar cotización (REFACTORIZADA)
  //Puede ser llamada cada vez que necesitemos actualizar la vista previa
  const updateQuotationPreview = () => {
    const productos = Array.from(document.querySelectorAll(".producto")).map(
      (productoSeleccionado) => {
        const categoriaSelect = productoSeleccionado.querySelector(".categoria-select");
        const subcategoriaLadrilloSelect = productoSeleccionado.querySelector(".subcategoria-ladrillo-select");
        const opcionSelect = productoSeleccionado.querySelector(".opcion-select");
        const cantidadInput = productoSeleccionado.querySelector(".cantidad");
        const tercerizarPedidoCheckbox = productoSeleccionado.querySelector(".tercerizar-pedido");
        const consolidarCargaCheckbox = productoSeleccionado.querySelector(".consolidar-carga");

        const categoriaSeleccionada = categoriaSelect.value;
        const tipoLadrilloSeleccionado = subcategoriaLadrilloSelect.value;
        const opcionSeleccionadaKey = opcionSelect.value;
        const cantidad = parseFloat(cantidadInput.value) || 0;
        const tercerizarPedido = tercerizarPedidoCheckbox.checked;
        const consolidarCarga = consolidarCargaCheckbox.checked;

        let productoNombre = "N/A";
        let precioBaseUnitario = 0;

        let productoData = null;

        //Determina producto y precio base según selecciones
        if (
          categoriaSeleccionada === "ladrillos" &&
          tipoLadrilloSeleccionado &&
          opcionSeleccionadaKey
        ) {
          const tipoLadrillo = datosProductos.ladrillos[tipoLadrilloSeleccionado];
          //Encadenamiento opcional para acceso seguro a propiedades anidadas
          productoData = tipoLadrillo?.marcas?.[opcionSeleccionadaKey];
        } else if (categoriaSeleccionada && opcionSeleccionadaKey) {
          productoData = datosProductos[categoriaSeleccionada]?.[opcionSeleccionadaKey];
        }

        if (productoData) {
          productoNombre = productoData.nombre;
          precioBaseUnitario = productoData.precio;
        }

        if (categoriaSeleccionada === "agregados") {
          if (tercerizarPedido) {
            precioBaseUnitario *= 1.1; //Aumento del 10% si es tercerizado
            productoNombre += " (Tercerizado)";
          }
          if (consolidarCarga) {
            precioBaseUnitario *= 0.95; //Descuento del 5% por consolidar
            productoNombre += " (Carga Consolidada)";
          }
        }

        //RETORNA el precio base ajustado por tercerización/consolidación
        //!!!El ajuste por ubicación se aplicará más adelante en el cálculo del total general
        return {
          nombre: productoNombre,
          cantidad: cantidad,
          precioBaseUnitario: precioBaseUnitario,
          tercerizarPedido: tercerizarPedido,
          consolidarCarga: consolidarCarga,
        };
      }
    );

    const esClienteFerretero = clienteFerreteroCheckbox.checked;

    let totalGeneral = 0;
    let tablaProductosHTML = "";

    if (productos.length > 0) {
      tablaProductosHTML += `
        <table>
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio unitario</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
      `;
      productos.forEach((item) => {
        //Calcula precio unitario final incluyendo ajuste por ubicación
        let precioFinalUnitario = item.precioBaseUnitario;
        const factorAjusteUbicacion = ajustesPrecioPorUbicacion[ubicacionSeleccionada] || 1;
        precioFinalUnitario *= factorAjusteUbicacion;

        const subtotalProducto = item.cantidad * precioFinalUnitario;
        totalGeneral += subtotalProducto;

        tablaProductosHTML += `
            <tr>
                <td>${item.nombre}</td>
                <td>${item.cantidad}</td>
                <td>S/.${precioFinalUnitario.toFixed(2)}</td>
                <td>S/.${subtotalProducto.toFixed(2)}</td>
            </tr>
        `;
      });
      tablaProductosHTML += `
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3" style="text-align: right; font-weight: bold;">Total General:</td>
                    <td style="font-weight: bold;">S/.${totalGeneral.toFixed(2)}</td>
                </tr>
            </tfoot>
        </table>
      `;
    } else tablaProductosHTML = `<p>No hay productos seleccionados para previsualizar.</p>`;

    //Aplicación de descuentos/precios basada en tipo de cliente
    if (esClienteFerretero) {
      totalGeneral *= 0.95; //5% de descuento adicional al total
      tablaProductosHTML = tablaProductosHTML.replace(
        /Total General:<\/td>\s*<td style="font-weight: bold;">S\/.([\d.]+)/,
        `Total General (Ferretero -5%):</td><td style="font-weight: bold;">S/.${totalGeneral.toFixed(2)}`
      );
    }

    previewDiv.innerHTML = `
      <h3>Vista Previa de la Cotización</h3>
      ${tablaProductosHTML}
    `;
  };

  //Interactividad para agregar nuevos productos dinámicamente
  agregarBtn.addEventListener("click", () => {
    const nuevoProducto = document.createElement("div");
    nuevoProducto.className = "producto";
    nuevoProducto.innerHTML = `
    <div class="select-group">
        <select class="categoria-select">
            <option value="">Selecciona una categoría</option>
            <option value="agregados">Agregados</option>
            <option value="ladrillos">Ladrillos</option>
            <option value="productosVarios">Productos varios</option>
        </select>
        <select class="subcategoria-ladrillo-select" style="display: none;">
            <option value="">Selecciona un tipo de ladrillo</option>
        </select>
        <select class="opcion-select" style="display: none;">
            <option value="">Selecciona una opción</option>
        </select>
    </div>
    <input type="number" placeholder="Cantidad" class="cantidad" min="1">
    <div class="agregados-options" style="display: none;">
        <label>
            <input type="checkbox" class="tercerizar-pedido"> Tercerizar Pedido
        </label>
        <label>
            <input type="checkbox" class="consolidar-carga"> Consolidar Carga
        </label>
    </div>
    <button type="button" class="eliminar" aria-label="Eliminar producto">X</button>
    `;
    productosDiv.appendChild(nuevoProducto);

    const categoriaSelect = nuevoProducto.querySelector(".categoria-select");
    const subcategoriaLadrilloSelect = nuevoProducto.querySelector(".subcategoria-ladrillo-select");
    const opcionSelect = nuevoProducto.querySelector(".opcion-select");
    const cantidadInput = nuevoProducto.querySelector(".cantidad");
    const agregadosOptionsDiv = nuevoProducto.querySelector(".agregados-options");
    const tercerizarPedidoCheckbox = nuevoProducto.querySelector(".tercerizar-pedido");
    const consolidarCargaCheckbox = nuevoProducto.querySelector(".consolidar-carga");

    //Agregar listeners a elementos del nuevo producto
    categoriaSelect.addEventListener("change", (event) => {
      const categoriaSeleccionada = event.target.value;

      fillSelect(subcategoriaLadrilloSelect, null);
      subcategoriaLadrilloSelect.style.display = "none";
      fillSelect(opcionSelect, null);
      opcionSelect.style.display = "none";

      if (categoriaSeleccionada === "agregados") {
        agregadosOptionsDiv.style.display = "block";
      } else {
        agregadosOptionsDiv.style.display = "none";
        tercerizarPedidoCheckbox.checked = false;
        consolidarCargaCheckbox.checked = false;
      }

      if (categoriaSeleccionada === "agregados") {
        cantidadInput.placeholder = "m³";
      } else if (
        categoriaSeleccionada === "ladrillos" ||
        categoriaSeleccionada === "productosVarios"
      ) {
        cantidadInput.placeholder = "unidades";
      } else cantidadInput.placeholder = "Cantidad";

      if (categoriaSeleccionada === "ladrillos") {
        subcategoriaLadrilloSelect.style.display = "block";
        fillSelect(subcategoriaLadrilloSelect, datosProductos.ladrillos);
      } else if (categoriaSeleccionada) {
        opcionSelect.style.display = "block";
        fillSelect(opcionSelect, datosProductos[categoriaSeleccionada]);
      }
      updateQuotationPreview();
    });

    subcategoriaLadrilloSelect.addEventListener("change", () => {
      const tipoLadrilloSeleccionado = subcategoriaLadrilloSelect.value;
      fillSelect(opcionSelect, null);
      opcionSelect.style.display = "none";
      if (tipoLadrilloSeleccionado) {
        opcionSelect.style.display = "block";
        const marcasDeLadrillos = datosProductos.ladrillos[tipoLadrilloSeleccionado]?.marcas;
        fillSelect(opcionSelect, marcasDeLadrillos);
      }
      updateQuotationPreview();
    });

    opcionSelect.addEventListener("change", updateQuotationPreview);
    cantidadInput.addEventListener("input", updateQuotationPreview);
    tercerizarPedidoCheckbox.addEventListener("change", updateQuotationPreview);
    consolidarCargaCheckbox.addEventListener("change", updateQuotationPreview);
    updateQuotationPreview();
  });

  //Delegación de eventos para eliminar productos
  productosDiv.addEventListener("click", (e) => {
    if (e.target.classList.contains("eliminar")) {
      e.target.parentElement.remove();
      updateQuotationPreview();
    }
  });

  //Actualización según lugar de entrega
  deliveryLocationSelect.addEventListener("change", (event) => {
    ubicacionSeleccionada = event.target.value;
    updateQuotationPreview();
  });

  clienteFinalCheckbox.addEventListener("change", handleClientCheckboxChange);
  clienteFerreteroCheckbox.addEventListener("change", handleClientCheckboxChange);
  agregarBtn.click();
});
