import Link from "next/link";
import { FaHandHoldingHeart } from "react-icons/fa";

export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center">
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{
          backgroundImage: 'url(/farmers.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          filter: 'brightness(50%)'
        }}
      />
      
      <div className="relative z-10 container mx-auto px-4">
        <div className="grid gap-12 items-center">
          <div className="text-center space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white">
              Empowering Salt Farmers
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
              We&apos;re dedicated to supporting traditional salt farmers, providing sustainable solutions and improving their quality of life.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                href="/donate" 
                className="btn btn-primary flex items-center justify-center"
              >
                <FaHandHoldingHeart className="mr-2" /> Donate Now
              </Link>
              <Link 
                href="/impact" 
                className="btn btn-secondary flex items-center justify-center"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}