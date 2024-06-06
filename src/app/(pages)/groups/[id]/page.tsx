import prisma from "@/prisma/client"

const GroupPage = async ({ params }: { params: { id: string }}) => {
  const group = await prisma.favorGroup.findUnique({ where: { id: params.id }});
  
  return (
    <>{JSON.stringify(group)}</>
  )
}

export default GroupPage