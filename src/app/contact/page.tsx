import React from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub } from 'react-icons/fa';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black/90 to-blue-900/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 sm:p-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-white">
            Contact The Agaries
          </h1>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white mb-4">Get in Touch</h2>
              
              <div className="flex items-center space-x-4 text-white/80">
                <FaEnvelope className="text-2xl" />
                <div>
                  <p className="font-medium">Email</p>
                  <a 
                    href="mailto:devnitarathod@gmail.com" 
                    className="hover:text-blue-300 transition"
                  >
                    devnitarathod@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-white/80">
                <FaPhone className="text-2xl" />
                <div>
                  <p className="font-medium">Phone</p>
                  <a 
                    href="tel:+15483330424" 
                    className="hover:text-blue-300 transition"
                  >
                    +1 (548) 333 0424
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-white/80">
                <FaMapMarkerAlt className="text-2xl" />
                <div>
                  <p className="font-medium">Location</p>
                  <p>Saskatchewan, SK, Canada</p>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4 mt-6">
                <a 
                  href="https://www.linkedin.com/in/devrathod1307" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-blue-300 transition"
                >
                  <FaLinkedin className="text-2xl" />
                </a>
                <a 
                  href="https://github.com/devrathod13" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-blue-300 transition"
                >
                  <FaGithub className="text-2xl" />
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">Send us a Message</h2>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-white/80 mb-2">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-white/80 mb-2">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your Email"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-white/80 mb-2">Message</label>
                  <textarea 
                    id="message" 
                    rows={4}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your Message"
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-blue-500/70 text-white py-2 rounded-lg hover:bg-blue-600/70 transition duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
