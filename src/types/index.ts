import { Prisma } from "@prisma/client";

export type MedicineWithRelations = Prisma.MedicineGetPayload<{
  include: {
    intakeTimes: true;
    frequency: {
      include: {
        oddEvenDay: true;
        onOffDays: true;
      };
    };
    period: true;
    stock: true;
    memo: true;
  };
}>;

export type MedicineWithRelationsAndImageUrl = Prisma.MedicineGetPayload<{
  include: {
    intakeTimes: true;
    frequency: {
      include: {
        oddEvenDay: true;
        onOffDays: true;
      };
    };
    period: true;
    stock: true;
  };
}> & {
  memo: {
    id: number;
    imageUrl: string | null;
    text: string | null;
    medicineId: string;
  } | null;
};
