'use client';
import BlockchainDonation from '@/components/BlockchainDonation';

export default function Donate() {
  return (
    <div className="relative min-h-screen flex items-center">
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{
          backgroundImage: 'url(/donate.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          filter: 'brightness(50%)'
        }}
      />
      
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left order-2 md:order-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6">
              Blockchain Empowerment
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mb-6">
              Revolutionizing support for salt farmers through transparent, direct blockchain donations. 
              Every contribution creates real, traceable impact.
            </p>
          </div>

          <div className="order-1 md:order-2 flex justify-center">
            <BlockchainDonation />
          </div>
        </div>
      </div>
    </div>
  );
}
