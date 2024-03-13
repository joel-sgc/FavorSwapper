"use server"

import { revalidatePath } from "next/cache";
import { getXataClient } from "./xata";

export const updateUser = async({ id, data }: { id: string, data: any }) => {
  const xata = getXataClient();

  const status = await xata.db.nextauth_users.updateOrThrow(id, data);
  console.log(status);
  revalidatePath('/account');
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

    return {status: 200, data: res}
  } catch (error) {
    return {status: 500, error}
  }
}