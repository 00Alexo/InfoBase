import React from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaTrophy, FaUsers, FaRocket, FaBolt, FaChartLine } from 'react-icons/fa';

const Hero = ({ fadeIn, staggerContainer, iconVariants }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100vh',
      }}       
    >
      <motion.div 
        className="text-center max-w-5xl px-8 py-12 relative z-10"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.div className="flex justify-center mb-8" variants={iconVariants}>
          <div className="h-28 w-28 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl flex items-center justify-center shadow-2xl border border-red-400/30 backdrop-blur-sm">
            <FaCode className="text-5xl text-white filter drop-shadow-lg" />
          </div>
        </motion.div>
        
        <motion.h1 
          className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent text-7xl font-bold mb-6 tracking-wide drop-shadow-2xl"
          variants={fadeIn}
        >
          Code. Compete. Conquer.
        </motion.h1>
        
        <motion.p 
          className="text-gray-200 text-2xl mb-8 mx-auto max-w-4xl leading-relaxed font-light"
          variants={fadeIn}
        >
          Master competitive programming with thousands of challenges, real-time 1v1 battles, AI-powered feedback, and climb the global leaderboards for amazing prizes.
        </motion.p>


        <motion.div 
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10"
          variants={staggerContainer}
        >
          <motion.div 
            className="text-center p-8 bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-red-500/20 hover:border-red-500/40 transition-all duration-300 hover:transform hover:scale-105"
            variants={fadeIn}
            whileHover={{ y: -5 }}
          >
            <div className="h-16 w-16 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FaRocket className="text-2xl text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Algorithm Mastery</h3>
            <p className="text-gray-300 leading-relaxed">Solve thousands of coding problems from beginner to expert level with detailed explanations</p>
          </motion.div>

          <motion.div 
            className="text-center p-8 bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-red-400/20 hover:border-red-400/40 transition-all duration-300 hover:transform hover:scale-105"
            variants={fadeIn}
            whileHover={{ y: -5 }}
          >
            <div className="h-16 w-16 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FaBolt className="text-2xl text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Real-time Battles</h3>
            <p className="text-gray-300 leading-relaxed">Challenge friends in 1v1 coding duels and prove your programming prowess</p>
          </motion.div>

          <motion.div 
            className="text-center p-8 bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-red-600/20 hover:border-red-600/40 transition-all duration-300 hover:transform hover:scale-105"
            variants={fadeIn}
            whileHover={{ y: -5 }}
          >
            <div className="h-16 w-16 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FaChartLine className="text-2xl text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Progress Tracking</h3>
            <p className="text-gray-300 leading-relaxed">Monitor your growth with detailed analytics and climb the global rankings</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;