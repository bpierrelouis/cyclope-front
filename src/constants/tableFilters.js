export const TABLE_FILTER_TYPES = Object.freeze({
    NUMBER: Object.freeze({
        EQUALS: 'equals',
        GREATER_THAN: 'greaterThan',
        IN_RANGE: 'inRange',
        LESS_THAN: 'lessThan',
    }),
    TEXT: Object.freeze({
        CONTAINS: 'contains',
    }),
});

export const NUMBER_FILTER_OPTIONS = Object.freeze([
    TABLE_FILTER_TYPES.NUMBER.EQUALS,
    TABLE_FILTER_TYPES.NUMBER.GREATER_THAN,
    TABLE_FILTER_TYPES.NUMBER.LESS_THAN,
    TABLE_FILTER_TYPES.NUMBER.IN_RANGE,
]);

export const TEXT_FILTER_OPTIONS = Object.freeze([
    TABLE_FILTER_TYPES.TEXT.CONTAINS,
]);
