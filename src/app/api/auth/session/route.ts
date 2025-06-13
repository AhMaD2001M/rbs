import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session) {
      return Response.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    return Response.json({ user: session });
  } catch (error) {
    console.error('Session error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 