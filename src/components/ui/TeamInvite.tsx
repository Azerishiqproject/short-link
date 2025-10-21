"use client";
import React from "react";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";  
export function TeamInvite() {
  const router = useRouter();
  const teamMembers = [
    {
      name: "Jane Doe",
      email: "jane.doe@kisa.link",
      avatar: "👩‍💼",
      color: "bg-purple-100"
    },
    {
      name: "Barry Tone", 
      email: "barry.tone@kisa.link",
      avatar: "👨‍💼",
      color: "bg-green-100",
      status: "Davet Edildi"
    },
    {
      name: "John Doe",
      email: "john.doe@kisa.link", 
      avatar: "👨‍💻",
      color: "bg-orange-100"
    }
  ];

  return (
    <Section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Team Card */}
          <motion.div 
            className="relative order-2 lg:order-1"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {/* Orange Background Shapes */}
              <motion.div 
                className="absolute -top-8 -left-8 w-40 h-40 bg-orange-400 rounded-full opacity-20"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 0.2 }}
                viewport={{ once: true }}
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.3, 0.2]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              ></motion.div>
              <motion.div 
                className="absolute -bottom-4 -right-4 w-32 h-32 bg-orange-300 rounded-full opacity-15"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 0.15 }}
                viewport={{ once: true }}
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: [0.15, 0.25, 0.15]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              ></motion.div>
              <motion.div 
                className="absolute top-1/2 -right-2 w-20 h-20 bg-orange-200 rounded-full opacity-10"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 0.1 }}
                viewport={{ once: true }}
                animate={{ 
                  scale: [1, 1.08, 1],
                  opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ 
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
              ></motion.div>
              
              {/* Team Card */}
              <motion.div 
                className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-8 max-w-md mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              >
                <motion.h3 
                  className="text-2xl font-bold text-gray-900 dark:text-white mb-3"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
                >
                  Davet Edin
                </motion.h3>
                <motion.p 
                  className="text-sm text-gray-600 dark:text-gray-400 mb-8 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
                >
                  Ekip arkadaşlarınızı birlikte çalışmak için davet edin
                </motion.p>
                
                {/* Members Count */}
                <motion.div 
                  className="mb-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 1.0, ease: "easeOut" }}
                >
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                    Üyeler (3/5)
                  </span>
                </motion.div>
                
                {/* Team Members List */}
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
                >
                  {teamMembers.map((member, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 1.4 + index * 0.1, ease: "easeOut" }}
                      whileHover={{ x: 5, scale: 1.02 }}
                    >
                      <motion.div 
                        className={`w-12 h-12 ${member.color} rounded-full flex items-center justify-center text-2xl shadow-sm`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        {member.avatar}
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {member.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {member.email}
                        </div>
                      </div>
                      {member.status && (
                        <motion.span 
                          className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full font-medium whitespace-nowrap"
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: 1.6 + index * 0.1 }}
                        >
                          {member.status}
                        </motion.span>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
                
                {/* Add Member Button */}
                <motion.div 
                  className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 1.8, ease: "easeOut" }}
                >
                  <motion.button 
                    className="w-full text-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    + Yeni üye ekle
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div 
            className="text-center lg:text-left order-1 lg:order-2"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeInOut" }}
          >
            {/* Tag */}
            <motion.div 
              className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              Ekip arkadaşlarınızla işbirliği yapın
            </motion.div>
            
            <motion.h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              Davet Edin & Birlikte Çalışın
            </motion.h2>
            
            <motion.p 
              className="text-lg text-muted-foreground mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            >
              Kısa link yönetimi için ekip arkadaşlarınızı saniyeler içerisinde davet edin. 
              Kısa linklerinizi, Biyografi sayfalarınızı ve QR kodlarınızı birlikte yönetin. 
              Link kısaltma sitemizde ekip üyelerine belirli ayrıcalıklar atanabilir ve 
              farklı çalışma alanlarında çalışabilirler.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  onClick={() => router.push("/register")}
                  className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium"
                >
                  Kayıt Ol
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}

export default TeamInvite;
