class Vehiculo {
    constructor(id, modelo, anoFab, velMax) {
        this.id = id;
        this.modelo = modelo;
        this.anoFab = anoFab;
        this.velMax = velMax;
    }

    getToString() {
        return `${this.id} - ${this.modelo} ${this.anoFab} ${this.velMax}`;
    }

    getToJson() {
        return JSON.stringify({
            id: this.id,
            modelo: this.modelo,
            anoFab: this.anoFab,
            velMax: this.velMax,
        });
    }
}

export default Vehiculo;