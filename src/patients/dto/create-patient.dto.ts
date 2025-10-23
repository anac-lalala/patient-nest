import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsNotEmpty, 
  IsDateString, 
  IsEnum, 
  IsEmail, 
  IsOptional, 
  Length,
  Matches,
  ValidateNested,
  IsObject
} from 'class-validator';
import { Type } from 'class-transformer';
import { Gender } from '../schemas/patient.schema';

export class EmergencyContactDto {
  @ApiProperty({ example: 'María García' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Esposa' })
  @IsString()
  @IsNotEmpty()
  relationship: string;

  @ApiProperty({ example: '5551234567', description: 'Teléfono de 10 dígitos' })
  @IsString()
  @Length(10, 10, { message: 'El teléfono debe tener exactamente 10 dígitos' })
  @Matches(/^\d{10}$/, { message: 'El teléfono debe contener solo números' })
  phone: string;
}

export class InsurancePolicyDto {
  @ApiProperty({ example: 'Seguro Nacional' })
  @IsString()
  @IsNotEmpty()
  provider: string;

  @ApiProperty({ example: 'POL-123456' })
  @IsString()
  @IsNotEmpty()
  policyNumber: string;

  @ApiProperty({ example: '31/12/2025', description: 'Fecha de vencimiento (dd/mm/yyyy)' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2}\/\d{2}\/\d{4}$/, { 
    message: 'endDate debe tener el formato dd/mm/yyyy' 
  })
  endDate: string;
}

export class CreatePatientDto {
  @ApiPropertyOptional({ example: 'CURP123456789' })
  @IsOptional()
  @IsString()
  nationalId?: string;

  @ApiProperty({ example: 'Juan' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Pérez' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: '1990-05-15', description: 'Fecha de nacimiento (ISO 8601)' })
  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: string;

  @ApiProperty({ enum: Gender, example: Gender.MASCULINO })
  @IsEnum(Gender, { message: 'El género debe ser: masculino, femenino u otro' })
  gender: Gender;

  @ApiProperty({ example: '5551234567', description: 'Teléfono de 10 dígitos' })
  @IsString()
  @Length(10, 10, { message: 'El teléfono debe tener exactamente 10 dígitos' })
  @Matches(/^\d{10}$/, { message: 'El teléfono debe contener solo números' })
  phone: string;

  @ApiPropertyOptional({ example: 'juan.perez@example.com' })
  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  email?: string;

  @ApiPropertyOptional({ type: EmergencyContactDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => EmergencyContactDto)
  emergencyContact?: EmergencyContactDto;

  @ApiPropertyOptional({ type: InsurancePolicyDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => InsurancePolicyDto)
  insurancePolicy?: InsurancePolicyDto;
}
