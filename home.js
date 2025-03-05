import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FaHospital, FaUserMd, FaCalendarCheck, FaFileMedical } from "react-icons/fa";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mt-12">
        <motion.h1
          className="text-4xl font-bold text-blue-600 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Smart Hospital Management on AWS
        </motion.h1>
        <p className="text-gray-700 text-lg mb-6">
          Streamline hospital operations with our cloud-powered management system. Secure, scalable, and efficient.
        </p>
        <Button className="bg-blue-600 text-white px-6 py-3 text-lg rounded-lg shadow-lg hover:bg-blue-700">
          Get Started
        </Button>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 w-full max-w-6xl">
        <FeatureCard icon={<FaHospital />} title="Hospital Admin" description="Manage hospital operations seamlessly." />
        <FeatureCard icon={<FaUserMd />} title="Doctor Panel" description="Provide doctors with efficient workflow tools." />
        <FeatureCard icon={<FaCalendarCheck />} title="Appointments" description="Easy scheduling and patient management." />
        <FeatureCard icon={<FaFileMedical />} title="Medical Records" description="Securely store and access patient records." />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      className="p-6 bg-white shadow-lg rounded-2xl flex flex-col items-center text-center"
      whileHover={{ scale: 1.05 }}
    >
      <div className="text-blue-600 text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}
