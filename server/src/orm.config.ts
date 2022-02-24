import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const commonConf = {
  SYNCRONIZE: false,
  ENTITIES: [__dirname + '/domain/*.entity{.ts,.js}'],
  MIGRATIONS: [__dirname + '/migrations/**/*{.ts,.js}'],
  CLI: {
    migrationsDir: 'src/migrations'
  },
  MIGRATIONS_RUN: true
};

let ormconfig: TypeOrmModuleOptions = {
  name: 'default',
  type: 'postgres',
  host: 'localhost',
  port: 35432,
  username: 'root',
  password: 'root',
  database: 'todos',
  logging: true,
  synchronize: true,
  entities: commonConf.ENTITIES,
  migrations: commonConf.MIGRATIONS,
  cli: commonConf.CLI,
  migrationsRun: commonConf.MIGRATIONS_RUN
};

if (process.env.NODE_ENV === 'prod') {
  ormconfig = {
    name: 'default',
    type: 'postgres',
    url: process.env.DATABASE_URL,
    logging: true,
    synchronize: true,
    entities: commonConf.ENTITIES,
    migrations: commonConf.MIGRATIONS,
    cli: commonConf.CLI,
    migrationsRun: commonConf.MIGRATIONS_RUN
  };
}

if (process.env.NODE_ENV === 'test') {
  ormconfig = {
    name: 'default',
    type: 'sqlite',
    database: ':memory:',
    logging: true,
    synchronize: true,
    entities: commonConf.ENTITIES,
    migrations: commonConf.MIGRATIONS,
    cli: commonConf.CLI,
    migrationsRun: commonConf.MIGRATIONS_RUN
  };
}

export { ormconfig };
