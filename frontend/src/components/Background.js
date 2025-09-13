import React from 'react';
import { ParallaxLayer } from '@react-spring/parallax';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

const Background = ({ stars, shapes, floatingOrbs, floatingLines, colors }) => {
  return (
    <>
      {/* Background with unified dark gradient */}
      <ParallaxLayer
        offset={0}
        speed={0}
        factor={5.2}
        style={{ 
          background: `linear-gradient(to bottom, ${colors.bgPage} 0%, ${colors.lightBg} 25%, ${colors.bgPage} 50%, ${colors.lightBg} 75%, ${colors.bgPage} 100%)`
        }}
      />
      
      {/* Glowing red accent background elements */}
      <ParallaxLayer
        offset={0}
        speed={0.1}
        factor={5.2}
      >
        <div className="absolute top-[15%] left-[10%] w-96 h-96 rounded-full bg-red-600 opacity-[0.08] blur-[120px]" />
        <div className="absolute top-[60%] right-[15%] w-[500px] h-[500px] rounded-full bg-red-500 opacity-[0.06] blur-[150px]" />
        <div className="absolute top-[160%] left-[20%] w-[600px] h-[600px] rounded-full bg-red-700 opacity-[0.05] blur-[180px]" />
        <div className="absolute top-[260%] right-[5%] w-96 h-96 rounded-full bg-red-400 opacity-[0.07] blur-[130px]" />
        <div className="absolute top-[320%] left-[15%] w-[450px] h-[450px] rounded-full bg-red-500 opacity-[0.05] blur-[160px]" />
        <div className="absolute top-[100%] left-[50%] w-[400px] h-[400px] rounded-full bg-red-800 opacity-[0.04] blur-[140px]" />
        <div className="absolute top-[200%] right-[40%] w-[300px] h-[300px] rounded-full bg-red-600 opacity-[0.06] blur-[110px]" />
        <div className="absolute top-[350%] right-[25%] w-[350px] h-[350px] rounded-full bg-red-400 opacity-[0.06] blur-[125px]" />
        <div className="absolute top-[400%] left-[30%] w-[400px] h-[400px] rounded-full bg-red-500 opacity-[0.05] blur-[140px]" />
        <div className="absolute top-[380%] right-[10%] w-[300px] h-[300px] rounded-full bg-red-600 opacity-[0.06] blur-[120px]" />
        {/* New glow elements for the comparison page */}
        <div className="absolute top-[440%] left-[25%] w-[350px] h-[350px] rounded-full bg-red-500 opacity-[0.06] blur-[130px]" />
        <div className="absolute top-[480%] right-[30%] w-[400px] h-[400px] rounded-full bg-red-400 opacity-[0.05] blur-[150px]" />
        <div className="absolute top-[460%] left-[5%] w-[300px] h-[300px] rounded-full bg-red-700 opacity-[0.07] blur-[120px]" />
      </ParallaxLayer>
      
      {/* Decorative stars - spans all pages */}
      <ParallaxLayer offset={0} speed={0.1} factor={5.2}>
        {stars.map((star, i) => (
          <div 
            key={i}
            className="star" 
            style={{
              fontSize: star.fontSize,
              left: star.left,
              top: star.top,
              '--duration': star.animationDuration
            }}
          >
            <FaStar />
          </div>
        ))}
      </ParallaxLayer> 
      
      {/* Floating shapes with motion */}
      <ParallaxLayer offset={0} speed={0.2} factor={5.2}>
        {shapes.map((shape, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: shape.opacity,
              y: [0, Math.random() > 0.5 ? 25 : -25, 0],
            }}
            transition={{ 
              opacity: { duration: 2, delay: i * 0.1 },
              y: { duration: 20, repeat: Infinity, ease: "linear" }
            }}
            style={{
              position: 'absolute',
              left: shape.left,
              top: shape.top,
              transform: `rotate(${shape.rotate})`,
              width: shape.width,
              height: shape.height,
              borderRadius: shape.borderRadius,
              background: shape.background,
            }}
          />
        ))}
      </ParallaxLayer>
      
      {/* Floating Orbs Layer */}
      <ParallaxLayer offset={0} speed={0.15} factor={5.2}>
        {floatingOrbs.map((orb, i) => (
          <div 
            key={i}
            style={{
              position: 'absolute',
              left: orb.left,
              top: orb.top,
              width: orb.size,
              height: orb.size,
              backgroundColor: orb.color,
              opacity: orb.opacity,
              borderRadius: '50%',
              filter: `blur(${orb.blur})`,
              animation: `float ${orb.animationDuration} infinite ease-in-out`
            }}
          />
        ))}
      </ParallaxLayer>

      {/* Flowing Lines Layer */}
      <ParallaxLayer offset={0} speed={0.2} factor={5.2}>
        {floatingLines.map((line, i) => (
          <div 
            key={i}
            style={{
              position: 'absolute',
              left: line.left,
              top: line.top,
              width: line.width,
              height: line.height,
              backgroundColor: line.color,
              opacity: line.opacity,
              transform: `rotate(${line.rotate})`,
              animation: `flow ${line.animationDuration} infinite ease-in-out`,
              '--min-opacity': line.opacity * 0.5,
              '--max-opacity': line.opacity * 1.5,
              '--rotate': line.rotate
            }}
          />
        ))}
      </ParallaxLayer>
    </>
  );
};

export default Background;