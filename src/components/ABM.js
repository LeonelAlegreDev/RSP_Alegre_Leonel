import Validator from "../utils/Validator.js";
import Loader from "./Loader.js";
import Terrestre from "../models/Terrestre.js";
import Aereo from "../models/Aereo.js";
import HomeController from "../controllers/HomeController.js";
import Table from "./Table.js";

class ABM
{
    static HandleABM(vehiculos) {
        this.HandleABMDisplay();

        this.HandleABMConfirmar(vehiculos);

        this.HandleABMCamposTipo();
    }

    // Se encarga de mostrar y ocultar el ABM
    static HandleABMDisplay(){
        // Muestra el formulario ABM
        document.getElementById("btn_agregar_vehiculo").addEventListener("click", () =>{
            document.getElementById("abm_container").style.display = "flex";
            document.getElementById("form_container").style.display = "none";
        });

        // Oculta el formulario ABM al cancelar
        document.getElementById("abm_cancelar").addEventListener("click", () =>{
            document.getElementById("abm_container").style.display = "none";
            document.getElementById("form_container").style.display = "flex";;

            const requireFields = document.getElementById('form_abm').querySelectorAll('[required]');
            for (const campo of requireFields) {
                // Oculta el mensaje de error
                campo.nextElementSibling.classList.add("hidden");
            }
        });
    }

    // Se encarga de realizar la solicitud y cargar el registro cuando se confirma la accion
    static HandleABMConfirmar(vehiculos){
        // Confirmacion del Alta ABM
        document.getElementById("abm_confirmar").addEventListener("click", (event) =>{
            const tipo = document.getElementById("abm_tipo").value;
            const result = Validator.ValidarCamposPorTipo(tipo);
            
            const campos_comunes = {
                modelo: document.getElementById('abm_modelo'),
                anoFab: document.getElementById('abm_anoFab'),
                velMax: document.getElementById('abm_velMax'),
            };
            const campos_aereo = {
                altMax: document.getElementById('abm_altMax'),
                autonomia: document.getElementById('abm_autonomia')
            };
            const campos_terrestre = {
                cantPue: document.getElementById('abm_cantPue'),
                cantRue: document.getElementById('abm_cantRue')
            };

            // Valida que se hayan marcado los campos
            if (result === true) {
                // Referencia al vehicuo a cargar
                let vehiculo;

                // Referencias al modal de respuesta y la tabla response
                const modal = document.getElementById('staticBackdrop');
                const loader_text = document.getElementById("loader_text");
                const instance = new bootstrap.Modal(modal);
                const table_response = document.getElementById("table_response");

                // Oculta la tabla response y Muestra el modal de respuesta
                table_response.classList.add("hidden");
                Loader.Show("modal_loader");
                loader_text.classList.remove("hidden");
                instance.show();

                switch (tipo) {
                    case "aereo":
                        vehiculo = new Aereo(
                            0,
                            campos_comunes.modelo.value,
                            campos_comunes.anoFab.value,
                            campos_comunes.velMax.value,
                            campos_aereo.altMax.value,
                            campos_aereo.autonomia.value
                        );
                        break;
                    case "terrestre":
                        vehiculo = new Terrestre(
                            0,
                            campos_comunes.modelo.value,
                            campos_comunes.anoFab.value,
                            campos_comunes.velMax.value,
                            campos_terrestre.cantPue.value,
                            campos_terrestre.cantRue.value
                        );
                        break;
                }

                // Envia una consulta POST y maneja el resultado
                HomeController.AltaVehiculoXML(vehiculo, (res) => {
                    const modal_status = document.getElementById("modal_status");
                    const modal_error = document.getElementById("modal_error");
                    const tr_error = modal_error.closest("tr");
                    const modal_mensaje = document.getElementById("modal_mensaje");

                    if(res.status == 200){
                        // obtiene el id de la respuesta
                        let id = JSON.parse(res.message);
                        id = id["id"];

                        // establece los mensajes
                        modal_status.textContent = res.status;
                        modal_mensaje.textContent = "Usuario dado de alta con id " + id;
                        tr_error.classList.add("hidden");
                        vehiculo.id = id;

                        // Agrega el vehiculo al array de vehiculos
                        vehiculos.push(vehiculo);

                        // Carga la tabla con el erray actualizado
                        Table.CargarTabla(vehiculos);

                        Table.HandleTable(vehiculos);
                    }
                    else {
                        // establece los mensajes
                        modal_status.textContent = res.status;
                        modal_mensaje.textContent = res.message;
                        modal_error.textContent = res.error;
                        tr_error.classList.remove("hidden");
                    }

                    // Oculta el loader del modal de respuesta
                    Loader.Hide("modal_loader");
                    loader_text.classList.add("hidden");

                    // Muestra la tabla con los mensajes
                    table_response.classList.remove("hidden");
                });
            }
            else{
                event.preventDefault();
            }
        });
    }

    // Muestra y oculta campos segun el tipo
    static HandleABMCamposTipo(){
        // Muestra y oculta campos del formulario segun el tipo
        document.getElementById("abm_tipo").addEventListener("input", () =>
        {
            // Obtiene los campos a manipular
            const campos_aereo = [
                document.getElementById('abm_altMax').parentNode,
                document.getElementById('abm_autonomia').parentNode
            ];
            const campos_terrestre = [
                document.getElementById('abm_cantPue').parentNode,
                document.getElementById('abm_cantRue').parentNode
            ];

            // Obtiene el valor actual y maneja los resultados
            switch (document.getElementById("abm_tipo").value)
            {
                case "aereo":
                    // Muestra los campos
                    campos_aereo.forEach(campo => {
                        campo.classList.remove("hidden");
                    });

                    // Ocuta los campos
                    campos_terrestre.forEach(campo => {
                        campo.classList.add("hidden");
                    });
                    break;

                case "terrestre":
                    // Muestra los campos de Cliente
                    campos_terrestre.forEach(campo => {
                        campo.classList.remove("hidden");
                    });

                    // Ocuta los campos de Empleado
                    campos_aereo.forEach(campo => {
                        campo.classList.add("hidden");
                    });
                    break;
                default:
                    break;
            }
        });
    }
}

export default ABM;