
export default function HeroSection() {
  return (
   <section className="min-h-[90vh] flex items-center">
           <div className="grid md:grid-cols-2 gap-10 items-center w-full">
             {/* LEFT: TEXT */}
             <div>
               <h1 className="text-4xl md:text-6xl font-bold leading-[1.1]">
                 Hi, I'm <span className="text-white">Aadhi</span>
               </h1>
               <h2 className="text-gray-400 mt-2 text-xl">
                 Software Engineer • Full Stack Developer
               </h2>
   
               <p className="text-gray-400 mt-6 text-lg md:text-xl max-w-xl">
                 Full-stack engineer specializing in scalable web applications and
                 AI-driven platforms. Experienced in building production systems
                 with React, Node.js, and modern backend architectures.
               </p>
               <p className="mt-4 text-sm text-gray-500">
                 🚀 Built AI-powered platforms • Automated enterprise workflows •
                 Reduced manual effort by 50%
               </p>
   
               <div className="mt-8 flex gap-4">
                 <a
                   href="/projects"
                   className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:opacity-90 transition"
                 >
                   View Projects
                 </a>
   
                 <a
                   href="#contact"
                   className="px-6 py-3 border border-gray-600 rounded-lg hover:border-white transition"
                   onClick={() => {
                     const section = document.getElementById("contact");
                     section?.scrollIntoView({ behavior: "smooth"  });
                   }}
                 >
                   Contact Me
                 </a>
               </div>
             </div>
   
             {/* RIGHT: IMAGE */}
             <div className="relative flex justify-center">
               {/* Gradient glow */}
               <div className="absolute w-96 h-96 bg-gradient-to-r from-white/10 to-transparent blur-3xl rounded-full"></div>
   
               {/* Image */}
               <img
                 src="/Aadhi.jpeg"
                 alt="Aadhi"
                 className="relative w-72 h-72 md:w-80 md:h-80 object-cover rounded-2xl border border-gray-700 shadow-2xl shadow-white/20"
               />
             </div>
           </div>
         </section>
  )
}
