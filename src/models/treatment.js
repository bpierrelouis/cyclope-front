export class Treatment {
    constructor(data) {
        this.meta = data;
    }

    static mapper(data) {
        return new Treatment(data);
    }

    get id() {
        return this.meta.id;
    }

    get creationDate() {
        return this.meta.creationDate;
    }

    get mediaId() {
        return this.meta.mediaId;
    }

    get status() {
        return this.meta.status;
    }

    get config() {
        return this.meta.config;
    }
}
