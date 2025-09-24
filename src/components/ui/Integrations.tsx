"use client";
import React from "react";
import { Section } from "@/components/ui/Section";
import { motion } from "framer-motion";
import { 
  FaSlack, 
  FaWordpress, 
  FaTwitter, 
  FaSnapchat, 
  FaLinkedin, 
  FaPinterest, 
  FaTiktok,
  FaGoogle,
  FaFacebook,
  FaReddit,
  FaBolt
} from "react-icons/fa";
import { 
  SiZapier, 
  SiGoogletagmanager, 
  SiGoogleanalytics, 
  SiQuora, 
  SiAdroll
} from "react-icons/si";
import { TbBrandBing } from "react-icons/tb";

export function Integrations() {
  const integrations = [
    { name: "Slack", icon: FaSlack, color: "#4A154B" },
    { name: "Zapier", icon: SiZapier, color: "#FF4A00" },
    { name: "Google Tag Manager", icon: SiGoogletagmanager, color: "#246FDB" },
    { name: "Facebook", icon: FaFacebook, color: "#1877F2" },
    { name: "WordPress", icon: FaWordpress, color: "#21759B" },
    { name: "Shortcuts", icon: FaBolt, color: "#007AFF" },
    { name: "Twitter", icon: FaTwitter, color: "#1DA1F2" },
    { name: "Snapchat", icon: FaSnapchat, color: "#FFFC00" },
    { name: "Bing", icon: TbBrandBing, color: "#0078D4" },
    { name: "Reddit", icon: FaReddit, color: "#FF4500" },
    { name: "Google Analytics", icon: SiGoogleanalytics, color: "#F4B400" },
    { name: "LinkedIn", icon: FaLinkedin, color: "#0077B5" },
    { name: "Pinterest", icon: FaPinterest, color: "#BD081C" },
    { name: "Quora", icon: SiQuora, color: "#B92B27" },
    { name: "TikTok", icon: FaTiktok, color: "#000000" },
    { name: "Adroll", icon: SiAdroll, color: "#4A90E2" }
  ];

  // Network diagram için pozisyonları hesapla
  const centerX = 50;
  const centerY = 50;
  const radius = 42;
  const nodeRadius = 4;

  const positionedIntegrations = integrations.map((integration, index) => {
    const angle = (index / integrations.length) * Math.PI * 2 - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return {
      ...integration,
      x,
      y,
      angle
    };
  });

  return (
    <Section className="py-16 sm:py-20 overflow-x-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <motion.h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.1, ease: "easeInOut" }}
          >
            Entegrasyonlar
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.2, ease: "easeInOut" }}
          >
            Kısaltılmış linklerinizi 16 farklı platform ile entegre ederek 
            iş akışınızı kolaylaştırın ve analiz detaylarınızı paylaşın.
          </motion.p>
        </motion.div>

        {/* Network Diagram */}
        <motion.div 
          className="relative w-full h-[500px] bg-gradient-to-br from-white to-gray-100 dark:from-purple-900/20 dark:to-indigo-900/30 rounded-3xl p-8 flex items-center justify-center overflow-hidden border border-white/20 dark:border-purple-500/20"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3, ease: "easeInOut" }}
          whileHover={{ scale: 1.005 }}
        >
          {/* Background Pattern */}
          <motion.div 
            className="absolute inset-0 opacity-5 dark:opacity-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.05 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, #6366f1 2px, transparent 2px),
                              radial-gradient(circle at 75% 75%, #8b5cf6 2px, transparent 2px)`,
              backgroundSize: '50px 50px'
            }} />
          </motion.div>

          <svg viewBox="0 0 100 100" className="w-full h-full relative z-10">
            {/* Connection lines - behind center node */}
            {positionedIntegrations.map((integration, index) => (
              <motion.line
                key={`line-${index}`}
                x1={centerX}
                y1={centerY}
                x2={integration.x}
                y2={integration.y}
                stroke="url(#lineGradient)"
                strokeWidth="0.8"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.7 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: index * 0.08 }}
              />
            ))}
            
            {/* Center node */}
            <motion.circle
              cx={centerX}
              cy={centerY}
              r={nodeRadius * 2.5}
              fill="url(#centerGradient)"
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, delay: 1.0 }}
              className="drop-shadow-lg"
              whileHover={{ scale: 1.1 }}
            />
            
            {/* Center text */}
            <motion.text
              x={centerX}
              y={centerY + 0.8}
              fontSize="2.5"
              fill="white"
              textAnchor="middle"
              className="pointer-events-none font-bold"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
            >
              S
            </motion.text>
            
            {/* Integration nodes with logos */}
            {positionedIntegrations.map((integration, index) => {
              const IconComponent = integration.icon;
              return (
                <motion.g
                  key={integration.name}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200, 
                    delay: 1.4 + index * 0.05 
                  }}
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  className="cursor-pointer"
                >
                  {/* Background circle */}
                  <circle
                    cx={integration.x}
                    cy={integration.y}
                    r={nodeRadius * 2}
                    fill="white"
                    className="drop-shadow-lg"
                  />
                  
                  {/* Brand colored circle */}
                  <circle
                    cx={integration.x}
                    cy={integration.y}
                    r={nodeRadius * 1.5}
                    fill={integration.color}
                  />
                  
                  {/* Icon */}
                  <foreignObject
                    x={integration.x - nodeRadius * 0.8}
                    y={integration.y - nodeRadius * 0.8}
                    width={nodeRadius * 1.6}
                    height={nodeRadius * 1.6}
                    className="pointer-events-none"
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <IconComponent 
                        size={nodeRadius * 1.6} 
                        className="text-white" 
                      />
                    </div>
                  </foreignObject>
                  
                </motion.g>
              );
            })}
            
            {/* Gradients */}
            <defs>
              <linearGradient id="centerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      </div>
    </Section>
  );
}

export default Integrations;
