import type { ReactNode } from "react";
import Navbar from "./Navbar";
interface props {
  children: ReactNode;
}



export default function MainLayout({children}:props) {
  return (
     <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pt-24 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">{children}</main>
    </div>
  )
}
