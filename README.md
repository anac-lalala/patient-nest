# Patient Management REST API

API REST completa para gestión de pacientes construida con NestJS, TypeScript, y MongoDB.

## 🚀 Características

- ✅ CRUD completo de pacientes con validación robusta
- ✅ Gestión de contactos de emergencia (1 por paciente)
- ✅ Gestión de pólizas de seguro con formato dd/mm/yyyy
- ✅ Búsqueda avanzada y paginación
- ✅ Documentación Swagger/OpenAPI interactiva
- ✅ Generación automática de número de paciente único
- ✅ Validaciones completas según especificaciones

## 📋 Configuración de MongoDB Atlas

**IMPORTANTE**: Para que la aplicación funcione, necesitas configurar MongoDB Atlas correctamente:

### Paso 1: Configurar IP Whitelist en MongoDB Atlas

1. Ve a tu cluster de MongoDB Atlas
2. Click en "Network Access" en el menú lateral
3. Click en "Add IP Address"
4. **Opción recomendada**: Click en "Allow Access from Anywhere" (0.0.0.0/0)
   - Esto permite conexiones desde cualquier IP (incluyendo Replit)
   - Para producción, considera restringir a IPs específicas

### Paso 2: Verificar la cadena de conexión

Asegúrate de que tu MONGODB_URI en los Secrets de Replit:
- Incluya el usuario y contraseña correctos
- Tenga el formato: `mongodb+srv://usuario:contraseña@cluster.mongodb.net/patients-db?retryWrites=true&w=majority`
- El nombre de usuario y contraseña no contengan caracteres especiales sin codificar (usa URL encoding si es necesario)

### Paso 3: Verificar el usuario de base de datos

1. En MongoDB Atlas, ve a "Database Access"
2. Asegúrate de que el usuario tiene permisos de lectura y escritura
3. El rol debe ser al menos "Read and write to any database"

## 🏗️ Estructura del Proyecto

```
src/
├── main.ts                          # Punto de entrada, configuración Swagger
├── app.module.ts                    # Módulo raíz con MongoDB
└── patients/
    ├── patients.module.ts           # Módulo de pacientes
    ├── patients.controller.ts       # Endpoints REST
    ├── patients.service.ts          # Lógica de negocio
    ├── schemas/
    │   └── patient.schema.ts        # Esquema Mongoose
    └── dto/
        ├── create-patient.dto.ts    # DTOs de creación
        └── update-patient.dto.ts    # DTOs de actualización
```

## 📡 Endpoints API

### Pacientes

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST   | `/v1/patients` | Crear nuevo paciente |
| GET    | `/v1/patients?search=&page=&limit=` | Listar/buscar pacientes |
| GET    | `/v1/patients/:id` | Obtener un paciente |
| PATCH  | `/v1/patients/:id` | Actualizar datos personales |

### Contacto de Emergencia

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| PUT    | `/v1/patients/:id/emergency-contact` | Crear/actualizar contacto |
| DELETE | `/v1/patients/:id/emergency-contact` | Eliminar contacto |

### Póliza de Seguro

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| PUT    | `/v1/patients/:id/insurance-policy` | Crear/actualizar póliza |
| DELETE | `/v1/patients/:id/insurance-policy` | Eliminar póliza |

## 🔍 Reglas de Validación

### Paciente
- **patientNumber**: Auto-generado (PAT-00000001, PAT-00000002...), único
- **nationalId**: Opcional, único si se proporciona
- **phone**: Exactamente 10 dígitos numéricos
- **email**: Opcional, formato email válido
- **gender**: "masculino", "femenino", o "otro"
- **dateOfBirth**: No en el futuro, edad ≤ 150 años

### Contacto de Emergencia
- Máximo 1 por paciente
- No único globalmente (múltiples pacientes pueden compartir contactos)
- **phone**: 10 dígitos numéricos

### Póliza de Seguro
- Máximo 1 por paciente
- **endDate**: Formato dd/mm/yyyy en API, Date en MongoDB

## 📝 Ejemplos de Uso

### Crear un paciente

```bash
POST /v1/patients
Content-Type: application/json

{
  "firstName": "Juan",
  "lastName": "Pérez",
  "dateOfBirth": "1990-05-15",
  "gender": "masculino",
  "phone": "5551234567",
  "email": "juan.perez@example.com",
  "nationalId": "CURP123456789",
  "emergencyContact": {
    "name": "María García",
    "relationship": "Esposa",
    "phone": "5559876543"
  },
  "insurancePolicy": {
    "provider": "Seguro Nacional",
    "policyNumber": "POL-123456",
    "endDate": "31/12/2025"
  }
}
```

### Buscar pacientes

```bash
GET /v1/patients?search=Juan&page=1&limit=10
```

### Actualizar contacto de emergencia

```bash
PUT /v1/patients/507f1f77bcf86cd799439011/emergency-contact
Content-Type: application/json

{
  "name": "María García",
  "relationship": "Esposa",
  "phone": "5559876543"
}
```

## 📖 Documentación Swagger

Una vez que la aplicación esté corriendo, accede a la documentación interactiva:

**URL**: http://localhost:5000/api

La documentación Swagger incluye:
- Todos los endpoints con descripciones detalladas
- Esquemas de datos
- Posibilidad de probar los endpoints directamente
- Ejemplos de request/response

## 🐛 Resolución de Problemas

### Error: "Could not connect to any servers in your MongoDB Atlas cluster"

**Solución**: Configura el IP whitelist en MongoDB Atlas (ver Paso 1 arriba)

### Error: "Authentication failed"

**Solución**: Verifica que el usuario y contraseña en MONGODB_URI sean correctos

### La aplicación no inicia

1. Verifica que MONGODB_URI esté configurado en Secrets
2. Revisa los logs del workflow "Server"
3. Asegúrate de que MongoDB Atlas esté activo y accesible

## 🛠️ Tecnologías Utilizadas

- **NestJS** - Framework de Node.js para backend
- **TypeScript** - Lenguaje de programación
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **class-validator** - Validación de datos
- **Swagger/OpenAPI** - Documentación de API
- **date-fns** - Manejo de fechas

## 📄 Licencia

ISC
