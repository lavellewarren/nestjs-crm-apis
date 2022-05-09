const options = {
  type: 'postgres',
  host: process.env.TYPEORM_HOST,
  port: parseInt(process.env.TYPEORM_PORT, 10) || 5432,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  logging: ['query', 'error'],
  logger: 'advanced-console',
  entities: ['src/**/*.entity.ts'],
  options: {
    encrypt: false,
    enableArithAbort: false,
  },
  synchronize: false,
};

module.exports = [
  {
    name: 'default',
    migrations: ['scripts/migrations/*.ts'],
    cli: {
      migrationsDir: 'scripts/migrations',
    },
    ...options,
  },
];
