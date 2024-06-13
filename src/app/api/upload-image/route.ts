import { NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';

import { auth } from "@/auth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const POST = auth(async function POST(req) {
  if (!req.auth) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  // Generate Cloudinary upload signature
  const timestamp = Math.round(new Date().getTime() / 1000);
  
  const formData = await req.formData();
  formData.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET as string);
  
  const signature = cloudinary.utils.api_sign_request({ 
    tags: formData.get('tags') as string,
    timestamp,
    upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET as string, 
  }, process.env.CLOUDINARY_API_SECRET as string);
  const url = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/upload?api_key=${process.env.CLOUDINARY_API_KEY}&timestamp=${timestamp}&signature=${signature}`;

  try {
    const req = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const res = await req.json();

    return NextResponse.json({ message: "Image uploaded successfully", data: { image: res.secure_url, imageId: res.public_id } }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
})