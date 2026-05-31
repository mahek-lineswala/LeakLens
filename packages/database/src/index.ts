import { PrismaClient } from '@prisma/client';

export * from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // Avoid duplicating Prisma Client instances in development due to hot module replacements
  const globalWithPrisma = global as typeof globalThis & {
    prisma?: PrismaClient;
  };
  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = new PrismaClient({
      log: ['query', 'error', 'warn'],
    });
  }
  prisma = globalWithPrisma.prisma;
}

export { prisma };
export default prisma;
