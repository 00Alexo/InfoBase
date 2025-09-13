import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Parallax, ParallaxLayer } from '@react-spring/parallax';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaRobot, FaFistRaised, FaTrophy, FaChevronDown, FaArrowRight } from 'react-icons/fa';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Comparison from '../components/Comparison';
import Background from '../components/Background';
import Navigation from '../components/Navigation';
import Globe from '../components/Globe';
import NavBar from '../components/NavBar'

const WelcomePage = () => {
  const navigate = useNavigate();
  const parallaxRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);

        
  // Track current page for navigation indicators
  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current && parallaxRef.current.current !== undefined) {
        setCurrentPage(Math.round(parallaxRef.current.current));
      }
    };

    // Set up interval to check scroll position
    const interval = setInterval(handleScroll, 100);
    
    return () => clearInterval(interval);
  }, []);

  // Sophisticated Dark Red theme color palette
  const colors = {
    primary: "#ef4444",      // red-500 - vibrant but not overwhelming
    primaryHover: "#dc2626", // red-600
    secondary: "#f87171",    // red-400 - lighter accent
    secondaryHover: "#ef4444", // red-500
    accent: "#fca5a5",       // red-300 - subtle accent
    textPrimary: "#ffffff",  // pure white text
    textSecondary: "#e5e7eb", // gray-200 - softer white
    textMuted: "#9ca3af",    // gray-400 - muted text
    bgPage: "#18191c",       // main dark background
    bgCard: "#1f2937",       // gray-800 for cards
    bgCardHover: "#374151",  // gray-700 for hover states
    lightBg: "#111827",      // gray-900 for darker sections
    border: "#374151"        // gray-700 for borders
  }; 

  // Pre-compute random values for consistent rendering
  const stars = useMemo(() => [...Array(200)].map(() => ({
    fontSize: `${Math.random() * 12 + 3}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 400}%`, 
    animationDuration: `${Math.random() * 4 + 2}s`
  })), []);

  const shapes = useMemo(() => [...Array(30)].map(() => {
    const baseColor = Math.random() > 0.5 ? colors.primary : colors.secondary;
    return {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 400}%`, 
      rotate: `${Math.random() * 360}deg`,
      width: `${Math.random() * 80 + 30}px`,
      height: `${Math.random() * 80 + 30}px`,
      borderRadius: Math.random() > 0.3 ? '50%' : '20%',
      background: `${baseColor}${Math.floor(Math.random() * 40 + 20).toString(16)}`,
      opacity: Math.random() * 0.3 + 0.1
    };
  }), []);

  const floatingLines = useMemo(() => [...Array(25)].map(() => {
    return {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 400}%`,
      width: `${Math.random() * 150 + 80}px`,
      height: `${Math.random() * 2 + 1}px`,
      rotate: `${Math.random() * 180}deg`,
      opacity: Math.random() * 0.2 + 0.05,
      color: Math.random() > 0.5 ? colors.primary : colors.secondary,
      animationDuration: `${Math.random() * 12 + 8}s`
    };
  }), []);

  // Add floating orbs - paw-print inspired
  const floatingOrbs = useMemo(() => [...Array(20)].map(() => {
    return {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 400}%`,
      size: `${Math.random() * 120 + 60}px`,
      opacity: Math.random() * 0.15 + 0.05,
      blur: `${Math.random() * 40 + 20}px`,
      color: Math.random() > 0.5 ? colors.primary : colors.secondary,
      animationDuration: `${Math.random() * 25 + 15}s`
    };
  }), []);
  
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const featureCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
      transition: { duration: 0.3 }
    }
  };
  
  const iconVariants = {
    hidden: { scale: 0 },
    visible: { 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 0.6 
      }
    }
  };


  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Fixed NavBar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavBar />
      </div>
      
      <style jsx>{`
        /* Custom scrollbar styling */
        :global(body::-webkit-scrollbar) {
          width: 8px;
        }

        :global(body::-webkit-scrollbar-track) {
          background: ${colors.bgPage};
        }

        :global(body::-webkit-scrollbar-thumb) {
          background: ${colors.primary};
          border-radius: 4px;
        }

        :global(body::-webkit-scrollbar-thumb:hover) {
          background: ${colors.primaryHover};
        }

        :global(body) {
          background-color: ${colors.bgPage};
        }

          /* Star animation - red twinkling */
          @keyframes twinkle {
            0% { opacity: 0.3; }
            100% { opacity: 0.8; }
          }

          .star {
            position: absolute;
            animation: twinkle var(--duration) infinite alternate;
            color: ${colors.primary};
          }
          
          /* Floating orb animation - smooth movement */
          @keyframes float {
            0% { transform: translateY(0) translateX(0); }
            50% { transform: translateY(-20px) translateX(10px); }
            100% { transform: translateY(0) translateX(0); }
          }
          
          /* Line flow animation - flowing movement */
          @keyframes flow {
            0% { transform: translateX(-15px) rotate(var(--rotate)); opacity: var(--min-opacity); }
            50% { transform: translateX(15px) rotate(calc(var(--rotate) + 3deg)); opacity: var(--max-opacity); }
            100% { transform: translateX(-15px) rotate(var(--rotate)); opacity: var(--min-opacity); }
          }        /* Content section styling */
        .content-section {
          background: linear-gradient(135deg, ${colors.bgCard}cc, ${colors.lightBg}dd);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px ${colors.border}40;
          padding: 3rem;
          border: 1px solid ${colors.border}60;
        }
        
        .section-title {
          background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary}, ${colors.accent});
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 30px ${colors.primary}40;
        }
      `}</style>

      <Parallax 
        ref={parallaxRef} 
        pages={5.2} 
        config={{ tension: 170, friction: 26 }}
        style={{ height: '100vh', marginTop: '0px' }}
      >
        <Background 
          stars={stars} 
          shapes={shapes} 
          floatingOrbs={floatingOrbs} 
          floatingLines={floatingLines}
          colors={colors}
        />
        
        {/* Globe Section - Page 0 */}
        <ParallaxLayer
          offset={0}
          speed={0.2}
          factor={1}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '20px'
          }}
        > 
          <div className="relative w-full h-full" >
            <Globe />
            {/* Overlay content on the globe */}
            <div className="absolute inset-0 flex flex-col justify-center pointer-events-none" style={{ zIndex: 9999 }}>
              <div className="flex">
                {/* Left side content */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="flex-1 pl-16 pr-8 max-w-2xl ml-8"
                >
                  <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent drop-shadow-2xl">
                    InfoBase
                  </h1>
                  <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed mb-8">
                    The ultimate competitive programming platform. Master algorithms, compete in 1v1 battles, and climb the global leaderboards with AI-powered feedback.
                  </p>
                  {/* Competitive coding features */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1.5 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-4">
                      <motion.div 
                        animate={{ 
                          rotate: [0, 360],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="text-red-500"
                      >
                        <FaFistRaised className="w-5 h-5" />
                      </motion.div>
                      <span className="text-white/80 font-medium">1v1 Code Duels</span>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <motion.div 
                        animate={{ 
                          scale: [1, 1.3, 1]
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        className="text-red-400"
                      >
                        <FaRobot className="w-5 h-5" />
                      </motion.div>
                      <span className="text-white/80 font-medium">AI Code Reviews</span>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <motion.div 
                        animate={{ 
                          y: [0, -5, 0]
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                        className="text-red-300"
                      >
                        <FaTrophy className="w-5 h-5" />
                      </motion.div>
                      <span className="text-white/80 font-medium">Global Leaderboards & Prizes</span>
                    </div>

                    {/* Scroll hint */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: 2.5 }}
                      className="flex items-center space-x-3 mt-8 pt-4"
                    >
                      <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-red-400"
                      >
                        <FaChevronDown className="w-6 h-6" />
                      </motion.div>
                      <span className="text-white/60 text-sm">Discover competitive features</span>
                    </motion.div>
                  </motion.div>
                </motion.div>
                
                {/* Right side - space for globe */}
                <div className="flex-1"></div>
              </div>
            </div>
            
            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 2 }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 pointer-events-auto"
            >
              <button
                onClick={() => parallaxRef.current?.scrollTo(1)}
                className="flex flex-col items-center text-white/70 hover:text-white transition-colors group"
              >
                <span className="text-sm mb-2 font-medium">Scroll to explore</span>
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center group-hover:border-red-400 transition-colors"
                >
                  <div className="w-1 h-3 bg-white/50 rounded-full mt-2 group-hover:bg-red-400 transition-colors"></div>
                </motion.div>
              </button>
            </motion.div>
          </div>
        </ParallaxLayer>

        {/* Hero Section - Page 1 */}
        <ParallaxLayer
          offset={1}
          speed={0.5}
          factor={1}
        >           
          <Hero 
            fadeIn={fadeIn} 
            staggerContainer={staggerContainer} 
            iconVariants={iconVariants} 
          />
        </ParallaxLayer>
        
        {/* Features Section - Page 2 */}
        <ParallaxLayer
          offset={2}
          speed={0.6}
          factor={1}
        >
          <Features 
            fadeIn={fadeIn} 
            staggerContainer={staggerContainer} 
            featureCardVariants={featureCardVariants} 
            iconVariants={iconVariants}
          />
        </ParallaxLayer>
        
        {/* How It Works Section - Page 3 */}
        <ParallaxLayer
          offset={3}
          speed={0.6}
          factor={1}
        >
          <HowItWorks 
            fadeIn={fadeIn} 
            iconVariants={iconVariants}
          />
        </ParallaxLayer>

        {/* Comparison Section - Page 4 */}
        <ParallaxLayer
          offset={4}
          speed={0.6}
          factor={1}
        >
          <Comparison fadeIn={fadeIn} />
        </ParallaxLayer>

        {/* Navigation indicators */}
        <ParallaxLayer 
          sticky={{ start: 0, end: 4 }}
          style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingRight: '2rem', zIndex: 1000 }}
        >
          <div className="hidden md:flex flex-col gap-4">
            {[0, 1, 2, 3, 4].map((page) => (
              <motion.div
                key={page}
                className={`h-4 w-4 rounded-full cursor-pointer transition-all duration-300 relative`}
                whileHover={{ scale: 1.5 }}
                onClick={() => parallaxRef.current?.scrollTo(page)}
                style={{
                  backgroundColor: currentPage === page ? colors.primary : colors.secondary + '60',
                  boxShadow: currentPage === page ? `0 0 15px ${colors.primary}80` : 'none'
                }}
              >
                {/* Page labels on hover */}
                <div className="absolute right-8 top-1/2 transform -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity bg-gray-800 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap pointer-events-none">
                  {page === 0 && "Globe"}
                  {page === 1 && "Hero"}
                  {page === 2 && "Features"}
                  {page === 3 && "How It Works"}
                  {page === 4 && "Comparison"}
                </div>
              </motion.div>
            ))}
          </div>
        </ParallaxLayer>
      </Parallax>

      <div className="fixed bottom-10 right-10 z-[9999]">
        <Link 
          to="/sign-up" 
          className="px-8 py-4 rounded-xl text-lg font-medium transition-all shadow-lg flex items-center group"
          style={{
            backgroundColor: colors.primary,
            color: colors.textPrimary
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = colors.primaryHover;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = colors.primary;
          }}
        >
          Get Started
          <FaArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default WelcomePage;