import { prisma } from "@/lib/prismadb";
import getCurrentUser from "./getCurrentUser";

const getMedicineUnits = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    return [];
  }

  try {
    const medicineUnits = await prisma.medicineUnit.findMany({
      where: {
        userId: currentUser.id,
      },
    });

    return medicineUnits;
  } catch (err) {
    return [];
  }
};

export default getMedicineUnits;