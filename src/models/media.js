export class Media {
    constructor(data) {
        this.meta = data;
    }

    static mapper(data) {
        return new Media(data);
    }

    get id() {
        return this.meta.id;
    }

    get name() {
        return this.meta.displayName;
    }

    get status() {
        return this.meta.lastTreatmentStatus;
    }

    get infos() {
        return this.meta.parentFile;
    }

    get url() {
        return this.infos.url;
    }

    get isVideo() {
        return Boolean(this.infos.duration);
    }
}
