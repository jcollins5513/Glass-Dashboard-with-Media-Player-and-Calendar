import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Shuffle, Repeat } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: number;
  artwork: string;
}

const mockTracks: Track[] = [
  {
    id: 1,
    title: "Midnight Dreams",
    artist: "Luna Eclipse",
    album: "Cosmic Waves",
    duration: 245,
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop"
  },
  {
    id: 2,
    title: "Ocean Breeze",
    artist: "Horizon Sound",
    album: "Natural Elements",
    duration: 198,
    artwork: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&h=400&fit=crop"
  }
];

export function MediaPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState([75]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState(false);

  const currentTrack = mockTracks[currentTrackIndex];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= currentTrack.duration) {
            setIsPlaying(false);
            return currentTrack.duration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack.duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
      setCurrentTime(0);
    }
  };

  const handleNext = () => {
    if (currentTrackIndex < mockTracks.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
      setCurrentTime(0);
    }
  };

  const progressPercentage = (currentTime / currentTrack.duration) * 100;

  return (
    <div className="h-full backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 flex flex-col justify-between">
      {/* Album Artwork */}
      <div className="flex-1 flex items-center justify-center mb-6">
        <div className="relative">
          <div className="w-64 h-64 rounded-2xl overflow-hidden shadow-2xl">
            <ImageWithFallback
              src={currentTrack.artwork}
              alt={`${currentTrack.album} artwork`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      </div>

      {/* Track Info */}
      <div className="text-center mb-6">
        <h2 className="text-white mb-1">{currentTrack.title}</h2>
        <p className="text-white/70">{currentTrack.artist}</p>
        <p className="text-white/50 text-sm">{currentTrack.album}</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="relative w-full h-1 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="absolute left-0 top-0 h-full bg-white rounded-full transition-all duration-1000"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-white/70 text-sm">{formatTime(currentTime)}</span>
          <span className="text-white/70 text-sm">{formatTime(currentTrack.duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsShuffled(!isShuffled)}
          className={`text-white hover:bg-white/20 ${isShuffled ? 'text-blue-400' : 'text-white/70'}`}
        >
          <Shuffle className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrevious}
          disabled={currentTrackIndex === 0}
          className="text-white hover:bg-white/20 disabled:text-white/30"
        >
          <SkipBack className="w-5 h-5" />
        </Button>
        
        <Button
          onClick={handlePlayPause}
          className="w-14 h-14 rounded-full bg-white text-black hover:bg-white/90"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNext}
          disabled={currentTrackIndex === mockTracks.length - 1}
          className="text-white hover:bg-white/20 disabled:text-white/30"
        >
          <SkipForward className="w-5 h-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setRepeatMode(!repeatMode)}
          className={`text-white hover:bg-white/20 ${repeatMode ? 'text-blue-400' : 'text-white/70'}`}
        >
          <Repeat className="w-4 h-4" />
        </Button>
      </div>

      {/* Bottom Controls */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsLiked(!isLiked)}
          className={`text-white hover:bg-white/20 ${isLiked ? 'text-red-400' : 'text-white/70'}`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </Button>
        
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
    </div>
  );
}