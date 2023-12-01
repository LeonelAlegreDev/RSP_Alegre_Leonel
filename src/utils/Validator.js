class Validator
{
    static ValidarCamposPorTipo(tipo) {
        // Valida los campos comunes
        let campos_comunes = this.ValidarCamposComunes();

        // Verifica que los campos hayan sido completados segun su tipo
        switch (tipo) {
            case "aereo":
                let campos_aereo = this.ValidarCamposAereo();

                    if( campos_comunes && campos_aereo){
                        return true;
                    }
                    else return false;
                break;

            case "terrestre":
                let campos_terrestre = this.ValidarCamposTerrestre();

                if(campos_comunes && campos_terrestre){
                    return true;
                }
                else return false;
                break;
        }

        return result;
    }

    static ValidarCamposComunes(){
        // Objeto con referencia a los inputs
        const campos_comunes = {
            modelo: document.getElementById('abm_modelo'),
            anoFab: document.getElementById('abm_anoFab'),
            velMax: document.getElementById('abm_velMax'),
        };

        // Objeto con los resultados de las validaciones
        let results_campos_comunes = {
            modelo: false,
            anoFab: false,
            velMax: false
        };

        // Valida los campos y guarda los resultados de las validaciones
        results_campos_comunes.modelo = this.ValidarString(campos_comunes.modelo.value);
        results_campos_comunes.anoFab = this.ValidarAnoFab(campos_comunes.anoFab.value);
        results_campos_comunes.velMax = this.ValidarNumMayorA0(campos_comunes.velMax.value);

        // Transforma los Objetos en Arrays para ser iterados
        let keys = Object.keys(results_campos_comunes);
        let valores = Object.values(results_campos_comunes);
        let result = true;

        // Itera los resultados de las validaciones
        for (let i = 0; i < keys.length; i++) 
        {
            // Comprueba el resultado de la validacion
            if(valores[i] == true){
                // Oculta el mensaje de error
                campos_comunes[keys[i]].nextElementSibling.classList.add("hidden");
            }
            else{
                // Muestra el mensaje de error
                campos_comunes[keys[i]].nextElementSibling.classList.remove("hidden");
                result = false;
            }
        }
        return result;
    }

    static ValidarCamposAereo(){
        // Objeto con referencia a los inputs
        const campos_aereo = {
            altMax: document.getElementById('abm_altMax'),
            autonomia: document.getElementById('abm_autonomia')
        };
        
        // Objeto con los resultados de las validaciones
        let results_campos_aereo = {
            altMax: false,
            autonomia: false
        };

        // Valida los campos y guarda los resultados de las validaciones
        results_campos_aereo.altMax = this.ValidarNumMayorA0(campos_aereo.altMax.value);
        results_campos_aereo.autonomia = this.ValidarNumMayorA0(campos_aereo.autonomia.value);

        // Transforma los Objetos en Arrays para ser iterados
        let keys = Object.keys(results_campos_aereo);
        let valores = Object.values(results_campos_aereo);
        let result = true;

        // Itera los resultados de las validaciones
        for (let i = 0; i < keys.length; i++) 
        {
            // Comprueba el resultado de la validacion
            if(valores[i] == true){
                // Oculta el mensaje de error
                campos_aereo[keys[i]].nextElementSibling.classList.add("hidden");
            }
            else{
                // Muestra el mensaje de error
                campos_aereo[keys[i]].nextElementSibling.classList.remove("hidden");
                result = false;
            }
        }
        return result;
    }

    static ValidarCamposTerrestre(){
        // Objeto con referencia a los inputs
        const campos_terrestre = {
            cantPue: document.getElementById('abm_cantPue'),
            cantRue: document.getElementById('abm_cantRue')
        };
        
        // Objeto con los resultados de las validaciones
        let results_campos_terrestre = {
            cantPue: false,
            cantRue: false
        };

        // Valida los campos y guarda los resultados de las validaciones
        results_campos_terrestre.cantPue = this.ValidarCantPue(campos_terrestre.cantPue.value);
        results_campos_terrestre.cantRue = this.ValidarNumMayorA0(campos_terrestre.cantRue.value);;

        // Transforma los Objetos en Arrays para ser iterados
        let keys = Object.keys(results_campos_terrestre);
        let valores = Object.values(results_campos_terrestre);
        let result = true;

        // Itera los resultados de las validaciones
        for (let i = 0; i < keys.length; i++) 
        {
            // Comprueba el resultado de la validacion
            if(valores[i] == true){
                // Oculta el mensaje de error
                campos_terrestre[keys[i]].nextElementSibling.classList.add("hidden");
            }
            else{
                // Muestra el mensaje de error
                campos_terrestre[keys[i]].nextElementSibling.classList.remove("hidden");
                result = false;
            }
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
export default Validator;