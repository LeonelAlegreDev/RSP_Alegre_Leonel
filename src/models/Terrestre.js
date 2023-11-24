import  Vehiculo  from "./Vehiculo.js";

class Terrestre extends Vehiculo {
    constructor(id, modelo, anoFab, velMax, cantPue, cantRue)
    {
        super(id, modelo, anoFab, velMax);
        this.cantPue = cantPue;
        this.cantRue = cantRue;
    }

    getToString() {
        return `${super.getToString()} - ${this.cantPue} - ${this.cantRue}`;
    }
}

export default Terrestre;
