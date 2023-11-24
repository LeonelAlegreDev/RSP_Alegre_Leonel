import  Vehiculo  from "./Vehiculo.js";

class Aereo extends Vehiculo {
    constructor(id, modelo, anoFab, velMax, altMax, autonomia)
    {
        super(id, modelo, anoFab, velMax);
        this.altMax = altMax;
        this.autonomia = autonomia;
    }

    getToString() {
        return `${super.getToString()} - ${this.altMax} - ${this.autonomia}`;
    }
}

export default Aereo;
