import React from 'react';
import { motion } from 'framer-motion';
import { FaRobot, FaFistRaised, FaTrophy, FaUsers, FaCode, FaGift } from 'react-icons/fa';

const Features = ({ fadeIn, staggerContainer, featureCardVariants, iconVariants }) => {
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
      <div className="max-w-6xl w-full px-8 py-16 content-section relative z-10">
        <motion.div 
          className="text-center mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeIn}
        >
          <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-lg px-8 py-3 rounded-full uppercase tracking-wider shadow-xl font-semibold">Features</span>
          <h2 className="section-title text-6xl font-bold mt-8 mb-8">Competitive Programming Excellence</h2>
          <p className="text-gray-300 text-xl max-w-4xl mx-auto leading-relaxed">
            InfoBase delivers the ultimate competitive programming experience with advanced features designed to accelerate your coding journey.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.div 
            className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 border border-red-600/20 hover:border-red-500/40 backdrop-blur-lg group"
            variants={featureCardVariants}
            whileHover="hover"
          >
            <motion.div 
              className="h-20 w-20 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center mb-6 shadow-xl group-hover:shadow-red-500/25 transition-all duration-300"
              variants={iconVariants}
            >
              <FaFistRaised className="text-3xl text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-red-400 transition-colors">1v1 Code Battles</h3>
            <p className="text-gray-300 leading-relaxed text-lg">
              Challenge other programmers in real-time coding duels. Test your skills head-to-head with live competitions.
            </p>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 border border-red-500/20 hover:border-red-400/40 backdrop-blur-lg group"
            variants={featureCardVariants}
            whileHover="hover"
          >
            <motion.div 
              className="h-20 w-20 rounded-2xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center mb-6 shadow-xl group-hover:shadow-red-400/25 transition-all duration-300"
              variants={iconVariants}
            >
              <FaRobot className="text-3xl text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-red-400 transition-colors">AI Code Reviews</h3>
            <p className="text-gray-300 leading-relaxed text-lg">
              Get instant feedback on your solutions with AI-powered code analysis, optimization tips, and best practices.
            </p>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 border border-red-400/20 hover:border-red-300/40 backdrop-blur-lg group"
            variants={featureCardVariants}
            whileHover="hover"
          >
            <motion.div 
              className="h-20 w-20 rounded-2xl bg-gradient-to-br from-red-300 to-red-500 flex items-center justify-center mb-6 shadow-xl group-hover:shadow-red-300/25 transition-all duration-300"
              variants={iconVariants}
            >
              <FaTrophy className="text-3xl text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-red-400 transition-colors">Global Leaderboards</h3>
            <p className="text-gray-300 leading-relaxed text-lg">
              Climb the rankings and compete globally. Track your progress and see how you stack against the world's best.
            </p>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 border border-red-600/20 hover:border-red-500/40 backdrop-blur-lg group"
            variants={featureCardVariants}
            whileHover="hover"
          >
            <motion.div 
              className="h-20 w-20 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center mb-6 shadow-xl group-hover:shadow-red-500/25 transition-all duration-300"
              variants={iconVariants}
            >
              <FaUsers className="text-3xl text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-red-400 transition-colors">Community Problems</h3>
            <p className="text-gray-300 leading-relaxed text-lg">
              Solve community-created challenges and contribute your own problems to help others learn and grow.
            </p>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 border border-red-500/20 hover:border-red-400/40 backdrop-blur-lg group"
            variants={featureCardVariants}
            whileHover="hover"
          >
            <motion.div 
              className="h-20 w-20 rounded-2xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center mb-6 shadow-xl group-hover:shadow-red-400/25 transition-all duration-300"
              variants={iconVariants}
            >
              <FaCode className="text-3xl text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-red-400 transition-colors">Algorithm Library</h3>
            <p className="text-gray-300 leading-relaxed text-lg">
              Access thousands of curated problems covering every algorithm and data structure concept from basic to advanced.
            </p>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 border border-red-400/20 hover:border-red-300/40 backdrop-blur-lg group"
            variants={featureCardVariants}
            whileHover="hover"
          >
            <motion.div 
              className="h-20 w-20 rounded-2xl bg-gradient-to-br from-red-300 to-red-500 flex items-center justify-center mb-6 shadow-xl group-hover:shadow-red-300/25 transition-all duration-300"
              variants={iconVariants}
            >
              <FaGift className="text-3xl text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-red-400 transition-colors">Prizes & Rewards</h3>
            <p className="text-gray-300 leading-relaxed text-lg">
              Earn points, unlock achievements, and win amazing prizes through contests, challenges, and consistent practice.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Features;
