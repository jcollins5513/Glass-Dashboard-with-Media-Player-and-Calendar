import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, RotateCcw, Maximize } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Vehicle, VehicleStatus } from '../types';

const mockVehicles: Vehicle[] = [
  {
    id: 1,
    make: "BMW",
    model: "X5 M Sport",
    year: 2024,
    price: 67500,
    mileage: 2450,
    color: "Alpine White",
    type: "video",
    mediaUrl: "https://videos.unsplash.com/photo-1449824913935-59a10b8d2000?fm=mp4&w=1080&h=720",
    duration: 180,
    thumbnail: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop"
  },
  {
    id: 2,
    make: "Mercedes-Benz",
    model: "GLE 450 4MATIC",
    year: 2024,
    price: 72800,
    mileage: 1200,
    color: "Obsidian Black",
    type: "drone",
    mediaUrl: "https://videos.unsplash.com/photo-1507003211169-0a1dd7228f2d?fm=mp4&w=1080&h=720",
    duration: 120,
    thumbnail: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop"
  },
  {
    id: 3,
    make: "Audi",
    model: "Q7 Prestige",
    year: 2024,
    price: 69900,
    mileage: 890,
    color: "Glacier White",
    type: "360",
    mediaUrl: "https://images.unsplash.com/photo-1606611013016-969ae84d8329?w=1200&h=800&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1606611013016-969ae84d8329?w=800&h=600&fit=crop"
  },
  {
    id: 4,
    make: "Lexus",
    model: "RX 350h Luxury",
    year: 2024,
    price: 58400,
    mileage: 3200,
    color: "Atomic Silver",
    type: "photo",
    mediaUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&h=800&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop"
  }
];

interface VideoPlayerProps {
  is360Mode: boolean;
  onVehicleChange: (vehicle: Vehicle) => void;
}

export function VideoPlayer({ is360Mode, onVehicleChange }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState([75]);
  const [currentVehicleIndex, setCurrentVehicleIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentVehicle = mockVehicles[currentVehicleIndex];
  const isVideo = currentVehicle.type === 'video' || currentVehicle.type === 'drone';
  const is360View = is360Mode && currentVehicle.type === '360';

  useEffect(() => {
    onVehicleChange(currentVehicle);
  }, [currentVehicle, onVehicleChange]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && isVideo && currentVehicle.duration) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= currentVehicle.duration!) {
            setIsPlaying(false);
            return currentVehicle.duration!;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isVideo, currentVehicle.duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handlePlayPause = () => {
    if (isVideo) {
      setIsPlaying(!isPlaying);
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
      }
    }
  };

  const handlePrevious = () => {
    if (currentVehicleIndex > 0) {
      setCurrentVehicleIndex(currentVehicleIndex - 1);
      setCurrentTime(0);
      setIsPlaying(false);
    }
  };

  const handleNext = () => {
    if (currentVehicleIndex < mockVehicles.length - 1) {
      setCurrentVehicleIndex(currentVehicleIndex + 1);
      setCurrentTime(0);
      setIsPlaying(false);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const progressPercentage = currentVehicle.duration 
    ? (currentTime / currentVehicle.duration) * 100 
    : 0;

  const getMediaTypeLabel = () => {
    switch (currentVehicle.type) {
      case 'drone': return 'Drone Footage';
      case 'video': return 'Showcase Video';
      case '360': return '360° Interior';
      case 'photo': return 'Gallery Photo';
      default: return 'Media';
    }
  };

  return (
    <div className="h-full backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 flex flex-col">
      {/* Media Display */}
      <div className="flex-1 flex items-center justify-center mb-6 relative">
        <div className="relative w-full max-w-2xl">
          <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black/20">
            {isVideo ? (
              <video
                ref={videoRef}
                src={currentVehicle.mediaUrl}
                poster={currentVehicle.thumbnail}
                className="w-full h-full object-cover"
                muted
                onTimeUpdate={(e) => setCurrentTime(Math.floor(e.currentTarget.currentTime))}
              />
            ) : (
              <ImageWithFallback
                src={is360View ? currentVehicle.mediaUrl : currentVehicle.thumbnail}
                alt={`${currentVehicle.year} ${currentVehicle.make} ${currentVehicle.model}`}
                className={`w-full h-full object-cover ${is360View ? 'cursor-move' : ''}`}
              />
            )}
          </div>
          
          {/* Media Type Badge */}
          <div className="absolute top-4 left-4">
            <div className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
              {getMediaTypeLabel()}
            </div>
          </div>

          {/* Fullscreen Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white hover:bg-black/70"
          >
            <Maximize className="w-4 h-4" />
          </Button>

          {/* 360° Indicator */}
          {is360View && (
            <div className="absolute bottom-4 left-4">
              <div className="bg-blue-500/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                <RotateCcw className="w-3 h-3" />
                360° View
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="text-center mb-6">
        <h2 className="text-white mb-1">
          {currentVehicle.year} {currentVehicle.make} {currentVehicle.model}
        </h2>
        <p className="text-white/70">{formatPrice(currentVehicle.price)} • {currentVehicle.color}</p>
        <p className="text-white/50 text-sm">{currentVehicle.mileage.toLocaleString()} miles</p>
      </div>

      {/* Progress Bar (only for videos) */}
      {isVideo && currentVehicle.duration && (
        <div className="mb-6">
          <div className="relative w-full h-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-white rounded-full transition-all duration-1000"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-white/70 text-sm">{formatTime(currentTime)}</span>
            <span className="text-white/70 text-sm">{formatTime(currentVehicle.duration)}</span>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrevious}
          disabled={currentVehicleIndex === 0}
          className="text-white hover:bg-white/20 disabled:text-white/30"
        >
          <SkipBack className="w-5 h-5" />
        </Button>
        
        {isVideo && (
          <Button
            onClick={handlePlayPause}
            className="w-14 h-14 rounded-full bg-white text-black hover:bg-white/90"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNext}
          disabled={currentVehicleIndex === mockVehicles.length - 1}
          className="text-white hover:bg-white/20 disabled:text-white/30"
        >
          <SkipForward className="w-5 h-5" />
        </Button>
      </div>

      {/* Volume Control (only for videos) */}
      {isVideo && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Volume2 className="w-4 h-4 text-white/70" />
            <Slider
              value={volume}
              onValueChange={setVolume}
              max={100}
              className="flex-1"
            />
          </div>
        </div>
      )}
    </div>
  );
}