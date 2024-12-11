import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { FaFacebook, FaTwitter, FaInstagram, FaHeart } from "react-icons/fa";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Agaries - Empowering Salt Farmers",
  description: "Supporting traditional salt farmers of India through sustainable development",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen flex flex-col bg-gray-50">
        <header className="fixed w-full top-0 z-50 bg-white shadow-md">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <FaHeart className="text-red-500 text-2xl" />
              <span className="text-2xl font-bold text-gray-800">The Agaries</span>
            </Link>
            
            <nav className="hidden md:flex space-x-6 items-center">
              <Link 
                href="/impact" 
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Our Impact
              </Link>
              <Link 
                href="/farmers" 
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Our Farmers
              </Link>
              <Link 
                href="/donate" 
                className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors"
              >
                Donate Now
              </Link>
            </nav>
            
            <div className="md:hidden">
              <button className="text-gray-800 focus:outline-none">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-grow mt-16">
          {children}
        </main>

        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <FaHeart className="text-red-500 text-2xl" />
                <h3 className="text-xl font-bold">The Agaries</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Empowering traditional salt farmers through sustainable support and community development.
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-300 hover:text-white">
                  <FaFacebook className="text-2xl" />
                </Link>
                <Link href="#" className="text-gray-300 hover:text-white">
                  <FaTwitter className="text-2xl" />
                </Link>
                <Link href="#" className="text-gray-300 hover:text-white">
                  <FaInstagram className="text-2xl" />
                </Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-2">
                {[
                  { href: "/about", label: "About Us" },
                  { href: "/impact", label: "Our Impact" },
                  { href: "/farmers", label: "Our Farmers" },
                  { href: "/donate", label: "Donate" }
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link 
                      href={href} 
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Get Involved</h4>
              <ul className="space-y-2">
                {[
                  { href: "/volunteer", label: "Volunteer" },
                  { href: "/partner", label: "Corporate Partnerships" },
                  { href: "/fundraise", label: "Fundraise" },
                  { href: "/events", label: "Upcoming Events" }
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link 
                      href={href} 
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Contact Us</h4>
              <p className="text-gray-400 mb-2">
                Email: devnitarathod@gmail.com
              </p>
              <p className="text-gray-400 mb-2">
                Phone: +1 (548) 333 0424
              </p>
              <p className="text-gray-400 mb-4">
                Sasketchwan, SK
              </p>
              <Link 
                href="/contact" 
                className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
          
          <div className="container mx-auto px-4 mt-8 pt-4 border-t border-gray-800 text-center">
            <p className="text-gray-500">
              {new Date().getFullYear()} The Agaries. All Rights Reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
