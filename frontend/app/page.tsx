import Link from "next/link";
import { Pacifico, Quicksand } from "next/font/google";


const pacifico = Pacifico({ weight: ["400"], subsets: ["latin"] });
const quicksand = Quicksand({ weight: ["500"], subsets: ["latin"] });

export default function StartPage() {

  return (
    <div className="flex flex-col justify-center gap-16 items-center bg-home-screen-blue h-screen bg-center">
      <h1
        className={`${pacifico.className} text-8xl animate-slideUp delay-1000`}
      >
        Embrace
      </h1>
      <p className={`${quicksand.className} text-2xl animate-slideUp delay-1000`}>
        Your Companion at Any Time, Anywhere
      </p>
      <div className="flex-center flex-row gap-10  w-screen animate-slideUp delay-1000">
        <Link href="/sign-in">
          <button className="button-transition hover:bg-[#1d1d1d] hover:text-white text-center text-2xl text-black/60 w-[200px] py-4 bg-white rounded-[30px] drop-shadow-default">
            Login
          </button>
        </Link>
        <Link href="/sign-up">
          <button className="button-transition hover:bg-white hover:text-black/60 text-center text-white text-2xl font-normal w-[200px] py-4 bg-[#1d1d1d] rounded-[30px] drop-shadow-default">
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  );
}
