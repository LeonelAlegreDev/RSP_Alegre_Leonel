import Terrestre from "../models/Terrestre.js";
import Loader from "../components/Loader.js";
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

    static AltaVehiculoXML(vehiculo, callback){
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
        xhttp.open("PUT", "http://localhost/Lab3-RSP/vehiculoAereoTerrestre.php", true); //Inicializo la solicitud

        // AVERIGUAR COMO USAR POST
        xhttp.send(JSON.stringify(vehiculo)); //Envio la solicitud
    }

    static async PutVehiculoFetch(vehiculo){
        const response = await fetch('http://localhost/Lab3-RSP/vehiculoAereoTerrestre.php', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
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
        return await response;
    }

    static async DeleteVehiculoFetch(vehiculo){
        const response = await fetch('http://localhost/Lab3-RSP/vehiculoAereoTerrestre.php', {
            method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
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
        return await response;
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
}

export default HomeController;