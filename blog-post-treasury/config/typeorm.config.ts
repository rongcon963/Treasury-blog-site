import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
config();

const configService = new ConfigService();

const dbType = configService.get<string>('DATABASE_TYPE');
        
// Optional: Validate the dbType to ensure it’s a supported TypeORM type
const validTypes = ['mysql', 'postgres', 'sqlite', 'mariadb', 'mssql', 'oracle', 'mongodb'];
if (!validTypes.includes(dbType)) {
  throw new Error(`Invalid DB_TYPE: ${dbType}. Must be one of ${validTypes.join(', ')}`);
}

const AppDataSource = new DataSource({
  type: dbType as 'postgres',
  host: configService.get<string>('DATABASE_HOST'),
  port: parseInt(configService.get<string>('DATABASE_PORT') || '5432'),
  username: configService.get<string>('DATABASE_USERNAME'),
  password: configService.get<string>('DATABASE_PASSWORD'),
  database: configService.get<string>('DATABASE_NAME'),
  synchronize: false,
  entities: ['**/*.entity.ts'],
  migrations: ['./database/migrations/*-migration.ts'],
  migrationsRun: false,
  logging: true,
});

export default AppDataSource;
