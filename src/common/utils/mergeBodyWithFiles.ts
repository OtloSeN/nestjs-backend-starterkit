/* eslint-disable no-param-reassign */
import objectPath from 'object-path';

export default function mergeBodyWithFiles(body, files: Express.Multer.File[] = []) {
    files.forEach(file => {
        const filePath = file.fieldname.replace(/\]\[/g, '.').replace(/[[,\]]/g, '.').replace(/\.$/g, '');

        objectPath.set(body, filePath, file);
    });

    return removeObjectNullPrototype(body);
}

// Hack to remove [Object: null prototype] from nested objects
function removeObjectNullPrototype(object) {
    if (object === null || typeof object !== 'object' || Buffer.isBuffer(object)) return object;

    if (Array.isArray(object)) {
        return object.map(removeObjectNullPrototype);
    }

    for (const key in object) {
        if (typeof object[key] === 'object') {
            object[key] = removeObjectNullPrototype(object[key]);
        }
    }

    return { ...object };
}
