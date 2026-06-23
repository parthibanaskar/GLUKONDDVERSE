import Image from 'next/image';

interface AppLogoProps {
  size?: number;
  className?: string;
  onClick?: () => void;
}

export default function AppLogo({ size = 64, className = '', onClick }: AppLogoProps) {
  return (
    <div
      className={`flex items-center justify-center ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''} ${className}`}
      onClick={onClick}
      style={{ width: size, height: size, position: 'relative' }}
    >
      <Image
        src="/logo.gif"
        alt="GlukonddVerse Logo"
        width={size}
        height={size}
        className="object-contain"
        priority
        unoptimized
      />
    </div>
  );
}
