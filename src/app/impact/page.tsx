
import { 
  FaHandsHelping, 
  FaChartLine, 
  FaUserShield, 
  FaGraduationCap, 
  FaMoneyBillWave, 
  FaHeart 
} from "react-icons/fa";

export default function Impact() {
  const supportAreas = [
    { 
      icon: FaHandsHelping, 
      title: "Community Support", 
      description: "Strengthening local salt farming communities through collaborative initiatives."
    },
    { 
      icon: FaChartLine, 
      title: "Economic Empowerment", 
      description: "Developing sustainable economic models to improve farmers' income and stability."
    },
    { 
      icon: FaUserShield, 
      title: "Social Protection", 
      description: "Ensuring fair treatment, rights, and social security for salt farmers."
    },
    { 
      icon: FaGraduationCap, 
      title: "Education", 
      description: "Providing skill development and educational opportunities for farmers and their families."
    },
    { 
      icon: FaMoneyBillWave, 
      title: "Financial Inclusion", 
      description: "Creating access to credit, banking, and financial literacy programs."
    },
    { 
      icon: FaHeart, 
      title: "Holistic Wellness", 
      description: "Supporting physical and mental health through comprehensive wellness programs."
    }
  ];

  return (
    <div className="relative min-h-screen flex items-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{
          backgroundImage: 'url(/our-impact.webp)',
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
            Our Impact Strategy
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            We focus on comprehensive support that addresses the multifaceted challenges faced by salt farmers, creating sustainable pathways to prosperity.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {supportAreas.map((area, index) => (
            <div 
              key={index} 
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center transform transition-all duration-300 hover:scale-105"
            >
              <div className="text-4xl text-white mb-4 flex justify-center">
                <area.icon />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{area.title}</h3>
              <p className="text-white/80">{area.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
