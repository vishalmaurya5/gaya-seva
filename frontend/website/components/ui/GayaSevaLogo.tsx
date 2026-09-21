import React from 'react';

interface GayaSevaLogoProps {
  className?: string;
  size?: number | string;
  variant?: 'full' | 'icon' | 'badge';
  showText?: boolean;
  textColor?: string;
  subtextColor?: string;
  isDarkBg?: boolean;
  tagline?: string;
}

export const GayaSevaLogo: React.FC<GayaSevaLogoProps> = ({
  className = '',
  size = 48,
  variant = 'full',
  showText = false,
  textColor,
  subtextColor,
  isDarkBg = false,
  tagline,
}) => {
  const numericSize = typeof size === 'number' ? size : parseInt(size.toString(), 10) || 48;

  const logoImage = (
    <div 
      className={`relative inline-block shrink-0 rounded-full overflow-hidden shadow-md ring-2 ring-[#F58220]/50 ring-offset-1 group-hover:scale-105 transition-transform duration-300 ${className}`}
      style={{ width: numericSize, height: numericSize }}
    >
      <img
        src="/icongaya.jpeg"
        alt="GayaSeva Primary Logo"
        width={numericSize}
        height={numericSize}
        className="w-full h-full object-cover object-center"
      />
    </div>
  );

  if (variant === 'icon' || !showText) {
    return logoImage;
  }

  const primaryTextColor = textColor || (isDarkBg ? 'text-white' : 'text-[#2A180B]');
  const tagColor = subtextColor || (isDarkBg ? 'text-[#F6C343]' : 'text-[#C45E00]');

  return (
    <div className="flex items-center gap-2.5 group select-none">
      {logoImage}
      <div className="flex flex-col justify-center">
        <div className="flex items-baseline">
          <span className={`font-serif text-2xl sm:text-3xl font-black tracking-tight ${primaryTextColor} drop-shadow-xs`}>
            Gaya
          </span>
          <span className="font-serif text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-[#D96B00] via-[#E07210] to-[#F58220] bg-clip-text text-transparent drop-shadow-xs ml-0.5">
            Seva
          </span>
        </div>
        <span className={`text-[10px] sm:text-[11.5px] font-bold ${tagColor} leading-tight pt-0.5 font-sans tracking-normal`}>
          {tagline || 'श्रद्धा • सेवा • समर्पण'}
        </span>
      </div>
    </div>
  );
};

export default GayaSevaLogo;
