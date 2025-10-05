import * as path from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
export const getTypeOrmConfig = (
  config: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: config.getOrThrow('DB_HOST'),
  port: parseInt(config.getOrThrow('DB_PORT') ?? '5432', 10),
  username: config.getOrThrow('DB_USER'),
  password: config.getOrThrow('DB_PASSWORD'),
  database: config.getOrThrow('DB_NAME'),
  entities: [path.join(__dirname, '../**/*.entity{.ts,.js}')],
  logging: true,
  synchronize: true, // Recommended to control sync via env
});
