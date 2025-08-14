// import React, { useState } from "react";
// import { motion } from "framer-motion";

// const ContactModal = ({ onClose }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     company: '',
//     message: ''
//   });

//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Handle form submission here
//     console.log('Form submitted:', formData);
//   };

//   return (
//     <div className="relative w-full h-full bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
//       {/* Background Effects */}
//       <div className="absolute inset-0 opacity-30">
//         <div className="w-full h-full bg-[radial-gradient(circle_at_30%_20%,_rgba(59,130,246,0.2)_0%,_transparent_50%)]"></div>
//         <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[radial-gradient(circle,_rgba(139,92,246,0.1)_0%,_transparent_50%)]"></div>
//       </div>

//       <div className="relative z-10 flex flex-col lg:flex-row h-full">
//         {/* Left Section - Contact Info */}
//         <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
//           <motion.div
//             initial={{ opacity: 0, x: -30 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.2 }}
//             className="space-y-8"
//           >
//             <div>
//               <h1 className="text-4xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
//                 Let's Connect
//               </h1>
//               <p className="text-xl text-gray-300 leading-relaxed">
//                 Ready to transform your business with AI agents? Let's discuss how we can help you innovate.
//               </p>
//             </div>

//             <div className="space-y-6">
//               <div className="flex items-center space-x-4">
//                 <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
//                   <span className="text-blue-400">🤖</span>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-white">AI Solutions</h3>
//                   <p className="text-gray-400">Custom AI agent development</p>
//                 </div>
//               </div>

//               <div className="flex items-center space-x-4">
//                 <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
//                   <span className="text-purple-400">⚡</span>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-white">Fast Integration</h3>
//                   <p className="text-gray-400">Quick deployment & setup</p>
//                 </div>
//               </div>

//               <div className="flex items-center space-x-4">
//                 <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
//                   <span className="text-cyan-400">🛡️</span>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-white">Enterprise Security</h3>
//                   <p className="text-gray-400">Bank-level data protection</p>
//                 </div>
//               </div>
//             </div>

//             <div className="pt-8 border-t border-white/10">
//               <h4 className="text-lg font-semibold mb-4">Get in Touch</h4>
//               <div className="space-y-3">
//                 <a
//                   href="mailto:hello@opxgroups.com"
//                   className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors"
//                 >
//                   <span>📧</span>
//                   <span>hello@opxgroups.com</span>
//                 </a>
//                 <a
//                   href="tel:+1234567890"
//                   className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors"
//                 >
//                   <span>📞</span>
//                   <span>+1 (234) 567-890</span>
//                 </a>
//               </div>
//             </div>
//           </motion.div>
//         </div>

//         {/* Right Section - Contact Form */}
//         <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
//           <motion.div
//             initial={{ opacity: 0, x: 30 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.4 }}
//           >
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-300 mb-2">
//                   Full Name
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-all duration-300 text-white placeholder-gray-400"
//                   placeholder="Enter your full name"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-300 mb-2">
//                   Email Address
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-all duration-300 text-white placeholder-gray-400"
//                   placeholder="your.email@company.com"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-300 mb-2">
//                   Company (Optional)
//                 </label>
//                 <input
//                   type="text"
//                   name="company"
//                   value={formData.company}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-all duration-300 text-white placeholder-gray-400"
//                   placeholder="Your company name"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-300 mb-2">
//                   Message
//                 </label>
//                 <textarea
//                   name="message"
//                   value={formData.message}
//                   onChange={handleInputChange}
//                   required
//                   rows={5}
//                   className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-all duration-300 text-white placeholder-gray-400 resize-none"
//                   placeholder="Tell us about your project and how we can help..."
//                 />
//               </div>

//               <motion.button
//                 type="submit"
//                 className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] focus:scale-[0.98]"
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//               >
//                 Send Message
//               </motion.button>
//             </form>
//           </motion.div>
//         </div>
//       </div>

//       {/* Social Links Footer */}
//       <div className="absolute bottom-8 left-8 right-8">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.6 }}
//           className="flex justify-center space-x-6"
//         >
//           <a href="#" className="text-gray-400 hover:text-white transition-colors">
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//               <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
//             </svg>
//           </a>
//           <a href="#" className="text-gray-400 hover:text-white transition-colors">
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//               <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
//             </svg>
//           </a>
//           <a href="#" className="text-gray-400 hover:text-white transition-colors">
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//               <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.404-5.958 1.404-5.958s-.358-.72-.358-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z" />
//             </svg>
//           </a>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default ContactModal;
import React from "react";
import { motion } from "framer-motion";

const ContactModal = ({ onClose }) => {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-black via-gray-900 to-indigo-900 text-white overflow-hidden">
      {/* Background texture/pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(59,130,246,0.1)_0%,_transparent_50%)]"></div>
      </div>

      {/* Main content container */}
      <div className="flex flex-col W-FULL items-center justify-center h-full px-8">
        {/* Contact Us Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <h1 className="text-sm font-light tracking-[0.3em] text-gray-300 text-center">
            ◊ CONTACT US ◊
          </h1>
        </motion.div>

        {/* Route Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-20"
        >
          <div className="flex items-center gap-8 text-6xl md:text-8xl font-light tracking-wider">
            <span className="text-white">LAX</span>
            <span className="text-gray-400">→</span>
            <span className="text-white">NYC</span>
            <span className="text-gray-400">→</span>
            <span className="text-white">AMS</span>
          </div>
        </motion.div>

        {/* Bottom section with social links and QR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-end justify-between w-full max-w-6xl"
        >
          {/* Left side - Social and links */}
          <div className="flex flex-col gap-6">
            {/* Social media icons */}
            <div className="flex gap-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.404-5.958 1.404-5.958s-.358-.72-.358-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>

            {/* Links */}
            <div className="flex flex-col gap-2">
              <a
                href="#"
                className="text-sm text-gray-400 hover:text-white transition-colors underline"
              >
                PRIVACY NOTICE
              </a>
              <a
                href="#"
                className="text-sm text-gray-400 hover:text-white transition-colors underline"
              >
                NEWSLETTER SIGNUP
              </a>
            </div>

            {/* Email */}
            <div className="mt-4">
              <a
                href="mailto:hello@activetheory.net"
                className="text-sm text-gray-300 hover:text-white transition-colors underline"
              >
                HELLO@ACTIVETHEORY.NET
              </a>
            </div>
          </div>

          {/* Right side - QR Code */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-24 h-24 bg-white p-2 rounded">
              {/* QR Code placeholder - in real app, you'd use a QR code library */}
              <div className="w-full h-full bg-black relative">
                <div className="absolute inset-1 bg-white"></div>
                <div className="absolute top-2 left-2 w-3 h-3 bg-black"></div>
                <div className="absolute top-2 right-2 w-3 h-3 bg-black"></div>
                <div className="absolute bottom-2 left-2 w-3 h-3 bg-black"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-black"></div>
                {/* Add more QR pattern elements as needed */}
                <div className="absolute top-3 left-6 w-1 h-1 bg-black"></div>
                <div className="absolute top-4 left-3 w-1 h-1 bg-black"></div>
                <div className="absolute top-5 left-7 w-1 h-1 bg-black"></div>
                <div className="absolute bottom-3 right-6 w-1 h-1 bg-black"></div>
                <div className="absolute bottom-4 right-3 w-1 h-1 bg-black"></div>
                <div className="absolute bottom-5 right-7 w-1 h-1 bg-black"></div>
              </div>
            </div>
            <span className="text-xs text-gray-400">SCAN FOR MOBILE</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactModal;
