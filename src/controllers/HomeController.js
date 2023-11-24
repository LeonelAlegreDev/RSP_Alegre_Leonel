import Terrestre from "../models/Terrestre.js";
import Loader from "../utils/Loader.js";
import Aereo from "../models/Aereo.js";

class HomeController
{
    static async GetVehiculosFetch(){
        const response = await fetch('http://localhost/Lab3-RSP/vehiculoAereoTerrestre.php', {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer'
        });
        const result = await response.json();
        return result;
    }

    static PostVehiculoXML(vehiculo, callback){
        var xhttp = new XMLHttpRequest(); //Instancio el objeto
        xhttp.onreadystatechange = function() {
            //Acción a ejecutar cuando el readyState=4 (respuesta lista)
            if (xhttp.readyState == 4) {
                if (xhttp.status == 200) {
                    let res = {
                        status: xhttp.status,
                        message: xhttp.response
                    }
                    callback(res);
                } else {
                    let error = {
                        status: xhttp.status,
                        error: xhttp.statusText,
                        message: xhttp.response
                    };
                    callback(error);
                }
            }
        }; //Configúro manejador para cambio de estado
        xhttp.open("POST", "http://localhost/Lab3-RSP/vehiculoAereoTerrestre.php", true); //Inicializo la solicitud

        // AVERIGUAR COMO USAR POST
        xhttp.send(JSON.stringify(vehiculo)); //Envio la solicitud
    }

    static async PutVehiculoFetch(vehiculo){
        const response = await fetch('http://localhost/Lab3-RSP/vehiculoAereoTerrestre.php', {
            method: 'PUT', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(vehiculo)
        });
        const result = await response.json();
        const estado = response.status;
        let res;

        if (estado === 200) {
            res = {
                status: estado,
                message: result
            }

        } else {
            res = {
                status: estado,
                error: resonse.statusText,
                message: result
            };
        }
        return res;
    }

    // Parsea un array json a Vehiculos
    static ParsearDatos(datos) 
    {
        const vehiculos = datos.map((vehiculo) => {
            const esAereo = vehiculo.id && vehiculo.modelo && vehiculo.anoFab &&
                            vehiculo.velMax && vehiculo.altMax && vehiculo.autonomia;
            const esTerrestre = vehiculo.id && vehiculo.modelo && vehiculo.anoFab && 
                                vehiculo.velMax && vehiculo.cantPue >= 0 && vehiculo.cantRue;

            // Comprueba el tipo de Vehiculo
            if (esAereo) {
                return new Aereo(
                    vehiculo.id,
                    vehiculo.modelo,
                    vehiculo.anoFab,
                    vehiculo.velMax,
                    vehiculo.altMax,
                    vehiculo.autonomia
                );
            }
            else if(esTerrestre){
                return new Terrestre(
                    vehiculo.id,
                    vehiculo.modelo,
                    vehiculo.anoFab,
                    vehiculo.velMax,
                    vehiculo.cantPue,
                    vehiculo.cantRue
                );
            }
        });
        return vehiculos;
    }

    static CargarTabla(vehiculos){
        const tablaPersonas = document.getElementById('table_lista');
        const tbody = tablaPersonas.querySelector("tbody");
        let registros = [];
        let registro;

        tbody.innerHTML = "";

        vehiculos.forEach(vehiculo => {
            switch (vehiculo.constructor.name) {
                case 'Aereo':
                    registro = {
                        id: vehiculo.id,
                        modelo: vehiculo.modelo,
                        anoFab: vehiculo.anoFab,
                        velMax: vehiculo.velMax,
                        altMax: vehiculo.altMax,
                        autonomia: vehiculo.autonomia,
                        cantPue: "N/A",
                        cantRue: "N/A"
                    }
                    registros.push(registro);
                    break;

                case 'Terrestre':
                    registro = {
                        id: vehiculo.id,
                        modelo: vehiculo.modelo,
                        anoFab: vehiculo.anoFab,
                        velMax: vehiculo.velMax,
                        altMax: "N/A",
                        autonomia: "N/A",
                        cantPue: vehiculo.cantPue,
                        cantRue: vehiculo.cantRue
                    }
                    registros.push(registro);
                    break;
            }
        });

        registros.forEach(element => {
            let tr = document.createElement("tr");
            tbody.appendChild(tr);

            for (var propiedad in element) {
                if (element.hasOwnProperty(propiedad)) {
                    let td = document.createElement("td");
                    tr.appendChild(td);
                    tr.setAttribute("data-id", element.id);


                    td.appendChild(document.createTextNode(element[propiedad]));

                    if(propiedad !== "id"){
                        td.setAttribute("contentEditable", "false");
                    }
                }
            }
            let td_modificar = document.createElement("td");
            tr.appendChild(td_modificar);

            let button_modificar = document.createElement("button");
            td_modificar.appendChild(button_modificar);

            button_modificar.appendChild(document.createTextNode("Modificar"))
            button_modificar.classList.add('btn');
            button_modificar.classList.add('btn-secondary');

            let button_confirmar = document.createElement("button");            
            button_confirmar.classList.add('btn');
            button_confirmar.classList.add('btn-success');
            button_confirmar.classList.add("hidden");
            button_confirmar.style.margin = "0 4px 0 0"; 
            td_modificar.appendChild(button_confirmar);

            let icon = document.createElement("i");
            icon.classList.add("bi-pencil-fill");
            button_confirmar.appendChild(icon);

            let button_cancelar = document.createElement("button");            
            button_cancelar.classList.add('btn');
            button_cancelar.classList.add('btn-danger');
            button_cancelar.classList.add("hidden");
            td_modificar.appendChild(button_cancelar);

            let icon_cancelar = document.createElement("i");
            icon_cancelar.classList.add("bi-x");
            button_cancelar.appendChild(icon_cancelar);

            let td_eliminar = document.createElement("td");
            tr.appendChild(td_eliminar);

            let button_eliminar = document.createElement("button");
            td_eliminar.appendChild(button_eliminar);

            button_eliminar.appendChild(document.createTextNode("Eliminar"))
            button_eliminar.classList.add('btn');
            button_eliminar.classList.add('btn-danger');
        });
    }

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
            const result = this.ValidarCamposPorTipo(tipo)

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

            // Valida que se hayan marado los campos
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
                this.PostVehiculoXML(vehiculo, (res) => {
                    const modal_status = document.getElementById("modal_status");
                    const modal_error = document.getElementById("modal_error");
                    const tr_error = modal_error.closest("tr");
                    const modal_mensaje = document.getElementById("modal_mensaje");

                    if(res.status == 200){
                        // establece los mensajes
                        modal_status.textContent = res.status;
                        modal_mensaje.textContent = res.message;
                        tr_error.classList.add("hidden");

                        // previene id duplicado
                        vehiculos.forEach(element => {
                            if(element.id == vehiculo.id){
                                vehiculo.id++;
                            }
                        });

                        // Agrega el vehiculo al array de vehiculos
                        vehiculos.push(vehiculo);

                        // Carga la tabla con el erray actualizado
                        this.CargarTabla(vehiculos);

                        this.HandleTable();
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

    // Maneja las acciones del Modal
    static HandleModal(){
        const modal = document.getElementById('staticBackdrop');

        // Oculta el ABM y Muestra la tabla al cerrar el modal
        modal.addEventListener('hide.bs.modal', event => {
            document.getElementById("abm_container").style.display = "none";
            document.getElementById("form_container").style.display = "flex";;

            const requireFields = document.getElementById('form_abm').querySelectorAll('[required]');
            
            // Oculta los mensajes de error
            for (const campo of requireFields) {
                campo.nextElementSibling.classList.add("hidden");
            }
        });
    }

    static HandleTable(vehiculos){
        let table = document.getElementById("table_lista");
        const botones_modificar = table.getElementsByClassName("btn-secondary");
        
        // Maneja los eventos del boton moidifcar
        for(const boton of botones_modificar) {
            boton.addEventListener("click", () => {
                const tr = boton.closest('tr');
                const td_list = tr.querySelectorAll("td");
                let td = boton.parentElement;
                let btns = td.getElementsByClassName("btn-success");
                let btnd = td.getElementsByClassName("btn-danger");

                // Muestra el contenido editable
                for(let i = 1; i < 8; i++){
                    td_list[i].setAttribute("contentEditable", "true")
                }
                boton.classList.add("hidden");
                
                for (const element of btns) {
                    element.addEventListener("click", async () =>{
                        const modal = document.getElementById('staticBackdrop');
                        const loader_text = document.getElementById("loader_text");
                        const instance = new bootstrap.Modal(modal);

                        Loader.Show("modal_loader");
                        loader_text.classList.remove("hidden");
                        instance.show();

                        let v = null;
                        vehiculos.forEach(vehiculo => {
                            if(vehiculo.id == tr.getAttribute("data-id")){
                                v = vehiculo;
                            }
                        });

                        let camposComunes = false;
                        if(this.ValidarString(td_list[1].innerText) && 
                           this.ValidarAnoFab(td_list[2].innerText) &&
                           this.ValidarNumMayorA0(td_list[3].innerText)){
                            camposComunes = true;
                        }
                        

                        if(v instanceof Aereo){
                            if(this.ValidarNumMayorA0(td_list[4].innerText) && 
                               this.ValidarNumMayorA0(td_list[5].innerText) &&
                               camposComunes)
                            {
                                v.modelo = td_list[1].innerText;
                                v.anoFab = td_list[2].innerText;
                                v.velMax = td_list[3].innerText;
                                v.altMax = td_list[4].innerText;
                                v.autonomia = td_list[5].innerText;
                            }
                        }
                        else{
                            if(this.ValidarCantPue(td_list[6].innerText) && 
                               this.ValidarNumMayorA0(td_list[7].innerText) &&
                               camposComunes){

                            }
                            v.modelo = td_list[1].innerText;
                            v.anoFab = td_list[2].innerText;
                            v.velMax = td_list[3].innerText;
                            v.cantPue = td_list[6].innerText;
                            v.cantRue = td_list[7].innerText;
                        }

                        let res = await this.PutVehiculoFetch(v);
                        const modal_status = document.getElementById("modal_status");
                        const modal_error = document.getElementById("modal_error");
                        const tr_error = modal_error.closest("tr");
                        const modal_mensaje = document.getElementById("modal_mensaje");
    
                        modal_status.textContent = res.status;

                        if(res.status === 200){
                            modal_mensaje.textContent = res.message.id;
                            tr_error.classList.add("hidden");
                            loader_text.classList.add("hidden");
                            table_response.classList.remove("hidden");

                            Loader.Hide("modal_loader");
                        }
                        else{
                            modal_mensaje.textContent = res.message,
                            tr_error.classList.remove("hidden");
                            loader_text.classList.add("hidden");
                            table_response.classList.remove("hidden");
                        }

                    });
                    element.classList.remove("hidden");
                }
                for (const element of btnd) {
                    element.addEventListener("click", () =>{
                        console.log("cancelar datos");
                    });
                    element.classList.remove("hidden");
                }
            });
        };
    }

    static ValidarCamposPorTipo(tipo) {
        // Booleano que define si se han compleatado todos los campos
        let result = false;

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

        // Valida
        const validacionModelo = this.ValidarString(campos_comunes.modelo.value);
        const validacionAno = this.ValidarAnoFab(campos_comunes.anoFab.value);
        const validacionVel = this.ValidarNumMayorA0(campos_comunes.velMax.value);
        
        // Si la validacion da false se muestra mensaje de error
        if(validacionModelo){
            // Oculta el mensaje de error
            campos_comunes.modelo.nextElementSibling.classList.add("hidden");
            result = true;
        }
        else{
            campos_comunes.modelo.nextElementSibling.classList.remove("hidden");
            result = false;
        }
        if(validacionAno){
            // Oculta el mensaje de error
            campos_comunes.anoFab.nextElementSibling.classList.add("hidden");
            result = true;
        }
        else{
            campos_comunes.anoFab.nextElementSibling.classList.remove("hidden");
            result = false;
        }

        if(validacionVel){
            // Oculta el mensaje de error
            campos_comunes.velMax.nextElementSibling.classList.add("hidden");
            result = true;
        }
        else{
            campos_comunes.velMax.nextElementSibling.classList.remove("hidden");
            result = false;
        }
        
        // Verifica que los campos hayan sido completados segun su tipo
        switch (tipo) {
            case "aereo":
                const validacionAlt = this.ValidarNumMayorA0(campos_aereo.altMax.value);
                const validacionAut= this.ValidarNumMayorA0(campos_aereo.autonomia.value);

                // Si la validacion da false se muestra mensaje de error
                if(validacionAlt){
                    // Oculta el mensaje de error
                    campos_aereo.altMax.nextElementSibling.classList.add("hidden");
                    result = true;
                }
                else{
                    campos_aereo.altMax.nextElementSibling.classList.remove("hidden");
                    result = false;
                }
                if(validacionAut){
                    // Oculta el mensaje de error
                    campos_aereo.autonomia.nextElementSibling.classList.add("hidden");
                    result = true;
                }
                else{
                    campos_aereo.autonomia.nextElementSibling.classList.remove("hidden");
                    result = false;
                }
                break;

            case "terrestre":
                const validacionPue = this.ValidarCantPue(campos_aereo.altMax.value);
                const validacionRue = this.ValidarNumMayorA0(campos_terrestre.cantRue.value);
                
                // Si la validacion da false se muestra mensaje de error
                if(validacionPue){
                    // Oculta el mensaje de error
                    campos_terrestre.cantPue.nextElementSibling.classList.add("hidden");
                    result = true;
                }
                else{
                    campos_terrestre.cantPue.nextElementSibling.classList.remove("hidden");
                    result = false;
                }
                if(validacionRue){
                    // Oculta el mensaje de error
                    campos_terrestre.cantRue.nextElementSibling.classList.add("hidden");
                    result = true;
                }
                else{
                    campos_terrestre.cantRue.nextElementSibling.classList.remove("hidden");
                    result = false;
                }
                break;
                
                default:
                result = false;
                break;
        }

        return result;
    }

    static ValidarAnoFab(anoFab){
        if(!isNaN(anoFab) && parseInt(anoFab) > 1885){
            return true;
        }
        return false;
    }

    static ValidarNumMayorA0(vel){
        if(!isNaN(vel) && parseInt(vel) > 0){
            return true;
        }
        return false;
    }

    static ValidarCantPue(cantPue){
        if(!isNaN(cantPue) && parseInt(cantPue) > -1){
            return true;
        }
        return false;
    }

    static ValidarString(string){
        if(string !== null && string !== undefined &&  string.length > 0){
            return true;
        }
        return false;
    }
}

export default HomeController;