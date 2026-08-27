import { MEASUREMENT_PATTERN } from '../constants';

export const parseMeasurement = (raw, validate = () => true) => {
    if (typeof raw !== 'string') return null;
    const match = MEASUREMENT_PATTERN.exec(raw);
    if (!match) return null;

    const value = Number(match[1].replace(',', '.'));
    const unit = match[2];
    return Number.isFinite(value) && validate(value) && unit
        ? { unit, value }
        : null;
};
