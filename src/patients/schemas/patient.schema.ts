import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum Gender {
  MASCULINO = 'masculino',
  FEMENINO = 'femenino',
  OTRO = 'otro',
}

@Schema({ _id: false })
export class EmergencyContact {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  relationship: string;

  @Prop({ required: true, length: 10 })
  phone: string;
}

export const EmergencyContactSchema = SchemaFactory.createForClass(EmergencyContact);

@Schema({ _id: false })
export class InsurancePolicy {
  @Prop({ required: true })
  provider: string;

  @Prop({ required: true })
  policyNumber: string;

  @Prop({ required: true })
  endDate: Date;
}

export const InsurancePolicySchema = SchemaFactory.createForClass(InsurancePolicy);

@Schema({ timestamps: true })
export class Patient extends Document {
  @Prop({ required: true, unique: true })
  patientNumber: string;

  @Prop({ sparse: true, unique: true })
  nationalId?: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  dateOfBirth: Date;

  @Prop({ required: true, enum: Gender })
  gender: Gender;

  @Prop({ required: true, length: 10 })
  phone: string;

  @Prop()
  email?: string;

  @Prop({ type: EmergencyContactSchema })
  emergencyContact?: EmergencyContact;

  @Prop({ type: InsurancePolicySchema })
  insurancePolicy?: InsurancePolicy;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
