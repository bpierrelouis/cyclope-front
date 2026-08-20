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
        const altitude = this.data.aircraft?.altitude;
        if (!altitude) return null;
        return [altitude.valeur, altitude.unite].filter((value) => value != null).join(' ');
    }

    get altitudeValue() {
        return this.data.aircraft?.altitude?.valeur ?? null;
    }

    get seconds() {
        return Number.isFinite(this.data.timestampSeconds)
            ? this.data.timestampSeconds
            : parseTimecode(this.data.timestamp);
    }

    get speedLabel() {
        const speed = this.data.aircraft?.vitesse;
        if (!speed) return null;
        return [speed.valeur, speed.unite].filter((value) => value != null).join(' ');
    }

    get speedValue() {
        return this.data.aircraft?.vitesse?.valeur ?? null;
    }

    get objects() {
        return this.data.objects ?? [];
    }

    get coordinates() {
        const latitude = this.data.aircraft?.coord?.latitude?.valeur;
        const longitude = this.data.aircraft?.coord?.longitude?.valeur;
        return Number.isFinite(latitude) && Number.isFinite(longitude)
            ? { latitude, longitude }
            : null;
    }

    get target() {
        const latitude = this.data.target?.coord?.latitude?.valeur;
        const longitude = this.data.target?.coord?.longitude?.valeur;
        return Number.isFinite(latitude) && Number.isFinite(longitude)
            ? { latitude, longitude }
            : null;
    }

    get isFreezing() {
        return this.data.metaData?.isFreezing ?? false;
    }
}
