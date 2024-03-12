import getCurrentUser from '@/app/actions/getCurrentUser';
import { prisma } from '@/lib/prismadb';
import { webPush } from '@/lib/webPush';
import { NextResponse } from 'next/server';
import { isInvalidPushSubscription } from './utils';

export async function POST(req: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id || !currentUser?.email) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await req.json();
    if (isInvalidPushSubscription(body)) {
      return new NextResponse('Invalid PushSubscription', { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        pushSubscriptions: {
          create: {
            endpoint: body.endpoint,
            authKey: body.keys.auth,
            p256dhkey: body.keys.p256dh,
          },
        },
      },
    });

    await webPush.sendNotification(
      {
        endpoint: body.endpoint,
        keys: body.keys,
      },
      JSON.stringify({
        body: '通知の登録が完了しました！',
      }),
    );

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id || !currentUser?.email) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await req.json();
    if (isInvalidPushSubscription(body)) {
      return new NextResponse('Invalid PushSubscription', { status: 400 });
    }

    const { endpoint } = body;

    const existingPushSubscription = await prisma.pushSubscription.findUnique({
      where: {
        endpoint,
      },
    });

    if (!existingPushSubscription) {
      return new NextResponse('PushSubscription not found', { status: 404 });
    }

    const deletedPushSubscription = await prisma.pushSubscription.delete({
      where: {
        endpoint,
      },
    });

    return NextResponse.json(deletedPushSubscription);
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
