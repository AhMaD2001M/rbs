import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '../../../../lib/auth';
import User from '../../../../models/userModel';
import { connectDB } from '../../../../lib/db';

export async function GET(req: NextRequest) {
  await connectDB();
  const session = await getSession();
  if (!session || session.role !== 'student') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = await User.findById(session.id).lean();
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  return NextResponse.json({
    username: user.username,
    email: user.email,
    role: user.role,
    profile: user.profile || {},
  });
} 