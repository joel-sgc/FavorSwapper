import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

const Home = async() => {
  const session = await getServerSession(authOptions);

  return (
    <section className="container pt-4 flex-1">
      <p>{JSON.stringify(session)}</p>
      {/* <AuthButton/> */}
    </section>
  );
}


export default Home