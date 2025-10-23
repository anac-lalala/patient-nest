export const getDatabaseConfig = () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/patients-db';
  return mongoUri;
};
