"use client"

const NotFound = ({ error }: { error: Error }) => (
  <main className="h-[calc(100vh-83px)] grid grid-rows-2 md:flex md:justify-center ">
    <img 
      alt="Error 404"
      src="/404.svg"
      className="h-full w-full md:w-auto md:h-96 my-auto"
    />

    <div className="text-center flex flex-col items-center justify-center">
      <h1 className="text-8xl font-bold">ERROR</h1>
      <p className="text-4xl">Something went wrong!</p>
    </div>
  </main>
)

export default NotFound;
