'use client'
import React, { useState, useEffect } from 'react';

interface ProfileCardProps {
  avatarUrl: string;
  name: string;
  username: string;
  bio?: string;
  stats?: {
    followers?: number;
    views?: number;
    posts?: number;
    engagement?: number;
    growth?: number;
  };
  className?: string;
  enableTilt?: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  avatarUrl,
  name,
  username,
  bio = "Building the future of creator tools",
  stats,
  className = '',
  enableTilt = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=200&background=0ea5e9&color=ffffff`;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!enableTilt) return;
    
    const card = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - card.left) / card.width) * 100;
    const y = ((e.clientY - card.top) / card.height) * 100;
    setMousePosition({ x, y });
    
    // Calculate tilt effect
    const tiltX = (y - 50) / 25;
    const tiltY = (50 - x) / 25;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    if (enableTilt) {
      setTilt({ x: 0, y: 0 });
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Main Card */}
      <div 
        className={`relative transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: enableTilt ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` : 'none',
          transition: 'transform 0.1s ease-out'
        }}
      >
        {/* Card Container */}
        <div className="relative bg-white border border-slate-200 rounded-3xl shadow-lg overflow-hidden">
          <div className="p-6">
            {/* Header */}
            <div className="text-center mb-6">
              {/* Avatar Container */}
              <div className="relative inline-block mb-4">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full border-2 border-white overflow-hidden shadow-md mx-auto">
                  <img
                    src={avatarUrl}
                    alt={name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = fallbackAvatar;
                    }}
                  />
                </div>
              </div>

              {/* Name & Username */}
              <h2 className="text-xl font-bold text-slate-800 mb-1">
                {name}
              </h2>
              <p className="text-slate-500 text-sm mb-3">
                @{username}
              </p>
              
              {/* Bio */}
              {bio && (
                <p className="text-slate-600 text-sm leading-relaxed max-w-xs mx-auto">
                  {bio}
                </p>
              )}
            </div>

            {/* Stats Grid */}
            {(stats && (stats.followers !== undefined || stats.views !== undefined || stats.posts !== undefined)) ? (
              <div className="grid grid-cols-3 gap-2 mb-4">
                {stats.followers !== undefined && (
                  <div 
                    key="followers"
                    className="text-center p-3 rounded-xl bg-slate-50 border border-slate-100"
                  >
                    <div className="text-lg font-bold text-slate-800 mb-1">
                      {stats.followers.toLocaleString()}
                    </div>
                    <div className="text-slate-500 text-xs">Followers</div>
                  </div>
                )}
                {stats.views !== undefined && (
                  <div 
                    key="views"
                    className="text-center p-3 rounded-xl bg-slate-50 border border-slate-100"
                  >
                    <div className="text-lg font-bold text-slate-800 mb-1">
                      {stats.views.toLocaleString()}
                    </div>
                    <div className="text-slate-500 text-xs">Views</div>
                  </div>
                )}
                {stats.posts !== undefined && (
                  <div 
                    key="posts"
                    className="text-center p-3 rounded-xl bg-slate-50 border border-slate-100"
                  >
                    <div className="text-lg font-bold text-slate-800 mb-1">
                      {stats.posts.toLocaleString()}
                    </div>
                    <div className="text-slate-500 text-xs">Posts</div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;