import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, RotateCcw, Maximize, Shuffle, List } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  color: string;
  type: 'video' | 'drone' | 'photo' | '360';
  mediaUrl: string;
  duration?: number;
  thumbnail: string;
  stockNumber: string;
}

interface MediaItem {
  id: number;
  vehicleId: number;
  type: 'video' | 'drone' | 'photo' | '360';
  url: string;
  thumbnail: string;
  duration?: number;
  title: string;
}

const mockVehicles: Vehicle[] = [
  {
    id: 1,
    make: "Bentley",
    model: "Continental GT",
    year: 2024,
    price: 185500,
    mileage: 450,
    color: "Beluga Black",
    type: "video",
    mediaUrl: "https://videos.unsplash.com/photo-1449824913935-59a10b8d2000?fm=mp4&w=1080&h=720",
    duration: 180,
    thumbnail: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop",
    stockNumber: "BT2024001"
  },
  {
    id: 2,
    make: "Bentley",
    model: "Bentayga V8",
    year: 2024,
    price: 165800,
    mileage: 1200,
    color: "Extreme Silver",
    type: "drone",
    mediaUrl: "https://videos.unsplash.com/photo-1507003211169-0a1dd7228f2d?fm=mp4&w=1080&h=720",
    duration: 120,
    thumbnail: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop",
    stockNumber: "BT2024002"
  },
  {
    id: 3,
    make: "Bentley",
    model: "Flying Spur",
    year: 2024,
    price: 195900,
    mileage: 890,
    color: "Glacier White",
    type: "360",
    mediaUrl: "https://images.unsplash.com/photo-1606611013016-969ae84d8329?w=1200&h=800&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1606611013016-969ae84d8329?w=800&h=600&fit=crop",
    stockNumber: "BT2024003"
  },
  {
    id: 4,
    make: "Bentley",
    model: "Mulsanne Speed",
    year: 2023,
    price: 225400,
    mileage: 3200,
    color: "Damson",
    type: "photo",
    mediaUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&h=800&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop",
    stockNumber: "BT2023004"
  }
];

const mockMediaItems: MediaItem[] = [
  { id: 1, vehicleId: 1, type: 'video', url: 'https://videos.unsplash.com/photo-1449824913935-59a10b8d2000?fm=mp4&w=1080&h=720', thumbnail: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop', duration: 180, title: 'Continental GT Showcase' },
  { id: 2, vehicleId: 1, type: 'drone', url: 'https://videos.unsplash.com/photo-1507003211169-0a1dd7228f2d?fm=mp4&w=1080&h=720', thumbnail: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop', duration: 90, title: 'Continental GT Aerial' },
  { id: 3, vehicleId: 1, type: '360', url: 'https://images.unsplash.com/photo-1606611013016-969ae84d8329?w=1200&h=800&fit=crop', thumbnail: 'https://images.unsplash.com/photo-1606611013016-969ae84d8329?w=400&h=300&fit=crop', title: 'Continental GT Interior 360°' },
];

interface ShowroomVideoPlayerProps {
  is360Mode: boolean;
  onVehicleChange: (vehicle: Vehicle) => void;
  selectedVehicles: number[];
  onMediaSelect: (media: MediaItem) => void;
  isSlideshow: boolean;
  onSlideshowToggle: () => void;
}

export function ShowroomVideoPlayer({ 
  is360Mode, 
  onVehicleChange, 
  selectedVehicles, 
  onMediaSelect,
  isSlideshow,
  onSlideshowToggle 
}: ShowroomVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState([75]);
  const [currentVehicleIndex, setCurrentVehicleIndex] = useState(0);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [slideshowTimer, setSlideshowTimer] = useState<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Filter vehicles based on selection or show all
  const displayVehicles = selectedVehicles.length > 0 
    ? mockVehicles.filter(v => selectedVehicles.includes(v.id))
    : mockVehicles;

  const currentVehicle = displayVehicles[currentVehicleIndex];
  const vehicleMedia = mockMediaItems.filter(m => m.vehicleId === currentVehicle?.id);
  const currentMedia = vehicleMedia[currentMediaIndex] || null;
  
  const isVideo = currentMedia?.type === 'video' || currentMedia?.type === 'drone';
  const is360View = is360Mode && currentMedia?.type === '360';

  useEffect(() => {
    if (currentVehicle) {
      onVehicleChange(currentVehicle);
    }
  }, [currentVehicle, onVehicleChange]);

  // Slideshow functionality
  useEffect(() => {
    if (isSlideshow) {
      const timer = setInterval(() => {
        handleNext();
      }, 8000); // 8 seconds per slide
      setSlideshowTimer(timer);
      return () => clearInterval(timer);
    } else if (slideshowTimer) {
      clearInterval(slideshowTimer);
      setSlideshowTimer(null);
    }
  }, [isSlideshow, currentVehicleIndex, currentMediaIndex]);

  // Video time tracking
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && isVideo && currentMedia?.duration) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= currentMedia.duration!) {
            setIsPlaying(false);
            if (isSlideshow) {
              handleNext();
            }
            return currentMedia.duration!;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isVideo, currentMedia, isSlideshow]);

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
    } else if (currentVehicleIndex > 0) {
      setCurrentVehicleIndex(currentVehicleIndex - 1);
      setCurrentMediaIndex(0);
    }
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const handleNext = () => {
    if (currentMediaIndex < vehicleMedia.length - 1) {
      setCurrentMediaIndex(currentMediaIndex + 1);
    } else if (currentVehicleIndex < displayVehicles.length - 1) {
      setCurrentVehicleIndex(currentVehicleIndex + 1);
      setCurrentMediaIndex(0);
    } else if (isSlideshow) {
      // Loop back to beginning in slideshow mode
      setCurrentVehicleIndex(0);
      setCurrentMediaIndex(0);
    }
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
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
        <p className="text-white/70">No vehicles selected for display</p>
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
          
          {/* Media Info Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            <div className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
              {getMediaTypeLabel()}
            </div>
            {isSlideshow && (
              <Badge className="bg-red-500/80 text-white animate-pulse">
                LIVE SLIDESHOW
              </Badge>
            )}
          </div>

          {/* Vehicle/Media Counter */}
          <div className="absolute top-4 right-4 flex gap-2">
            <div className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
              {currentVehicleIndex + 1}/{displayVehicles.length} vehicles
            </div>
            <div className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
              {currentMediaIndex + 1}/{vehicleMedia.length} media
            </div>
          </div>

          {/* Fullscreen Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white hover:bg-black/70"
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
          onClick={onSlideshowToggle}
          className={`text-white hover:bg-white/20 ${isSlideshow ? 'bg-red-500/20 text-red-400' : ''}`}
        >
          <Shuffle className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrevious}
          disabled={currentVehicleIndex === 0 && currentMediaIndex === 0}
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
          disabled={!isSlideshow && currentVehicleIndex === displayVehicles.length - 1 && currentMediaIndex === vehicleMedia.length - 1}
          className="text-white hover:bg-white/20 disabled:text-white/30"
        >
          <SkipForward className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => currentMedia && onMediaSelect(currentMedia)}
          className="text-white hover:bg-white/20"
        >
          <List className="w-4 h-4" />
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