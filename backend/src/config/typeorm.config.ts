import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { User } from '../auth/auth.entity';
import { MedicalForm } from '../medical-form/medical-form.entity';
import { BloodTest } from '../blood-test/blood-test.entity';

// Load env variables
config();

const configService = new ConfigService();
const nodeEnv = configService.get('NODE_ENV');

// Configure SSL based on environment
const sslConfig = nodeEnv === 'production' 
  ? { ssl: { rejectUnauthorized: false } } 
  : {};

export default new DataSource({
  type: 'postgres',
  url: configService.get('DATABASE_URL'),
  ...sslConfig,
  entities: [User, MedicalForm, BloodTest],
  migrations: [__dirname + '/../migrations/*.{ts,js}'],
  migrationsTableName: 'migrations',
  logging: true,
  schema: 'public',
});