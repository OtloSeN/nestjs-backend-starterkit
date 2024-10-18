import crypto          from 'crypto';
import { extname }     from 'path';
import fs              from 'fs';
import { diskStorage } from 'multer';
import { TEMP_DIR }    from '@common/constants';

function generateFilename(file) {
    return `${crypto.randomUUID()}${extname(file.originalname)}`;
}

const storage = diskStorage({
    destination : (req, file, cb) => {
        fs.mkdirSync(TEMP_DIR, { recursive: true });

        cb(null, TEMP_DIR);
    },


    filename : (req, file, callback) => {
        callback(null, generateFilename(file));
    }
});

export default storage;
