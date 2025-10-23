import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { CreatePatientDto, EmergencyContactDto, InsurancePolicyDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@ApiTags('patients')
@Controller('v1/patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Crear un nuevo paciente',
    description: 'Crea un paciente con contacto de emergencia y póliza de seguro opcionales. Se genera automáticamente un patientNumber único.'
  })
  @ApiResponse({ status: 201, description: 'Paciente creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 409, description: 'La cédula (nationalId) ya existe' })
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.create(createPatientDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Listar pacientes con búsqueda y paginación',
    description: 'Busca pacientes por nombre, cédula o número de paciente. Soporta paginación.'
  })
  @ApiQuery({ name: 'search', required: false, description: 'Buscar por nombre, cédula o patientNumber' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Resultados por página (default: 10)' })
  @ApiResponse({ status: 200, description: 'Lista de pacientes con paginación' })
  findAll(
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.patientsService.findAll(search, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un paciente por ID' })
  @ApiParam({ name: 'id', description: 'ID del paciente (MongoDB ObjectId)' })
  @ApiResponse({ status: 200, description: 'Paciente encontrado' })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado' })
  findOne(@Param('id') id: string) {
    return this.patientsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Actualizar datos personales del paciente',
    description: 'Actualiza datos personales e identificadores. No modifica emergencyContact ni insurancePolicy (use los endpoints específicos).'
  })
  @ApiParam({ name: 'id', description: 'ID del paciente' })
  @ApiResponse({ status: 200, description: 'Paciente actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado' })
  @ApiResponse({ status: 409, description: 'La cédula (nationalId) ya existe en otro paciente' })
  update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientsService.update(id, updatePatientDto);
  }

  @Put(':id/emergency-contact')
  @ApiOperation({ 
    summary: 'Crear o actualizar contacto de emergencia',
    description: 'Crea o reemplaza el único contacto de emergencia del paciente.'
  })
  @ApiParam({ name: 'id', description: 'ID del paciente' })
  @ApiResponse({ status: 200, description: 'Contacto de emergencia actualizado' })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado' })
  updateEmergencyContact(
    @Param('id') id: string,
    @Body() emergencyContactDto: EmergencyContactDto,
  ) {
    return this.patientsService.updateEmergencyContact(id, emergencyContactDto);
  }

  @Delete(':id/emergency-contact')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar contacto de emergencia' })
  @ApiParam({ name: 'id', description: 'ID del paciente' })
  @ApiResponse({ status: 200, description: 'Contacto de emergencia eliminado' })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado' })
  deleteEmergencyContact(@Param('id') id: string) {
    return this.patientsService.deleteEmergencyContact(id);
  }

  @Put(':id/insurance-policy')
  @ApiOperation({ 
    summary: 'Crear o actualizar póliza de seguro',
    description: 'Crea o reemplaza la única póliza de seguro del paciente. La fecha endDate debe estar en formato dd/mm/yyyy.'
  })
  @ApiParam({ name: 'id', description: 'ID del paciente' })
  @ApiResponse({ status: 200, description: 'Póliza de seguro actualizada' })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado' })
  updateInsurancePolicy(
    @Param('id') id: string,
    @Body() insurancePolicyDto: InsurancePolicyDto,
  ) {
    return this.patientsService.updateInsurancePolicy(id, insurancePolicyDto);
  }

  @Delete(':id/insurance-policy')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar póliza de seguro' })
  @ApiParam({ name: 'id', description: 'ID del paciente' })
  @ApiResponse({ status: 200, description: 'Póliza de seguro eliminada' })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado' })
  deleteInsurancePolicy(@Param('id') id: string) {
    return this.patientsService.deleteInsurancePolicy(id);
  }
}
