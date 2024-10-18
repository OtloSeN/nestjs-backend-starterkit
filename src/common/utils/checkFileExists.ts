import fs from 'fs/promises';

export default function checkFileExists(path) {
    // eslint-disable-next-line more/no-then
    return fs.access(path, fs.constants.F_OK)
        .then(() => true)
        .catch(() => false);
}
