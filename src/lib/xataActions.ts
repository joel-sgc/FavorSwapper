"use server"

import { getXataClient } from "./xata";

export const updateUser = async({ id, data }: { id: string, data: any }) => {
  const xata = getXataClient();

  console.log(data);
  await xata.db.nextauth_users.updateOrThrow(id, data);
}

export const uploadImage = async( formData: FormData ) => {
  const data = new FormData();
  data.append('image', formData.get('pfp') as File);

  try {
    const req = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, {
      method: 'POST',
      body: data,
    });

    const res = await req.json();
    return res
  } catch (error) {
    throw(error);
  }
}