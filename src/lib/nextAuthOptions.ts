import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prismadb';
import { NextAuthOptions } from 'next-auth';
import { Adapter } from 'next-auth/adapters';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope:
            'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
        },
      },
    }),
  ],
  events: {
    async session({ session }) {
      const user = await prisma.user.findUnique({
        where: {
          email: session?.user?.email!,
        },
      });
      const existingUnits = await prisma.medicineUnit.findMany();
      if (existingUnits.length === 0) {
        const units = [
          '錠',
          'カプセル',
          '包',
          'ml',
          'g',
          'mg',
          '滴',
          '回',
          '枚',
          '個',
          '本',
        ];
        const data = units.map((unit) => ({
          unit: unit,
          userId: user?.id!,
        }));

        await prisma.medicineUnit.createMany({
          data,
        });
      }
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 30,
  },
};
