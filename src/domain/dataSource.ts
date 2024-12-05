import path           from 'path';
import { DataSource } from 'typeorm';
import appConfig      from 'configs/appConfig';
import User           from '@domainModels/User';
import Admin          from '@domainModels/Admin';
import SystemAction   from '@domainModels/SystemAction';
import Role           from '@domainModels/Role';

const dataSource = new DataSource({
    type                      : appConfig.db.dialect,
    host                      : appConfig.db.host,
    port                      : appConfig.db.port,
    username                  : appConfig.db.username,
    password                  : appConfig.db.password,
    database                  : appConfig.db.database,
    logging                   : false,
    migrationsTransactionMode : 'each',
    migrations                : [
        path.join(__dirname, 'migrations/*.{ts,js}')
    ],
    connectTimeout : 10000,
    entities       : [
        User,
        Admin,
        SystemAction,
        Role
    ],
    logger : 'advanced-console'
});

export default dataSource;
