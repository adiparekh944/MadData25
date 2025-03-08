import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Heart, Globe } from 'lucide-react';

const About = () => {
  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80',
      bio: 'Photography enthusiast with 10+ years of experience in digital media.'
    },
    {
      name: 'Michael Chen',
      role: 'Lead Developer',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80',
      bio: 'Full-stack developer passionate about creating intuitive user experiences.'
    },
    {
      name: 'Emma Williams',
      role: 'Creative Director',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80',
      bio: 'Award-winning designer with a keen eye for detail and composition.'
    }
  ];

  return (
    <div className="min-h-screen pt-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-white">About PhotoShare</h1>
          <p className="mt-4 text-xl text-gray-400">
            We're passionate about bringing photographers together
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            {
              icon: <Camera className="h-8 w-8" />,
              title: 'Share Your Vision',
              description: 'Upload and showcase your best photographs to a global audience'
            },
            {
              icon: <Heart className="h-8 w-8" />,
              title: 'Connect with Others',
              description: 'Join a community of passionate photographers and artists'
            },
            {
              icon: <Globe className="h-8 w-8" />,
              title: 'Global Reach',
              description: 'Your work can be seen and appreciated by people worldwide'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="text-center p-6 bg-gray-800 rounded-xl"
            >
              <div className="inline-flex items-center justify-center p-3 bg-gray-700 rounded-full mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="text-center bg-gray-800 p-6 rounded-xl"
              >
                <div className="relative w-48 h-48 mx-auto mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="rounded-full w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-white">{member.name}</h3>
                <p className="text-gray-400 mb-2">{member.role}</p>
                <p className="text-gray-500">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;