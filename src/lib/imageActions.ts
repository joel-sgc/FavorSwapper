"use server"
import prisma from "@/prisma/client"
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const deleteImage = async ( id: string, type: "user" | "group" ) => {
  try {
    let record;

    if (type === "user") {
      record = await prisma.user.findUnique({ where: { id }});
    } else if (type === "group") {
      record = await prisma.favorGroup.findUnique({ where: { id }});
    }

    const publicId = record?.imageId;
    if (!publicId) return { status: 404, message: "Image not found" };
    console.log(publicId)

    // Delete image from Cloudinary
    cloudinary.uploader.destroy(publicId).then((res) => {
      if (res.result === "ok") {
        return { status: 200, message: "Image deleted successfully" };
      } else {
        return { status: 500, message: "Internal Server Error" };
      }
    })

  } catch (error) {
    console.error(error);
    return { status: 500, message: "Internal Server Error" };
  } finally {
    prisma.$disconnect();
  }
}