import { connect } from "@/lib/db";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helper/malier";

connect(); 

export async function POST(reqUEST : NextRequest) {
    try{
const reqBody = await reqUEST.json();
const {token} = reqBody
console.log(token);




const user = await User.findOne({verifyToken:token , verifyTokenExpiry:{$gt:Date.now()}});

if(!user){
    return NextResponse.json({error:"User not found"} , {status:404});
}
console.log(user);

user.isVerified = true;
user.verifyToken = undefined;
user.verifyTokenExpiry = undefined;
await user.save();

return NextResponse.json({ message:"Email verified successfully", success:true,} , {status:500}); 




    }  catch(error:any){
        return NextResponse.json({error:error.message} , {status:500}); 
       
    } 
}