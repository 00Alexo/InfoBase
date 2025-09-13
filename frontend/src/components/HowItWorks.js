import React from 'react';
import { motion } from 'framer-motion';
import { FaUserPlus, FaCode, FaTrophy } from 'react-icons/fa';

const HowItWorks = ({ fadeIn, iconVariants }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        minHeight: '100vh',
        paddingTop: '2rem',
        paddingBottom: '2rem',
      }}
    >
      <div className="max-w-6xl w-full px-8 py-16 pb-24 content-section relative z-10">
        <motion.div 
          className="text-center mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeIn} 
        >
          <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-lg px-8 py-3 rounded-full uppercase tracking-wider shadow-xl font-semibold">How It Works</span>
          <h2 className="section-title text-6xl font-bold mt-8 mb-8">Your Coding Journey</h2>
          <p className="text-gray-300 text-xl max-w-4xl mx-auto leading-relaxed">
            Master competitive programming in three simple steps. Join thousands of developers improving their skills daily.
          </p>
        </motion.div>

        {/* Steps section */}
        <div className="relative">
          {/* Timeline line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 via-red-400 to-red-600 transform -translate-x-1/2 shadow-lg"></div>

          {/* Step 1 */}
          <motion.div 
            className="flex flex-col md:flex-row items-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
          >
            <div className="md:w-1/2 md:pr-16 text-right">
              <h3 className="text-red-500 text-4xl font-bold mb-6 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">Sign Up & Start</h3>
              <p className="text-gray-300 text-xl leading-relaxed">Create your account and dive into our extensive library of coding challenges tailored to your skill level.</p>
            </div>
            <motion.div 
              className="rounded-full bg-gradient-to-br from-red-500 to-red-700 text-white h-20 w-20 flex items-center justify-center font-bold text-3xl my-6 md:my-0 z-10 shadow-2xl border-4 border-red-400/30"
              variants={iconVariants}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <FaUserPlus className="text-2xl" />
            </motion.div>
            <div className="md:w-1/2 md:pl-16">
              <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-red-600/20">
                <span className="text-4xl mb-4 block">�</span>
                <p className="text-gray-300">Upload files, connect databases, or integrate with your existing tools seamlessly.</p>
              </div>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div 
            className="flex flex-col md:flex-row-reverse items-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
          >
            <div className="md:w-1/2 md:pl-16 text-left">
              <h3 className="text-red-400 text-4xl font-bold mb-6 bg-gradient-to-r from-red-300 to-red-500 bg-clip-text text-transparent">Practice & Compete</h3>
              <p className="text-gray-300 text-xl leading-relaxed">Solve problems, participate in contests, and challenge others in real-time 1v1 coding battles.</p>
            </div>
            <motion.div 
              className="rounded-full bg-gradient-to-br from-red-400 to-red-600 text-white h-20 w-20 flex items-center justify-center font-bold text-3xl my-6 md:my-0 z-10 shadow-2xl border-4 border-red-300/30"
              variants={iconVariants}
              whileHover={{ scale: 1.1, rotate: -5 }}
            >
              <FaCode className="text-2xl" />
            </motion.div>
            <div className="md:w-1/2 md:pr-16">
              <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 p-8 rounded-2xl shadow-2xl border border-red-400/20 backdrop-blur-lg hover:border-red-300/40 transition-all duration-300">
                <span className="text-5xl mb-6 block filter drop-shadow-lg">📈</span>
                <p className="text-gray-300 text-lg leading-relaxed">Build interactive charts, set up filters, and create custom views to analyze your data with advanced visualization capabilities.</p>
              </div>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div 
            className="flex flex-col md:flex-row items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
          >
            <div className="md:w-1/2 md:pr-16 text-right">
              <h3 className="text-red-300 text-4xl font-bold mb-6 bg-gradient-to-r from-red-200 to-red-400 bg-clip-text text-transparent">Share & Collaborate</h3>
              <p className="text-gray-300 text-xl leading-relaxed">Share insights with your team and collaborate on data-driven decisions in real-time with powerful collaboration features.</p>
            </div>
            <motion.div 
              className="rounded-full bg-gradient-to-br from-red-300 to-red-500 text-white h-20 w-20 flex items-center justify-center font-bold text-3xl my-6 md:my-0 z-10 shadow-2xl border-4 border-red-200/30"
              variants={iconVariants}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              3
            </motion.div>
            <div className="md:w-1/2 md:pl-16">
              <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 p-8 rounded-2xl shadow-2xl border border-red-300/20 backdrop-blur-lg hover:border-red-200/40 transition-all duration-300">
                <span className="text-5xl mb-6 block filter drop-shadow-lg">🤝</span>
                <p className="text-gray-300 text-lg leading-relaxed">Export reports, schedule updates, and collaborate seamlessly across your organization with enterprise-grade sharing tools.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
