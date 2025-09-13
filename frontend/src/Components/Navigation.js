import React from 'react';
import { ParallaxLayer } from '@react-spring/parallax';
import { motion } from 'framer-motion';

const Navigation = ({ parallaxRef }) => {
  return (
    <ParallaxLayer 
      sticky={{ start: 0, end: 4 }}
      style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingRight: '2rem', zIndex: 1 }}
    >
      <div className="hidden md:flex flex-col gap-4">
        {[0, 1, 2, 3].map((page) => (
          <motion.div
            key={page}
            className={`h-4 w-4 rounded-full cursor-pointer ${parallaxRef.current && Math.round(parallaxRef.current.current) === page ? 'bg-[#5F5FDF]' : 'bg-[#ADBBDA]'}`}
            whileHover={{ scale: 1.5 }}
            onClick={() => parallaxRef.current?.scrollTo(page)}
          />
        ))}
      </div>
    </ParallaxLayer>
  );
};

export default Navigation;