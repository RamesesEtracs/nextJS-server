"use client"

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const pageHandler = () => {
    router.push('/request');
  }

  return (
    <div className="justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      This the Home Page
    <div>
    <button className='mt-11 rounded-lg px-6 py-2 bg-blue-600 text-white' onClick={pageHandler}>
        Go to Request Page
      </button>
    </div>
     
    </div>
  );
}
