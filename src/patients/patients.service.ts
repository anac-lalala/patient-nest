import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { format, parse, differenceInYears, isFuture } from 'date-fns';
import { Patient } from './schemas/patient.schema';
import { CreatePatientDto, EmergencyContactDto, InsurancePolicyDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientsService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<Patient>,
  ) {}

  private async generatePatientNumber(): Promise<string> {
    const count = await this.patientModel.countDocuments();
    const number = (count + 1).toString().padStart(8, '0');
    return `PAT-${number}`;
  }

  private validateDateOfBirth(dateString: string): void {
    const date = new Date(dateString);
    
    if (isFuture(date)) {
      throw new BadRequestException('La fecha de nacimiento no puede estar en el futuro');
    }

    const age = differenceInYears(new Date(), date);
    if (age > 150) {
      throw new BadRequestException('La edad no puede ser mayor a 150 años');
    }
  }

  private parseInsuranceEndDate(dateString: string): Date {
    try {
      const date = parse(dateString, 'dd/MM/yyyy', new Date());
      if (isNaN(date.getTime())) {
        throw new BadRequestException('Formato de fecha inválido para endDate. Use dd/mm/yyyy');
      }
      return date;
    } catch (error) {
      throw new BadRequestException('Formato de fecha inválido para endDate. Use dd/mm/yyyy');
    }
  }

  private formatInsuranceEndDate(date: Date): string {
    return format(date, 'dd/MM/yyyy');
  }

  async create(createPatientDto: CreatePatientDto): Promise<any> {
    this.validateDateOfBirth(createPatientDto.dateOfBirth);

    if (createPatientDto.nationalId) {
      const existingPatient = await this.patientModel.findOne({ 
        nationalId: createPatientDto.nationalId 
      });
      if (existingPatient) {
        throw new ConflictException('Ya existe un paciente con esta cédula (nationalId)');
      }
    }

    const patientNumber = await this.generatePatientNumber();

    const patientData: any = {
      ...createPatientDto,
      patientNumber,
    };

    if (createPatientDto.insurancePolicy) {
      patientData.insurancePolicy = {
        ...createPatientDto.insurancePolicy,
        endDate: this.parseInsuranceEndDate(createPatientDto.insurancePolicy.endDate),
      };
    }

    const patient = new this.patientModel(patientData);
    const savedPatient = await patient.save();
    
    return this.formatPatientResponse(savedPatient);
  }

  async findAll(search?: string, page: number = 1, limit: number = 10): Promise<any> {
    const query: any = {};

    if (search) {
      query.$or = [
        { patientNumber: { $regex: search, $options: 'i' } },
        { nationalId: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [patients, total] = await Promise.all([
      this.patientModel.find(query).skip(skip).limit(limit).exec(),
      this.patientModel.countDocuments(query),
    ]);

    return {
      data: patients.map(p => this.formatPatientResponse(p)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<any> {
    const patient = await this.patientModel.findById(id);
    if (!patient) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }
    return this.formatPatientResponse(patient);
  }

  async update(id: string, updatePatientDto: UpdatePatientDto): Promise<any> {
    if (updatePatientDto.dateOfBirth) {
      this.validateDateOfBirth(updatePatientDto.dateOfBirth);
    }

    if (updatePatientDto.nationalId) {
      const existingPatient = await this.patientModel.findOne({ 
        nationalId: updatePatientDto.nationalId,
        _id: { $ne: id }
      });
      if (existingPatient) {
        throw new ConflictException('Ya existe otro paciente con esta cédula (nationalId)');
      }
    }

    const patient = await this.patientModel.findByIdAndUpdate(
      id,
      { $set: updatePatientDto },
      { new: true, runValidators: true },
    );

    if (!patient) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }

    return this.formatPatientResponse(patient);
  }

  async updateEmergencyContact(id: string, emergencyContactDto: EmergencyContactDto): Promise<any> {
    const patient = await this.patientModel.findByIdAndUpdate(
      id,
      { $set: { emergencyContact: emergencyContactDto } },
      { new: true, runValidators: true },
    );

    if (!patient) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }

    return this.formatPatientResponse(patient);
  }

  async deleteEmergencyContact(id: string): Promise<any> {
    const patient = await this.patientModel.findByIdAndUpdate(
      id,
      { $unset: { emergencyContact: 1 } },
      { new: true },
    );

    if (!patient) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }

    return this.formatPatientResponse(patient);
  }

  async updateInsurancePolicy(id: string, insurancePolicyDto: InsurancePolicyDto): Promise<any> {
    const insuranceData = {
      ...insurancePolicyDto,
      endDate: this.parseInsuranceEndDate(insurancePolicyDto.endDate),
    };

    const patient = await this.patientModel.findByIdAndUpdate(
      id,
      { $set: { insurancePolicy: insuranceData } },
      { new: true, runValidators: true },
    );

    if (!patient) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }

    return this.formatPatientResponse(patient);
  }

  async deleteInsurancePolicy(id: string): Promise<any> {
    const patient = await this.patientModel.findByIdAndUpdate(
      id,
      { $unset: { insurancePolicy: 1 } },
      { new: true },
    );

    if (!patient) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }

    return this.formatPatientResponse(patient);
  }

  private formatPatientResponse(patient: any): any {
    const patientObj = patient.toObject();
    
    if (patientObj.insurancePolicy?.endDate) {
      patientObj.insurancePolicy.endDate = this.formatInsuranceEndDate(
        patientObj.insurancePolicy.endDate
      );
    }

    return patientObj;
  }
}
