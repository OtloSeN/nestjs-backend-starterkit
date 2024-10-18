import { DateTime } from 'luxon';

export const nullable = (value) => {
    if ([ null, 'null' ].includes(value)) return null;

    return value;
};

export const timeFormat = (value, helpers) => {
    const time = DateTime.fromFormat(value, 'HH:mm:ss');

    if (!time.isValid) {
        return helpers.error('date.timeFormat');
    }

    return value;
};
