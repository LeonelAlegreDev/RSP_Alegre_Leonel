import HomeController from "./src/controllers/HomeController.js";
import ABM from "./src/components/ABM.js";
import Modal from "./src/components/Modal.js";
import Table from "./src/components/Table.js";

import Loader from "./src/components/Loader.js";

// Muestra la pantalla de carga
document.documentElement.addEventListener("load", function(){
    Loader.Show("main_loader");
});

// Obtiene las vehiculos
let vehiculos = await HomeController.GetVehiculosFetch();

// Parsea los datos a objetos de tipo Vehiculo
vehiculos = HomeController.ParsearDatos(vehiculos);

// Carga la tabla con los datos
Table.CargarTabla(vehiculos);

// Activa manejadores para los eventos del form ABM
ABM.HandleABM(vehiculos);

// Maneja las acciones del modal
Modal.HandleModal("staticBackdrop");

Table.HandleTable(vehiculos);

// Oculta la pantalla de carga
Loader.Hide("main_loader");

