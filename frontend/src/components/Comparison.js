import React from 'react';
import { motion } from 'framer-motion';

const Comparison = ({ fadeIn }) => {
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
      <div className="max-w-7xl w-full px-8 py-16 content-section relative z-10">
        <motion.div 
          className="text-center mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeIn}
        >
          <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-lg px-8 py-3 rounded-full uppercase tracking-wider shadow-xl font-semibold">Comparison</span>
          <h2 className="section-title text-6xl font-bold mt-8 mb-8">Why Choose InfoBase?</h2>
          <p className="text-gray-300 text-xl max-w-4xl mx-auto leading-relaxed">
            See how InfoBase compares to other competitive programming platforms and discover what makes us unique.
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div 
          className="overflow-hidden rounded-2xl shadow-2xl border border-red-500/20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeIn}
        >
          <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-red-600/20 to-red-500/20 border-b border-red-500/30">
                  <th className="py-6 px-8 text-left text-white font-bold text-xl">Features</th>
                  <th className="py-6 px-8 text-center text-red-400 font-bold text-xl">InfoBase</th>
                  <th className="py-6 px-8 text-center text-gray-400 font-bold text-xl">PBInfo</th>
                  <th className="py-6 px-8 text-center text-gray-400 font-bold text-xl">LeetCode</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-700/50">
                  <td className="py-6 px-8 text-white font-medium">1v1 Code Battles</td>
                  <td className="py-6 px-8 text-center"><span className="text-green-400 text-2xl">✓</span></td>
                  <td className="py-6 px-8 text-center"><span className="text-red-400 text-2xl">✗</span></td>
                  <td className="py-6 px-8 text-center"><span className="text-red-400 text-2xl">✗</span></td>
                </tr>
                <tr className="border-b border-gray-700/50 bg-gray-800/30">
                  <td className="py-6 px-8 text-white font-medium">AI Code Reviews</td>
                  <td className="py-6 px-8 text-center"><span className="text-green-400 text-2xl">✓</span></td>
                  <td className="py-6 px-8 text-center"><span className="text-red-400 text-2xl">✗</span></td>
                  <td className="py-6 px-8 text-center"><span className="text-yellow-400 text-2xl">~</span></td>
                </tr>
                <tr className="border-b border-gray-700/50">
                  <td className="py-6 px-8 text-white font-medium">Global Leaderboards</td>
                  <td className="py-6 px-8 text-center"><span className="text-green-400 text-2xl">✓</span></td>
                  <td className="py-6 px-8 text-center"><span className="text-green-400 text-2xl">✓</span></td>
                  <td className="py-6 px-8 text-center"><span className="text-green-400 text-2xl">✓</span></td>
                </tr>
                <tr className="border-b border-gray-700/50 bg-gray-800/30">
                  <td className="py-6 px-8 text-white font-medium">Community Problems</td>
                  <td className="py-6 px-8 text-center"><span className="text-green-400 text-2xl">✓</span></td>
                  <td className="py-6 px-8 text-center"><span className="text-green-400 text-2xl">✓</span></td>
                  <td className="py-6 px-8 text-center"><span className="text-yellow-400 text-2xl">~</span></td>
                </tr>
                <tr className="border-b border-gray-700/50">
                  <td className="py-6 px-8 text-white font-medium">Prizes & Rewards</td>
                  <td className="py-6 px-8 text-center"><span className="text-green-400 text-2xl">✓</span></td>
                  <td className="py-6 px-8 text-center"><span className="text-red-400 text-2xl">✗</span></td>
                  <td className="py-6 px-8 text-center"><span className="text-yellow-400 text-2xl">~</span></td>
                </tr>
                <tr className="bg-gray-800/30">
                  <td className="py-6 px-8 text-white font-medium">Romanian Language</td>
                  <td className="py-6 px-8 text-center"><span className="text-green-400 text-2xl">✓</span></td>
                  <td className="py-6 px-8 text-center"><span className="text-green-400 text-2xl">✓</span></td>
                  <td className="py-6 px-8 text-center"><span className="text-red-400 text-2xl">✗</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div 
          className="text-center mt-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeIn}
        >
          <p className="text-gray-400 text-sm">
            ✓ Available • ~ Limited • ✗ Not Available
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Comparison;