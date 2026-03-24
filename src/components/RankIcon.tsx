import React from 'react';
import { CAASPPLevel } from '../types';

interface RankIconProps {
  level: CAASPPLevel;
  className?: string;
}

export default function RankIcon({ level, className = "w-16 h-16" }: RankIconProps) {
  switch (level) {
    case "Challenger":
      return (
        <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0px 4px 4px rgba(0,0,0,0.3))' }}>
          {/* Bronze Shield */}
          <path d="M25 20 L75 20 L75 45 C75 70 50 90 50 90 C50 90 25 70 25 45 Z" fill="url(#bronzeGrad)" stroke="#4A2B18" strokeWidth="3" strokeLinejoin="round"/>
          {/* Shield Inner Detail */}
          <path d="M30 25 L70 25 L70 45 C70 65 50 82 50 82 C50 82 30 65 30 45 Z" fill="url(#bronzeLightGrad)"/>
          {/* Sword Handle */}
          <rect x="46" y="5" width="8" height="15" fill="#333" rx="2"/>
          <path d="M35 20 L65 20 L65 26 L35 26 Z" fill="#4A2B18" rx="2"/>
          {/* Sword Blade */}
          <path d="M45 26 L55 26 L50 85 Z" fill="url(#ironGrad)" stroke="#4B5563" strokeWidth="1.5"/>
          <path d="M50 26 L55 26 L50 85 Z" fill="#F3F4F6" opacity="0.6"/>
          
          <defs>
            <linearGradient id="bronzeGrad" x1="0" y1="0" x2="100" y2="100">
              <stop offset="0%" stopColor="#8B5A2B" />
              <stop offset="100%" stopColor="#5C3A21" />
            </linearGradient>
            <linearGradient id="bronzeLightGrad" x1="0" y1="0" x2="100" y2="100">
              <stop offset="0%" stopColor="#A67B5B" />
              <stop offset="100%" stopColor="#7A4B31" />
            </linearGradient>
            <linearGradient id="ironGrad" x1="0" y1="0" x2="100" y2="100">
              <stop offset="0%" stopColor="#D1D5DB" />
              <stop offset="100%" stopColor="#9CA3AF" />
            </linearGradient>
          </defs>
        </svg>
      );
    case "Duelist":
      return (
        <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0px 4px 4px rgba(0,0,0,0.3))' }}>
          {/* Silver Ring Shield */}
          <circle cx="50" cy="50" r="35" fill="url(#silverGrad)" stroke="#374151" strokeWidth="3"/>
          <circle cx="50" cy="50" r="22" fill="#1F2937" stroke="#374151" strokeWidth="3"/>
          {/* Sword Handle */}
          <rect x="46" y="5" width="8" height="15" fill="#111827" rx="2"/>
          <path d="M35 20 L65 20 L65 26 L35 26 Z" fill="#4B5563" rx="2"/>
          <circle cx="50" cy="5" r="4" fill="#60A5FA"/>
          {/* Sword Blade */}
          <path d="M43 26 L57 26 L50 90 Z" fill="url(#silverLightGrad)" stroke="#4B5563" strokeWidth="1.5"/>
          <path d="M50 26 L57 26 L50 90 Z" fill="#FFFFFF" opacity="0.6"/>
          
          <defs>
            <linearGradient id="silverGrad" x1="0" y1="0" x2="100" y2="100">
              <stop offset="0%" stopColor="#E5E7EB" />
              <stop offset="100%" stopColor="#9CA3AF" />
            </linearGradient>
            <linearGradient id="silverLightGrad" x1="0" y1="0" x2="100" y2="100">
              <stop offset="0%" stopColor="#F9FAFB" />
              <stop offset="100%" stopColor="#D1D5DB" />
            </linearGradient>
          </defs>
        </svg>
      );
    case "Elite":
      return (
        <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0px 4px 4px rgba(0,0,0,0.3))' }}>
          {/* Gold Round Shield */}
          <circle cx="50" cy="50" r="38" fill="url(#goldGrad)" stroke="#92400E" strokeWidth="3"/>
          <circle cx="50" cy="50" r="28" fill="url(#goldLightGrad)" stroke="#B45309" strokeWidth="2"/>
          {/* Sword Handle */}
          <rect x="46" y="5" width="8" height="15" fill="#451A03" rx="2"/>
          <path d="M32 20 L68 20 L68 26 L32 26 Z" fill="#B45309" rx="2"/>
          <circle cx="50" cy="5" r="5" fill="#FBBF24"/>
          {/* Sword Blade */}
          <path d="M42 26 L58 26 L50 95 Z" fill="url(#goldLightGrad)" stroke="#92400E" strokeWidth="1.5"/>
          <path d="M50 26 L58 26 L50 95 Z" fill="#FEF3C7" opacity="0.6"/>
          
          <defs>
            <linearGradient id="goldGrad" x1="0" y1="0" x2="100" y2="100">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
            <linearGradient id="goldLightGrad" x1="0" y1="0" x2="100" y2="100">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
        </svg>
      );
    case "Gladiator":
      return (
        <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0px 4px 4px rgba(0,0,0,0.4))' }}>
          {/* Crossed Swords (Back) */}
          <g stroke="#0284C7" strokeWidth="1.5">
            {/* Sword 1 */}
            <path d="M15 15 L25 15 L85 85 L75 85 Z" fill="url(#diamondLightGrad)"/>
            <path d="M10 25 L30 5 L35 10 L15 30 Z" fill="#0284C7"/>
            <circle cx="20" cy="15" r="3" fill="#BAE6FD"/>
            {/* Sword 2 */}
            <path d="M85 15 L75 15 L15 85 L25 85 Z" fill="url(#diamondLightGrad)"/>
            <path d="M90 25 L70 5 L65 10 L85 30 Z" fill="#0284C7"/>
            <circle cx="80" cy="15" r="3" fill="#BAE6FD"/>
          </g>
          
          {/* Diamond Shield */}
          <path d="M50 20 L85 45 L50 95 L15 45 Z" fill="url(#diamondGrad)" stroke="#0C4A6E" strokeWidth="3" strokeLinejoin="round"/>
          <path d="M50 28 L75 48 L50 85 L25 48 Z" fill="url(#diamondLightGrad)"/>
          <path d="M50 28 L75 48 L50 85 Z" fill="#FFFFFF" opacity="0.4"/>
          
          <defs>
            <linearGradient id="diamondGrad" x1="0" y1="0" x2="100" y2="100">
              <stop offset="0%" stopColor="#0EA5E9" />
              <stop offset="100%" stopColor="#0369A1" />
            </linearGradient>
            <linearGradient id="diamondLightGrad" x1="0" y1="0" x2="100" y2="100">
              <stop offset="0%" stopColor="#7DD3FC" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
          </defs>
        </svg>
      );
  }
}
