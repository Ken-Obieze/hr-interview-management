import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Middleware for logging
type MiddlewareParams = {
  model?: string;
  action: string;
  args: any;
  dataPath: string[];
  runInTransaction: boolean;
};

prisma.$use(async (params: MiddlewareParams, next: (params: MiddlewareParams) => Promise<any>) => {
  const before = Date.now();
  const result = await next(params);
  const after = Date.now();
  
  console.log(`Query ${params.model}.${params.action} took ${after - before}ms`);
  
  return result;
});

// Handle connection errors
prisma.$connect()
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((error: unknown) => {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Database disconnected');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  console.log('Database disconnected');
  process.exit(0);
});

export default prisma;
