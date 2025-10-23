# Patient Management API

REST API para gestión de pacientes construida con NestJS, TypeScript, y MongoDB.

## Descripción del Proyecto

API REST completa para gestionar pacientes con las siguientes características:
- Registro y actualización de pacientes
- Gestión de contactos de emergencia (1 por paciente)
- Gestión de pólizas de seguro (1 por paciente)
- Búsqueda y paginación
- Validación completa de datos
- Documentación Swagger/OpenAPI

## Arquitectura

- **Framework**: NestJS con TypeScript
- **Base de datos**: MongoDB con Mongoose ODM
- **Validación**: class-validator y class-transformer
- **Documentación**: Swagger/OpenAPI
- **Formato de fechas**: date-fns

### Estructura del Proyecto

```
src/
├── main.ts                          # Punto de entrada de la aplicación
├── app.module.ts                    # Módulo raíz
└── patients/
    ├── patients.module.ts           # Módulo de pacientes
    ├── patients.controller.ts       # Controlador REST
    ├── patients.service.ts          # Lógica de negocio
    ├── schemas/
    │   └── patient.schema.ts        # Esquema Mongoose
    └── dto/
        ├── create-patient.dto.ts    # DTOs de creación
        └── update-patient.dto.ts    # DTOs de actualización
```

## Configuración

### Variables de Entorno Requeridas

La aplicación necesita configurar `MONGODB_URI` para conectarse a MongoDB. 

Para conectar a MongoDB local (si tienes uno):
```
MONGODB_URI=mongodb://localhost:27017/patients-db
```

Para usar MongoDB Atlas (recomendado):
1. Crea una cuenta en https://www.mongodb.com/cloud/atlas
2. Crea un cluster gratuito
3. Obtén la cadena de conexión
4. Configura MONGODB_URI en los Secrets de Replit

## Reglas de Validación

### Paciente
- **patientNumber**: Generado automáticamente (PAT-00000001, PAT-00000002, etc.), único
- **nationalId**: Opcional, pero debe ser único si se proporciona
- **phone**: Exactamente 10 dígitos numéricos
- **email**: Opcional, debe ser un email válido
- **gender**: "masculino", "femenino", o "otro"
- **dateOfBirth**: No puede estar en el futuro, edad máxima 150 años

### Contacto de Emergencia
- Máximo 1 por paciente
- No hay unicidad global (varios pacientes pueden compartir el mismo contacto)
- **phone**: 10 dígitos numéricos

### Póliza de Seguro
- Máximo 1 por paciente
- **endDate**: Formato dd/mm/yyyy en la API, almacenado como Date en MongoDB

## Endpoints API v1

### Pacientes

- **POST /v1/patients** - Crear paciente (con contacto y póliza opcionales)
- **GET /v1/patients?search=&page=&limit=** - Listar y buscar pacientes
- **GET /v1/patients/:id** - Obtener un paciente
- **PATCH /v1/patients/:id** - Actualizar datos personales

### Contacto de Emergencia

- **PUT /v1/patients/:id/emergency-contact** - Crear/actualizar contacto
- **DELETE /v1/patients/:id/emergency-contact** - Eliminar contacto

### Póliza de Seguro

- **PUT /v1/patients/:id/insurance-policy** - Crear/actualizar póliza
- **DELETE /v1/patients/:id/insurance-policy** - Eliminar póliza

## Documentación Swagger

Una vez que la aplicación esté corriendo, accede a la documentación interactiva en:
http://localhost:5000/api

## Cambios Recientes

**2025-10-23**: Implementación inicial del API completa con todos los endpoints y validaciones requeridas.
