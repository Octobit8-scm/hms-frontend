import Sidebar from '../components/Sidebar';
import Image from 'next/image';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top decorative pattern */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
          <Image
            src="https://www.transparentpng.com/thumb/medical-logo/medical-logo-png-icons-0.png"
            alt="Medical pattern"
            width={256}
            height={256}
            className="object-contain"
          />
        </div>

        {/* Top left decorative element */}
        <div className="absolute top-0 left-72 w-48 h-48 opacity-10">
          <Image
            src="https://www.transparentpng.com/thumb/health/qnHgoE-health-free-download.png"
            alt="Health symbol"
            width={192}
            height={192}
            className="object-contain"
          />
        </div>

        {/* Bottom decorative pattern */}
        <div className="absolute bottom-0 left-1/2 w-96 h-96 opacity-5">
          <Image
            src="https://www.transparentpng.com/thumb/caduceus-medical-symbol/blue-medical-symbol-clipart-png-5.png"
            alt="Medical symbol"
            width={384}
            height={384}
            className="object-contain"
          />
        </div>

        {/* Right side decorative element */}
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-40 h-96 opacity-5">
          <Image
            src="https://www.transparentpng.com/thumb/dna/dna-genome-genetic-transparent-background-12.png"
            alt="DNA Helix"
            width={160}
            height={384}
            className="object-contain"
          />
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-white to-blue-50 p-8 relative">
          {/* Top right medical icon */}
          <div className="absolute top-8 right-8 w-32 h-32 opacity-10">
            <Image
              src="https://www.transparentpng.com/thumb/stethoscope/qhHYf5-stethoscope-clipart-transparent.png"
              alt="Stethoscope"
              width={128}
              height={128}
              className="object-contain"
            />
          </div>

          {/* Bottom left medical icon */}
          <div className="absolute bottom-8 left-8 w-24 h-24 opacity-10">
            <Image
              src="https://www.transparentpng.com/thumb/medical-logo/red-cross-medical-logo-clipart-16.png"
              alt="Medical Cross"
              width={96}
              height={96}
              className="object-contain"
            />
          </div>
          
          {/* Content container with enhanced styling */}
          <div className="relative bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-blue-100">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-transparent rounded-xl pointer-events-none" />
            {children}
          </div>
        </main>

        {/* Footer pattern */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 opacity-20" />
      </div>
    </div>
  );
} 