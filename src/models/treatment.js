export class Treatment {
    constructor(data) {
        this.meta = data;
    }

    static mapper(data) {
        return new Treatment(data);
    }
}
