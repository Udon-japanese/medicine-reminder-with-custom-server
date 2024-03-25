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
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async redirect({ url, baseUrl }) {
      const BASE_URL = process.env.NEXTAUTH_URL!;
      if (url === '/login' || url === `${baseUrl}/login`) {
        return `${BASE_URL}/medicines`;
      }
      
      if (url.startsWith('/')) return `${BASE_URL}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return `${BASE_URL}/medicines`;
    },
  },
  events: {
    async signIn({ isNewUser, user }) {
      const existingMedicineUnits = await prisma.medicineUnit.findMany({
        where: {
          userId: user.id,
        },
      });

      if (isNewUser || existingMedicineUnits.length === 0) {
        const defaultUnits = [
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
        const data = defaultUnits.map((unit) => ({
          unit: unit,
          userId: user?.id,
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
  pages: {
    signIn: '/login',
  },
};
