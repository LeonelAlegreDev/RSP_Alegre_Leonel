import HomeController from "./src/controllers/HomeController.js";
import Loader from "./src/utils/Loader.js";

// Muestra la pantalla de carga
document.documentElement.addEventListener("load", function(){
    Loader.Show("main_loader");
});

// Obtiene las vehiculos
let vehiculos = await HomeController.GetVehiculosFetch();

// Parsea los datos a objetos de tipo Vehiculo
vehiculos = HomeController.ParsearDatos(vehiculos);

// Carga la tabla con los datos
HomeController.CargarTabla(vehiculos);

// Activa manejadores para los eventos del form ABM
HomeController.HandleABM(vehiculos);

// Maneja las acciones del modal
HomeController.HandleModal();

HomeController.HandleTable(vehiculos);

// Oculta la pantalla de carga
Loader.Hide("main_loader");

