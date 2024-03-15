import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { revalidatePath } from "next/cache";

const Friends = async () => {
  const submit = async ( formData: FormData ) => {
    "use server"

    console.log('actions');

    revalidatePath('/friends')
  }

  
  return (
    <form action={submit} className="mt-8 container flex gap-2">
      <Input name="name"/>
      <Button type="submit">Submit</Button>
    </form>
  )
}

export default Friends