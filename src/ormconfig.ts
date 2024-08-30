import { ConnectionOptions } from 'typeorm';

const config: ConnectionOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5433,
    username: 'nestuser',
    password: '123456',
    database: 'nestjsdb',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
}

export default config;