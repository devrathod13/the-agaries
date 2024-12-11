export default function Farmers() {
  const farmerStories = [
    {
      name: "Rajesh Kumar",
      location: "Rann of Kutch, Gujarat",
      story: "For generations, my family has been salt farming. With support, we're now using sustainable techniques that protect both our livelihood and the environment."
    },
    {
      name: "Meera Devi",
      location: "Little Rann of Kutch, Gujarat",
      story: "As a woman in a traditionally male-dominated industry, I've found strength and independence through community support and skill development programs."
    },
    {
      name: "Anil Patil",
      location: "Sambhar Salt Lake, Rajasthan",
      story: "Technology and training have transformed our salt production. We're no longer just surviving, but building a prosperous future for our community."
    }
  ];

  return (
    <div className="relative min-h-screen flex items-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{
          backgroundImage: 'url(/our-farmers.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          filter: 'brightness(50%)'
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6">
            Stories of Resilience
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            Meet the incredible salt farmers who are the heart of our mission, transforming challenges into opportunities through determination and support.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farmerStories.map((farmer, index) => (
            <div 
              key={index} 
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center transform transition-all duration-300 hover:scale-105"
            >
              <h3 className="text-xl font-bold text-white mb-2">{farmer.name}</h3>
              <p className="text-white/70 mb-4 italic">{farmer.location}</p>
              <p className="text-white/80">{farmer.story}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
