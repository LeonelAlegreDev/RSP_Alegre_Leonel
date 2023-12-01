import Validator from "../utils/Validator.js";
import HomeController from "../controllers/HomeController.js";
import Loader from "./Loader.js";
import Aereo from "../models/Aereo.js";
import Terrestre from "../models/Terrestre.js";
class Table
{
    static HandleTable(vehiculos){
        let table = document.getElementById("table_lista");
        const botones_modificar = table.getElementsByClassName("btn-secondary");
        const botones_eliminar = table.getElementsByClassName("table_eliminar");

        // Maneja los eventos del boton modifcar
        for(const boton of botones_modificar) {
            boton.addEventListener("click", () => {
                const tr = boton.closest('tr');
                const td_list = tr.querySelectorAll("td");
                let td = boton.parentElement;
                let btns = td.getElementsByClassName("btn-success");
                let btnd = td.getElementsByClassName("btn-danger");

                // Referencia a los valores originales antes de la edicion
                const valoresOriginales = [];

                // Muestra el contenido editable
                for(let i = 1; i < 8; i++){
                    valoresOriginales.push(td_list[i].innerText);
                    td_list[i].setAttribute("contentEditable", "true");
                }
                boton.classList.add("hidden");

                // Maneja los eventos click del los botones confirmar
                for (const element of btns) {
                    element.addEventListener("click", async () =>{
                        const modal = document.getElementById('staticBackdrop');
                        const loader_text = document.getElementById("loader_text");
                        const instance = new bootstrap.Modal(modal);

                        // Muestra el Modal del resultado
                        Loader.Show("modal_loader");
                        loader_text.classList.remove("hidden");                            
                        // table_response.classList.remove("hidden");
                        table_response.classList.add("hidden");
                        instance.show();

                        let v = null;
                        vehiculos.forEach(vehiculo => {
                            if(vehiculo.id == tr.getAttribute("data-id")){
                                v = vehiculo;
                            }
                        });

                        // validar campos comunes
                        let camposComunes = false;
                        const v_modelo = Validator.ValidarString(td_list[1].innerText);
                        const v_ano = Validator.ValidarAnoFab(td_list[2].innerText);
                        const v_vel = Validator.ValidarNumMayorA0(td_list[3].innerText);

                        // valida los campos segund el tip0
                        if(v instanceof Aereo){
                            const v_alt = Validator.ValidarNumMayorA0(td_list[4].innerText);
                            const v_aut = Validator.ValidarNumMayorA0(td_list[5].innerText);
                            if(v_modelo && v_ano && v_vel && v_alt && v_aut)
                            {
                                v.modelo = td_list[1].innerText;
                                v.anoFab = td_list[2].innerText;
                                v.velMax = td_list[3].innerText;
                                v.altMax = td_list[4].innerText;
                                v.autonomia = td_list[5].innerText;
                            }
                            else v = null;
                        }
                        else{
                            const v_pue = Validator.ValidarCantPue(td_list[6].innerText);
                            const v_rue = Validator.ValidarNumMayorA0(td_list[7].innerText);
                            if(v_modelo && v_ano && v_vel && v_pue && v_rue){
                                v.modelo = td_list[1].innerText;
                                v.anoFab = td_list[2].innerText;
                                v.velMax = td_list[3].innerText;
                                v.cantPue = td_list[6].innerText;
                                v.cantRue = td_list[7].innerText;
                            }
                            else v = null;
                        }

                        let res = await HomeController.PutVehiculoFetch(v);
                        const modal_status = document.getElementById("modal_status");
                        const modal_error = document.getElementById("modal_error");
                        const tr_error = modal_error.closest("tr");
                        const modal_mensaje = document.getElementById("modal_mensaje");

                        modal_status.textContent = res.status;
                        if(res.status === 200){
                            modal_mensaje.textContent = "Vehiculo mofidicado con exito.";
                            tr_error.classList.add("hidden");
                            loader_text.classList.add("hidden");
                            table_response.classList.remove("hidden");

                            Loader.Hide("modal_loader");

                            const index = vehiculos.indexOf(v);
                            vehiculos[index] = v;

                            this.CargarTabla(vehiculos);
                            this.HandleTable(vehiculos);
                        }
                        else{
                            modal_mensaje.textContent = "No se pudo actualizar el registro";
                            modal_error.textContent = res.statusText;
                            tr_error.classList.remove("hidden");
                            loader_text.classList.add("hidden");
                            table_response.classList.remove("hidden");
                            Loader.Hide("modal_loader");
                        }

                    });
                    element.classList.remove("hidden");
                }
                
                // Maneja los eventos click del los botones cancelar
                for (const element of btnd) {
                    element.addEventListener("click", () =>{                        
                        // Oculta los botones de edicion
                        const btn_confirmar = element.previousElementSibling;
                        element.classList.add("hidden");
                        btn_confirmar.classList.add("hidden");

                        // Oculta el contenido editable
                        for(let i = 1; i < 8; i++){
                            td_list[i].setAttribute("contentEditable", "false");
                        }
                        boton.classList.remove("hidden");

                        // Remueve edicion sin aplicar
                        for(let i = 1; i < 8; i++){
                            td_list[i].innerText = valoresOriginales[i-1];
                        }
                    });
                    element.classList.remove("hidden");
                }
            });
        };

        const modal = document.getElementById('modal_confirmation');
        const instance = new bootstrap.Modal(modal);

        // Maneja los eventos del boton eliminar
        for(const boton of botones_eliminar) {
            boton.addEventListener("click", () => {
                const loader_text = document.getElementById("loader_text");
                const buttons = document.getElementById('modal_buttons');
                const tr = boton.closest('tr');
                let id = tr.getAttribute("data-id");
                document.getElementById("modal_delete").setAttribute("data-id", id);

                console.log(id);

                Loader.Hide("modal_loader");
                table_response.classList.add("hidden");
                buttons.classList.remove("hidden");

                instance.show();
            });
        }

        document.getElementById("modal_cancel").addEventListener("click", () => {
            instance.hide();
        });
        document.getElementById("modal_delete").addEventListener("click", async () => {
            const modal2 = document.getElementById('staticBackdrop');
            const instance2 = new bootstrap.Modal(modal2);
            const loader_text = document.getElementById("loader_text");

            instance.hide();
            instance2.show();
            Loader.Show("modal_loader");
            loader_text.classList.remove("hidden");
            
            let v = null;
            vehiculos.forEach(vehiculo => {
                if(vehiculo.id == document.getElementById("modal_delete").getAttribute("data-id")){
                    v = vehiculo;
                }
            });

            let res = await HomeController.DeleteVehiculoFetch(v);
            const modal_status = document.getElementById("modal_status");
            const modal_error = document.getElementById("modal_error");
            const tr_error = modal_error.closest("tr");
            const modal_mensaje = document.getElementById("modal_mensaje");

            modal_status.textContent = res.status;
            if(res.status === 200){
                modal_mensaje.textContent = "Vehiculo eliminado con exito.";
                tr_error.classList.add("hidden");
                loader_text.classList.add("hidden");
                table_response.classList.remove("hidden");

                Loader.Hide("modal_loader");

                const index = vehiculos.indexOf(v);
                vehiculos.splice(index, 1);

                this.CargarTabla(vehiculos);
                this.HandleTable(vehiculos);
            }
            else{
                modal_mensaje.textContent = "No se pudo eliminar el registro.";
                modal_error.textContent = res.statusText;
                tr_error.classList.remove("hidden");
                loader_text.classList.add("hidden");
                table_response.classList.remove("hidden");
                Loader.Hide("modal_loader");
            }
        });
    }

    // Carga la tabla de Vehiculos
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
            button_cancelar.classList.add('table_cancelar');
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
            button_eliminar.classList.add('table_eliminar');

        });
    }
}
export default Table;