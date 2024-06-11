"use server"

import prisma from "@/prisma/client"

export const deleteImage = async ( delUrl: string ) => {
  try {
    const matchingGroups = await prisma.favorGroup.findMany({ where: { imageDelUrl: delUrl }});
    const matchinGUsers = await prisma.user.findMany({ where: { imageDelUrl: delUrl }});

    if (matchingGroups.length + matchinGUsers.length > 1) {
      return { status: 500, message: "Image being used for other purposes, deletion cancelled." };
    }

    const myHeaders = new Headers();
    myHeaders.append("User-Agent", "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:125.0) Gecko/20100101 Firefox/125.0");
    myHeaders.append("Accept", "application/json, text/javascript, */*; q=0.01");
    myHeaders.append("Accept-Language", "en-US,en;q=0.5");
    myHeaders.append("Accept-Encoding", "gzip, deflate, br");
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    myHeaders.append("X-Requested-With", "XMLHttpRequest");
    myHeaders.append("Origin", "https://favorswapper.imgbb.com");
    myHeaders.append("Connection", "keep-alive");
    myHeaders.append("Referer", "https://favorswapper.imgbb.com/");
    myHeaders.append("Cookie", process.env.IMGBB_COOKIE as string);
    myHeaders.append("Sec-Fetch-Dest", "empty");
    myHeaders.append("Sec-Fetch-Mode", "cors");
    myHeaders.append("Sec-Fetch-Site", "same-origin");
    
    const raw = `${process.env.IMGbb_DELETION_STRING}${delUrl.split('/')[3]}`;
    
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    await fetch("https://favorswapper.imgbb.com/json", requestOptions as RequestInit);
    return { status: 200, message: "Image deleted successfully" };
  } catch (error) {
    console.error(error);
    return { status: 500, message: "Internal Server Error" };
  }
}