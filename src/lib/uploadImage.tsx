"use server"

import prisma from "@/prisma/client"

export const uploadImage = async ( formData: FormData ) => {
  try {
    const req = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, {
      method: "POST",
      body: formData,
    })

    const res = await req.json();
    return { status: 200, message: "Image uploaded successfully", data: res.data.url };
  } catch (error) {
    console.log(error);
    return { status: 500, message: "Internal Server Error" };
  } finally {
    prisma.$disconnect();
  }
}