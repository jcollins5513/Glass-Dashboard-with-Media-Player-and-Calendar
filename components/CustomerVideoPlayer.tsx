import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, RotateCcw, Maximize } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Vehicle, MediaItem, VehicleStatus } from '../types';

// Mock data that matches the new schema
const mockVehicles: Vehicle[] = [
  {
    id: "clx1a2b3c4d5e6f7g8h9i0",
    stockNumber: "BT2024001",
    vin: "SCBCC7ZA0NC458123",
    year: 2024,
    make: "Bentley",
    model: "Continental GT",
    price: 185500,
    mileage: 450,
    features: ["Premium Package", "Mulliner Specification", "Panoramic Roof", "Bang & Olufsen Audio"],
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1606611013016-969ae84d8329?w=800&h=600&fit=crop"
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    color: "Beluga Black",
    trim: "V8",
    engine: "4.0L Twin-Turbo V8",
    transmission: "8-Speed Dual-Clutch",
    description: "Stunning 2024 Bentley Continental GT in Beluga Black with Mulliner specification. This exceptional grand tourer combines luxury with performance.",
    sourceUrl: "https://example.com/inventory/1",
    bodyStyle: "Coupe",
    vehicleClass: "Luxury",
    status: "available" as const,
    carfaxHighlights: {
      accidents: 0,
      owners: 1,
      serviceRecords: 5
    }
  },
  {
    id: "clx2b3c4d5e6f7g8h9i1j",
    stockNumber: "BT2024002",
    vin: "SCBCC7ZA1NC458124",
    year: 2024,
    make: "Bentley",
    model: "Bentayga",
    price: 165800,
    mileage: 1200,
    features: ["V8 Engine", "Air Suspension", "Panoramic Sunroof", "22\" Alloy Wheels"],
    images: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop"
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    color: "Extreme Silver",
    trim: "V8",
    engine: "4.0L Twin-Turbo V8",
    transmission: "8-Speed Automatic",
    description: "Luxurious 2024 Bentley Bentayga V8 in Extreme Silver. The perfect blend of luxury SUV comfort and Bentley craftsmanship.",
    bodyStyle: "SUV",
    vehicleClass: "SUV",
    status: "available" as const,
    carfaxHighlights: {
      accidents: 0,
      owners: 1,
      serviceRecords: 3
    }
  }
];

const mockMediaItems: MediaItem[] = [
  {
    id: "media1",
    vehicleId: "clx1a2b3c4d5e6f7g8h9i0",
    type: 'video',
    url: 'https://videos.unsplash.com/photo-1449824913935-59a10b8d2000?fm=mp4&w=1080&h=720',
    thumbnail: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop',
    duration: 180,
    title: 'Continental GT Showcase',
    order: 1
  },
  {
    id: "media2",
    vehicleId: "clx1a2b3c4d5e6f7g8h9i0",
    type: 'drone',
    url: 'https://videos.unsplash.com/photo-1507003211169-0a1dd7228f2d?fm=mp4&w=1080&h=720',
    thumbnail: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop',
    duration: 90,
    title: 'Continental GT Aerial View',
    order: 2
  },
  {
    id: "media3",
    vehicleId: "clx1a2b3c4d5e6f7g8h9i0",
    type: '360',
    url: 'https://images.unsplash.com/photo-1606611013016-969ae84d8329?w=1200&h=800&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1606611013016-969ae84d8329?w=400&h=300&fit=crop',
    title: 'Continental GT Interior 360°',
    order: 3
  }
];

interface CustomerVideoPlayerProps {
  is360Mode: boolean;
  onVehicleChange: (vehicle: Vehicle) => void;
  sharedVehicleId?: string;
  sharedMediaIds?: string[];
}

export function CustomerVideoPlayer({ 
  is360Mode, 
  onVehicleChange, 
  sharedVehicleId,
  sharedMediaIds 
}: CustomerVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState([75]);
  const [currentVehicleIndex, setCurrentVehicleIndex] = useState(0);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Filter content based on shared parameters
  const availableVehicles = sharedVehicleId 
    ? mockVehicles.filter(v => v.id === sharedVehicleId)
    : mockVehicles;

  const currentVehicle = availableVehicles[currentVehicleIndex];
  
  const vehicleMedia = currentVehicle 
    ? mockMediaItems.filter(m => {
        const belongsToVehicle = m.vehicleId === currentVehicle.id;
        if (sharedMediaIds && sharedMediaIds.length > 0) {
          return belongsToVehicle && sharedMediaIds.includes(m.id);
        }
        return belongsToVehicle;
      })
    : [];

  const currentMedia = vehicleMedia[currentMediaIndex];
  const isVideo = currentMedia?.type === 'video' || currentMedia?.type === 'drone';
  const is360View = is360Mode && currentMedia?.type === '360';

  useEffect(() => {
    if (currentVehicle) {
      onVehicleChange(currentVehicle);
    }
  }, [currentVehicle, onVehicleChange]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && isVideo && currentMedia?.duration) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= currentMedia.duration!) {
            setIsPlaying(false);
            return currentMedia.duration!;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isVideo, currentMedia]);

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
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(currentMediaIndex - 1);
    } else if (currentVehicleIndex > 0 && !sharedVehicleId) {
      setCurrentVehicleIndex(currentVehicleIndex - 1);
      const prevVehicle = availableVehicles[currentVehicleIndex - 1];
      const prevVehicleMedia = mockMediaItems.filter(m => m.vehicleId === prevVehicle.id);
      setCurrentMediaIndex(prevVehicleMedia.length - 1);
    }
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const handleNext = () => {
    if (currentMediaIndex < vehicleMedia.length - 1) {
      setCurrentMediaIndex(currentMediaIndex + 1);
    } else if (currentVehicleIndex < availableVehicles.length - 1 && !sharedVehicleId) {
      setCurrentVehicleIndex(currentVehicleIndex + 1);
      setCurrentMediaIndex(0);
    }
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const progressPercentage = currentMedia?.duration 
    ? (currentTime / currentMedia.duration) * 100 
    : 0;

  const getMediaTypeLabel = () => {
    if (!currentMedia) return 'No Media';
    switch (currentMedia.type) {
      case 'drone': return 'Drone Footage';
      case 'video': return 'Showcase Video';
      case '360': return '360° Interior';
      case 'photo': return 'Gallery Photo';
      default: return 'Media';
    }
  };

  if (!currentVehicle || !currentMedia) {
    return (
      <div className="h-full backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 flex items-center justify-center">
        <p className="text-white/70">No content available</p>
      </div>
    );
  }

  return (
    <div className="h-full backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 flex flex-col">
      {/* Media Display */}
      <div className="flex-1 flex items-center justify-center mb-6 relative">
        <div className="relative w-full max-w-2xl">
          <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black/20">
            {isVideo ? (
              <video
                ref={videoRef}
                src={currentMedia.url}
                poster={currentMedia.thumbnail}
                className="w-full h-full object-cover"
                muted
                onTimeUpdate={(e) => setCurrentTime(Math.floor(e.currentTarget.currentTime))}
              />
            ) : (
              <ImageWithFallback
                src={is360View ? currentMedia.url : currentMedia.thumbnail}
                alt={currentMedia.title}
                className={`w-full h-full object-cover ${is360View ? 'cursor-move' : ''}`}
              />
            )}
          </div>
          
          {/* Media Counter */}
          <div className="absolute top-4 right-4">
              <div className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm" data-visible={vehicleMedia.length > 1}>
                {currentMediaIndex + 1}/{vehicleMedia.length}
              </div>
            </div>

          {/* Media Type Badge */}
          {vehicleMedia.length > 1 && (
            <div className="absolute top-4 right-4" data-visible={vehicleMedia.length > 1}>
              <div className="bg-blue-500/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center gap-2" data-visible={!!is360View}>
                {currentMediaIndex + 1}/{vehicleMedia.length}
              </div>
            </div>
          )}

          {/* 360° Indicator */}
          {is360View && (
            <div className="absolute bottom-4 left-4">
              <div className="bg-black/50 backdrop-blur-sm p-4 rounded-lg" data-visible={!!is360View}>
                <div className="flex items-center space-x-2">
                  <RotateCcw className="w-3 h-3" />
                  360° View
                </div>
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
        <p className="text-white/50 text-sm">{currentVehicle.mileage.toLocaleString()} miles • Stock: {currentVehicle.stockNumber}</p>
      </div>

      {/* Progress Bar (only for videos) */}
      {isVideo && currentMedia.duration && (
        <div className="mb-6">
          <div className="relative w-full h-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-white rounded-full transition-all duration-1000"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-white/70 text-sm">{formatTime(currentTime)}</span>
            <span className="text-white/70 text-sm">{formatTime(currentMedia.duration)}</span>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrevious}
          disabled={(currentVehicleIndex === 0 && currentMediaIndex === 0) || (sharedVehicleId && currentMediaIndex === 0)}
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
          disabled={
            (currentVehicleIndex === availableVehicles.length - 1 && currentMediaIndex === vehicleMedia.length - 1) ||
            (sharedVehicleId && currentMediaIndex === vehicleMedia.length - 1)
          }
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