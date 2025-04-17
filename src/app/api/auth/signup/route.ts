import {connect} from "@/lib/db";
import User from "@/models/userModel";
import user from "@/models/userModel";
import {NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helper/malier";


connect();
export async function POST(request: NextRequest) {
   
    try {
        const reqBody = await request.json()
        const {username, email, password} = await reqBody;
     // validation
     console.log("reqBody", reqBody);
     const user = await User.findOne ({email});
        if(user) {
            return NextResponse.json({error: "User already exists"}, {status: 400});
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
       const newUsr = new User({
            username,
            email,
            password: hashedPassword,
        });
        const savedUser = await newUsr.save();
        console.log( savedUser);
 
        // send email
        await sendEmail({email,emailType: "VERIFY" , userId: savedUser._id});
        return NextResponse.json({
            message: "User created successfully",
            success: true,
            savedUser
        });

    } catch (error:any) {
        return NextResponse.json({message: error.message}, {status: 500});
    } 
}