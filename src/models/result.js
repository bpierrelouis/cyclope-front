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

    get url() {
        return this.meta.url;
    }

    get index() {
        return this.meta.index;
    }

    get data() {
        return this.meta.responseJson;
    }

    get altitude() {
        return this.data.altitude;
    }

    get timeStamp() {
        return this.data.timestamp;
    }

    get speed() {
        return this.data.speed;
    }

    get allCoordinates() {
        return this.data.coordinates;
    }

    get objects() {
        return this.data.objects;
    }

    get coordinates() {
        const { longitude, latitude } = this.allCoordinates[0];
        return { longitude, latitude };
    }
}
