import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const sizes = {
  sm: { width: 32, height: 32 },
  md: { width: 48, height: 48 },
  lg: { width: 64, height: 64 }
};

export default function Logo({ size = 'md', showText = true }: LogoProps) {
  const dimensions = sizes[size];
  
  return (
    <div className="inline-flex items-center space-x-4">
      <div className="flex-shrink-0">
        <Image
          src="/images/logo.png"
          width={size === 'lg' ? 48 : 32}
          height={size === 'lg' ? 48 : 32}
          alt="MediHub"
          className="object-contain"
        />
      </div>
      {showText && (
        <span className="flex-shrink-0 font-semibold text-lg text-blue-700 truncate">
          MediHub
        </span>
      )}
    </div>
  );
} 