import { parseTimecode } from '../utils';

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

    get treatmentId() {
        return this.meta.treatmentId;
    }

    get url() {
        return this.meta.url;
    }

    get index() {
        return this.meta.index;
    }

    get data() {
        return this.meta.responseJson ?? {};
    }

    get isFavorite() {
        return !!this.meta.isFavorite;
    }

    get altitudeLabel() {
        const altitude = this.data.altitude;
        if (!altitude) return null;
        return `${altitude.value} ${altitude.unit}`;
    }

    get seconds() {
        return parseTimecode(this.data.timestamp);
    }

    get speedLabel() {
        const speed = this.data.speed;
        if (!speed) return null;
        return `${speed.value} ${speed.unit}`;
    }


    get objects() {
        return this.data.objects ?? [];
    }

    get coordinates() {
        const { latitude, longitude } = this.data.acft ?? {};
        return Number.isFinite(latitude) && Number.isFinite(longitude)
            ? { latitude, longitude }
            : null;
    }

    get target() {
        const { latitude, longitude } = this.data.tgt ?? {};
        return Number.isFinite(latitude) && Number.isFinite(longitude)
            ? { latitude, longitude }
            : null;
    }

    get isFreezing() {
        return this.data.isFreezing ?? false;
    }
}
