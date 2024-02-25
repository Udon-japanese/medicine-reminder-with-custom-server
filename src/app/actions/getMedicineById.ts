import { prisma } from "@/lib/prismadb";
import getCurrentUser from "./getCurrentUser";

const getMedicineById = async (
  medicineId: string
) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.email) {
      return null;
    }
  
    const medicine = await prisma.medicine.findUnique({
      where: {
        id: medicineId
      },
      include: {
        intakeTimes: true,
        frequency: {
          include: {
            oddEvenDay: true,
            onOffDays: true,
          },
        },
        period: true,
        stock: true,
        memo: true,
      },
    });

    return medicine;
  } catch (error: any) {
    console.log(error, 'SERVER_ERROR')
    return null;
  }
};

export default getMedicineById;