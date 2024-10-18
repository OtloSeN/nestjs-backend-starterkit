import fs            from 'fs';
import path          from 'path';
import { faker }     from '@faker-js/faker';
import { IS3Client } from '../interfaces/IS3Client';


export default class S3TestProvider implements IS3Client {
    putObject() {}

    deleteObject() {}

    getObject() {
        return {
            Body : fs.createReadStream(path.resolve('./tests/fixtures/audio.mp3'))
        };
    }

    async getSignedObjectUrl(): Promise<string> {
        return faker.internet.url();
    }
}
