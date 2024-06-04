import { ArrowLeftRightIcon, Coins, UserPlus2, Users2Icon } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

export const Footer = () => (
  <footer className="w-full border-t-2 grid grid-cols-4 gap-4 p-4 bg-background sticky bottom-0 left-0">
    <Button variant='secondary' asChild>
      <Link href='/friends'><UserPlus2/></Link>
    </Button>
    <Button variant='secondary' asChild>
      <Link href='/groups'><Users2Icon/></Link>
    </Button>
    <Button variant='secondary' asChild>
      <Link href='/'><ArrowLeftRightIcon/></Link>
    </Button>
    <Button variant='secondary' asChild>
      <Link href='/points'><Coins/></Link>
    </Button>
  </footer>
)