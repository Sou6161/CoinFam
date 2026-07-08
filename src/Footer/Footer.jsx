import React from "react";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import logo from "../Images Folder/HeaderLogo.png"

const Footer = () => {
  return (
    <footer className="relative bg-[#0b1120] border-t border-slate-800 text-slate-400 w-full">
      <div className="relative max-w-6xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 xsmall:grid-cols-2 medium:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <img className=" mb-4  h-[5vh] object-cover" src={logo} alt="" />
            <p className="mb-4 xlarge:text-[1.2vw]">
              Empowering your crypto journey with Detailed stats and
              expert insights.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-slate-400 hover:text-teal-400 transition-colors"
              >
              
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-teal-400 transition-colors"
              >
                <Github size={20} />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-teal-400 transition-colors"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          <div className="medium:ml-[10vw] medium:text-nowrap">
            <h3 className="text-lg font-semibold text-white mb-4  medium:mt-2 ">
              Quick Links
            </h3>
            <ul className="space-y-2 xlarge:text-[1.3vw] ">
              <li>
                <a href="#" className="hover:text-white   transition-colors">
                 <span className="text-white">Home</span> 
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  <span className="text-white">About Us</span>
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  <span className="text-white">Services</span>
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  <span className="text-white">Blog</span>
                </a>
              </li>
            </ul>
          </div>
          <div className=" medium:ml-[10vw] xlarge:mt-2 medium:text-nowrap">
            <h3 className="text-lg font-semibold  text-white mb-4">
              Contact Us
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail size={16} className="mr-2 medium:mr-0" />
                <a
                  href="#"
                  onClick={() => window.location = "mailto:info@coinfam.com"}
                  className="hover:text-white transition-colors xlarge:text-[1.vw]"
                >
                  <span className="text-teal-400 font-semibold">info@coinfam.com</span>
                </a>
              </li>
              <li className=" medium:whitespace-nowrap">123 Crypto Street</li>
              <li className=" medium:whitespace-nowrap">
                Blokchain City, CC 12345
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-800 text-sm text-slate-500 text-center">
          <p>&copy; 2024 CoinFam. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
