import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/lib/dbConfig';
import User from '@/models/userModel';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in the environment variables");
    }

    // Check for default admin credentials
    if (email === "F2022065004@GMAIL.COM" && password === "@vGP4hQ3") {
      const tokenData = {
        id: "admin",
        username: "admin",
        email: email,
        role: "admin",
      };

      const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      const response = NextResponse.json({
        message: "Login successful",
        success: true,
        user: tokenData,
      });

      response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      return response;
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "User does not exist" },
        { status: 400 }
      );
    }

    // Check if password is correct
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 400 }
      );
    }

    // Create token data
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    // Create token
    const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const response = NextResponse.json({
      message: "Login successful",
      success: true,
      user: tokenData,
    });

    // Set the token in cookies
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error: any) {
    console.error("Error in /api/auth/login:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}