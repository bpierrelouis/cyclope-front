import { parseTimecode } from '../utils';

export class Result {
    constructor(data) {
        this.meta = data;
        this.seconds = parseTimecode(data.responseJson.timestamp);
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

    get isFavorite() {
        return !!this.meta.isFavorite;
    }

    get altitudeLabel() {
        const altitude = this.data.altitude;
        if (!altitude) return null;
        return `${altitude.value} ${altitude.unit}`;
    }

    get timecode() {
        return this.data.timestamp?.split('.')[0];
    }

    get speedLabel() {
        const speed = this.data.speed;
        if (!speed) return null;
        return `${speed.value} ${speed.unit}`;
    }


    get objects() {
        return this.data.objects;
    }

    get coordinates() {
        const { longitude, latitude } = this.data.acft;
        return { longitude, latitude };
    }

    get target() {
        const { longitude, latitude } = this.data.tgt;
        return { longitude, latitude };
    }

    get isFreezing() {
        return this.data.isFreezing ?? false;
    }
}
