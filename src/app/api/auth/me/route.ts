import { connect } from "@/lib/db";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helper/getDataFromToken";



connect(); 

export async function POST(request : NextRequest) {

    // EXTRACTING THE TOKEN FROM THE TOKEN
 const userId = await getDataFromToken(request)

 const user = await User.findOne({_id:userId}).select("-password");
 return NextResponse.json({message:"user found", data:user})



}