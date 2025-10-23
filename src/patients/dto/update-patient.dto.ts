import { ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsDateString, 
  IsEnum, 
  IsEmail, 
  IsOptional, 
  Length,
  Matches
} from 'class-validator';
import { Gender } from '../schemas/patient.schema';

export class UpdatePatientDto {
  @ApiPropertyOptional({ example: 'CURP123456789' })
  @IsOptional()
  @IsString()
  nationalId?: string;

  @ApiPropertyOptional({ example: 'Juan' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Pérez' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ example: '1990-05-15', description: 'Fecha de nacimiento (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({ enum: Gender, example: Gender.MASCULINO })
  @IsOptional()
  @IsEnum(Gender, { message: 'El género debe ser: masculino, femenino u otro' })
  gender?: Gender;

  @ApiPropertyOptional({ example: '5551234567', description: 'Teléfono de 10 dígitos' })
  @IsOptional()
  @IsString()
  @Length(10, 10, { message: 'El teléfono debe tener exactamente 10 dígitos' })
  @Matches(/^\d{10}$/, { message: 'El teléfono debe contener solo números' })
  phone?: string;

  @ApiPropertyOptional({ example: 'juan.perez@example.com' })
  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  email?: string;
}
