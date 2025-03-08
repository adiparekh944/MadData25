import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Camera, Image, Share } from 'lucide-react';
import Spline from "@splinetool/react-spline";

const Home = () => {
  const containerRef = useRef(null);
  const sectionsRef = useRef(null);

  const { scrollY } = useScroll();
  const { scrollYProgress } = useScroll({
    target: sectionsRef,
    offset: ["start start", "end start"]
  });

  const SCROLL_THRESHOLD = 800; // pixels

  const currentSection = useTransform(
    scrollY,
    value => {
      if (value < SCROLL_THRESHOLD) return 0;
      const adjustedScroll = (value - SCROLL_THRESHOLD) / (window.innerHeight * 2);
      return Math.min(Math.max(adjustedScroll * sections.length, 0), sections.length - 1);
    }
  );

  const getSectionOpacity = (index) => useTransform(
    scrollY,
    value => {
      if (value < SCROLL_THRESHOLD) return index === 0 ? 1 : 0;
      const adjustedScroll = (value - SCROLL_THRESHOLD) / (window.innerHeight * 2);
      const sectionProgress = adjustedScroll * sections.length;
      
      // Keep last section visible
      if (index === sections.length - 1 && sectionProgress >= sections.length - 1) {
        return 1;
      }
      
      return Math.max(0, 1 - Math.abs(sectionProgress - index));
    }
  );

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]);

  const sections = [
    {
      title: "Scan",
      description: "placeholder text. Soham loves cs400",
      icon: Camera,
      color: "from-blue-600 to-purple-600",
      image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&q=80"
    },
    {
      title: "Value",
      description: "Arnav loves to cuddle with furries",
      icon: Share,
      color: "from-emerald-600 to-teal-600",
      image: "https://images.unsplash.com/photo-1493863641943-9b68992a8d07?auto=format&fit=crop&q=80"
    },
    {
      title: "Protect",
      description: "your secret is safe with us.",
      icon: Image,
      color: "from-orange-600 to-pink-600",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80"
    }
  ];

  return (
    <div ref={containerRef}>
      <div className="h-screen relative overflow-hidden">
        <motion.div
          style={{ y, opacity }}
          className="absolute inset-0"
        >
          <div className="w-screen h-screen bg-background items-center">
            <Spline
              scene="https://prod.spline.design/VMVgTOkbPJRNTowR/scene.splinecode"
            />
          </div>
        </motion.div>
      </div>

      {/* Modified parallax section */}
      <div className="h-[300vh] relative">
        <div className="sticky top-0 h-screen w-full bg-background">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              className="absolute inset-0 flex items-center justify-between px-20"
              style={{
                opacity: getSectionOpacity(index)
              }}
            >
              <motion.div className="w-1/2 space-y-6">
                <h2 className="text-4xl font-bold text-black">{section.title}</h2>
                <p className="text-xl text-black">{section.description}</p>
              </motion.div>

              <motion.div className="w-1/2">
                <div className="aspect-square relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={section.image}
                    alt={section.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`p-8 rounded-full bg-gradient-to-br ${section.color}`}>
                      <section.icon className="w-16 h-16 text-white" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Featured Photos</h2>
            <p className="mt-4 text-gray-400">Discover amazing photographs from our community</p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
              'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d',
              'https://images.unsplash.com/photo-1433086966358-54859d0ed716'
            ].map((url, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative h-64 overflow-hidden rounded-lg"
              >
                <img
                  src={url}
                  alt={`Featured photo ${index + 1}`}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;