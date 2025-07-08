import { NextRequest, NextResponse } from 'next/server';
import { encrypt, verifyAuth } from '@/src/lib/auth';
// You may need to implement getUserById in your db logic
import { getUserById } from '@/src/lib/db';

export async function POST(req: NextRequest) {
  const { userId, role } = await req.json();
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const adminPayload = await verifyAuth(token);
  if (!adminPayload || adminPayload.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Fetch the user to impersonate
  const user = await getUserById(userId, role); // Implement this in your db logic
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Create a new token for the impersonated user
  const impersonateToken = await encrypt({
    id: user.id,
    email: user.email,
    role: user.role,
    username: user.username,
  });

  return NextResponse.json({ token: impersonateToken, user: {
    id: user.id,
    email: user.email,
    role: user.role,
    username: user.username,
  }});
} 