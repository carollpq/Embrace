import Link from "next/link";
import { Pacifico } from "next/font/google";

const pacifico = Pacifico({ weight: ["400"], subsets: ["latin"] });

export default function Home() {
  return (
    <div className="flex flex-col justify-evenly items-center bg-home-screen-blue h-screen bg-center">
      <h1 className={`${pacifico.className} text-9xl animate-slideUp delay-1000`}>Embrace</h1>
      <p className="text-3xl animate-slideUp delay-1000">Your Companion at Any Time, Anywhere</p>
      <div className="flex-center flex-row gap-20  w-screen animate-slideUp delay-1000">
        <Link href="/sign-in">
          <button className="button-transition hover:bg-[#1d1d1d] hover:text-white text-center text-3xl text-black/60 w-[250px] py-[20px] bg-white rounded-[30px] drop-shadow-default">
            Login
          </button>
        </Link>
        <Link href="/sign-up">
          <button className="button-transition hover:bg-white hover:text-black/60 text-center text-white text-3xl font-normal w-[250px] py-[20px] bg-[#1d1d1d] rounded-[30px] drop-shadow-default">
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  );
}
