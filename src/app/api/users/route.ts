import getCurrentUser from '@/app/actions/getCurrentUser';
import { prisma } from '@/lib/prismadb';
import { cookies } from 'next/headers';

export async function DELETE() {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id || !currentUser?.email) {
    return new Response(JSON.stringify('Unauthorized'), { status: 401 });
  }

  try {
    cookies().delete(process.env.NEXT_PUBLIC_SESSION_COOKIE_NAME!);
    cookies().delete(process.env.NEXT_PUBLIC_CSRF_COOKIE_NAME!);
    
    await prisma.user.delete({
      where: {
        id: currentUser.id,
      },
    });

    return new Response(JSON.stringify('ok'), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify('Internal Server Error'), {
      status: 500,
    });
  }
}
