import React from "react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-[#333] text-white p-5">
        <div className="container mx-auto">
            <div className="flex justify-between item-center">
                <div>
                    <Link href={"/"}>Homepage</Link>
                </div>
                <ul className="flex">
                    <li className="mx-3"><Link href={"/Login"}>Sign In</Link></li>
                    <li className="mx-3"><Link href={"/Register"}>Sign Up</Link></li>
                </ul>
            </div>
        </div>
    </nav>
  );
}
