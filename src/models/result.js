export class Result {
    constructor(data) {
        this.meta = data;
    }

    static mapper(data) {
        return new Result(data);
    }

    get id() {
        return this.meta.id;
    }

    get data() {
        return this.meta.responseJson;
    }

    get allCoordinates() {
        return this.data.coordinates;
    }

    get coordinates() {
        const { longitude, latitude } = this.allCoordinates[0];
        return { longitude, latitude };
    }
}
