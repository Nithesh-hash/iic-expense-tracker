import React from 'react';
import vitLogo from '../assets/vit-logo.png';
import iicLogo from '../assets/iic-logo.jpg';

export default function HeaderLogos() {
  return (
    <div className="flex items-center justify-center gap-6 sm:gap-10 py-2">
      {/* 1. VIT Logo on Left */}
      <div className="flex items-center justify-center">
        <img
          src={vitLogo}
          alt="Vellore Institute of Technology (VIT)"
          className="h-10 sm:h-14 w-auto object-contain"
        />
      </div>

      {/* 2. IIC Logo on Right */}
      <div className="flex items-center justify-center">
        <img
          src={iicLogo}
          alt="Institution's Innovation Council (IIC)"
          className="h-11 sm:h-14 w-auto object-contain"
        />
      </div>
    </div>
  );
}
