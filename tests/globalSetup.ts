import fs           from 'node:fs/promises';
import { TEMP_DIR } from '../src/common/constants';

export default async function globalSetup() {
    await fs.mkdir(TEMP_DIR, { recursive: true });
}

