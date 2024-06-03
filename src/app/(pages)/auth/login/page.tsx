import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Apple, Google } from "@/components/svg";
import { Button } from "@/components/ui/button";
import { signIn } from "@/auth";
import { Input } from "@/components/ui/input";

export default async function Page() {
  
  return (
    <section className="container flex-1 grid place-content-center">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Sign into Favor Swapper through your favorite providers.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          
          <form action={async() => {
            "use server"
            await signIn('google');
          }}>
            <Button className="flex gap-2 hover:underline w-full">
              <Google size={24}/> Sign in with Google
            </Button>
          </form>

          <form action={async() => {
            "use server"
            await signIn('apple');
          }}>
            <Button className="flex gap-2 hover:underline w-full">
              <Apple size={24}/> Sign in with Apple
            </Button>
          </form>
          
          
          <div className="w-full flex items-center justify-center gap-2">
            <hr className="w-full bg-primary border-primary"/>
            Or
            <hr className="w-full bg-primary border-primary"/>
          </div>


          <form action={async(form) => {
            "use server"
            await signIn('nodemailer', { email: form.get('email') });
          }}
            className="grid gap-4 w-full"
          >
            <Input type="email" placeholder="johndoe@email.com" name="email" required/>
            <Button className="flex gap-2 hover:underline w-full">
              Sign in with Email
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}