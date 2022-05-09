import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigModule } from '@nestjs/config';


ConfigModule.forRoot();

const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.TYPEORM_HOST || 'localhost',
  port: parseInt(process.env.TYPEORM_PORT, 10) || 5432,
  username: process.env.TYPEORM_USERNAME || 'postgres',
  password: process.env.TYPEORM_PASSWORD || 'postgres',
  database: process.env.TYPEORM_DATABASE || 'postgresDB',
  entities: [__dirname + '/**/*.entity.ts', __dirname + '/**/*.entity.js'],
  migrationsRun: false,
  name: 'default',
  logging: true,
  migrationsTableName: "migration",
  migrations: [__dirname + '/migration/**/*.ts', __dirname + '/migration/**/*.js'],
  synchronize: false,
  cli: {
    migrationsDir: 'src/migration'
  }
}

export = typeOrmConfig