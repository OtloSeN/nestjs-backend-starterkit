import fs           from 'node:fs/promises';
import path         from 'node:path';
import { TEMP_DIR } from '../src/common/constants';

export default async function globalTeardown() {
    await clearDir(TEMP_DIR);
}

async function clearDir(dirPath) {
    const paths = await fs.readdir(dirPath);

    for (const pathTo of paths) {
        const stat = await fs.stat(path.join(dirPath, pathTo));

        if (stat.isFile()) {
            await fs.unlink(path.join(dirPath, pathTo));
        } else if (stat.isDirectory()) {
            await clearDir(path.join(dirPath, pathTo));
        }
    }

    await fs.rmdir(dirPath);
}
