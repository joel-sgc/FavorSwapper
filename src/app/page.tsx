import { authOptions } from "./api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";

const Home = async() => {
  const session = await getServerSession(authOptions);

  return (
    <></>
    // <section className="container pt-4 flex-1">
    //   <p>{JSON.stringify(session)}</p>
    //   {/* <AuthButton/> */}
    // </section>
  );
}


export default Home