import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PatientsModule } from './patients/patients.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/patients-db', {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }),
    PatientsModule,
  ],
})
export class AppModule {}
