'use client'

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Login() {
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;
        const result = await signIn('credentials', { email, password, redirect: false });

        if (result?.ok) router.push("/");
    };

    return (
        <div className="relative w-screen h-screen grid place-items-center !overflow-hidden">
            <div className="z-[99] absolute w-[350px] h-[450px] bg-[rgba(56,56,78,0.9)] border-2 border-white rounded-xl p-10 text-white grid place-items-center shadow-[0_0_30px_black]">
                <form onSubmit={handleSubmit}>
                    <h3 className="text-center font-bold text-3xl mb-7">LOGIN</h3>
                    <label htmlFor="email" className="font-bold">EMAIL</label> <br />
                    <input type="email" id="email" name="email" placeholder="Enter your email" className="w-full text-black rounded mb-5 p-1" />
                    <label htmlFor="password" className="font-bold">PASSWORD</label> <br />
                    <input type="password" id="password" name="password" placeholder="Enter your password" className="w-full text-black rounded mb-5 p-1" />
                    <button type="submit" className="w-full bg-purple-700 text-white mt-3 py-1 font-bold border-2 rounded">SIGN IN</button>
                </form>
            </div>
            <Image src="/img/car.png" alt="car" width={900} height={0} style={{ height: 'auto' }}  className="absolute z-[90] opacity-50" />
            <div className="absolute w-screen h-[150px] rotate-45 bg-white opacity-20 blur-3xl"></div>
        </div>
    );
}