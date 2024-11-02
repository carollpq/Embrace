import React from 'react'
import { Pacifico } from 'next/font/google'
import Link from 'next/link';

const pacifico = Pacifico({ weight: ["400"], subsets: ["latin"] });

const Navbar = () => {
  return (
    <div className='flex flex-row justify-between absolute top-0 left-0 w-screen text-xl py-8 px-14'>
        {/* Logo */}
        <span className={`${pacifico.className} text-3xl`}>Embrace</span>
        {/* Right side navigation items */}
        <div className='font-semibold flex gap-8'>
            <Link href='/'>Help</Link>
            <Link href='/'>Contact Us</Link>
            <Link href='/'>About Us</Link>
            {/*Insert Profile icon here*/}
            <Link href='/'>Log Out</Link>
        </div>
    </div>
  )
}

export default Navbar