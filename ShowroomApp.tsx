import React, { useState } from 'react';
import { ShowroomVideoPlayer } from './components/ShowroomVideoPlayer';
import { VehicleDetails } from './components/VehicleDetails';
import { ShowroomNavigationButtons } from './components/ShowroomNavigationButtons';
// Using public/logo.svg instead of unsupported figma:asset
const exampleImage = '/logo.svg';

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

export default function ShowroomApp() {
  const [is360Mode, setIs360Mode] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(null);
  const [selectedVehicles, setSelectedVehicles] = useState<number[]>([]);
  const [isSlideshow, setIsSlideshow] = useState(false);

  const handleToggle360Mode = () => {
    setIs360Mode(!is360Mode);
  };

  const handleVehicleChange = (vehicle: Vehicle) => {
    setCurrentVehicle(vehicle);
  };

  const handleVehicleSelectionChange = (vehicleIds: number[]) => {
    setSelectedVehicles(vehicleIds);
  };

  const handleMediaSelect = (media: MediaItem) => {
    console.log('Selected media:', media);
    // In a real app, this would update the current media being displayed
  };

  const handleSlideshowToggle = () => {
    setIsSlideshow(!isSlideshow);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6 relative">
      {/* Brand Logo Overlay */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <img 
          src={exampleImage} 
          alt="Bentley Supercenter Logo"
          className="w-96 h-auto opacity-5 select-none"
        />
      </div>

      {/* Background Effects - More automotive themed */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-slate-600/10 rounded-full blur-3xl" />
      </div>

      {/* Main Dashboard Grid */}
      <div className="relative z-10 h-[calc(100vh-3rem)] grid grid-cols-4 grid-rows-2 gap-6">
        {/* Video Player - Takes up 50% (2x2 grid cells) */}
        <div className="col-span-2 row-span-2">
          <ShowroomVideoPlayer 
            is360Mode={is360Mode} 
            onVehicleChange={handleVehicleChange}
            selectedVehicles={selectedVehicles}
            onMediaSelect={handleMediaSelect}
            isSlideshow={isSlideshow}
            onSlideshowToggle={handleSlideshowToggle}
          />
        </div>

        {/* Vehicle Details - Takes up 25% (2x1 grid cell on top right) */}
        <div className="col-span-2 row-span-1">
          <VehicleDetails currentVehicle={currentVehicle} />
        </div>

        {/* Showroom Navigation Buttons - Takes up 25% (2x1 grid cell on bottom right) */}
        <div className="col-span-2 row-span-1">
          <ShowroomNavigationButtons 
            selectedVehicles={selectedVehicles}
            onVehicleSelectionChange={handleVehicleSelectionChange}
            currentVehicle={currentVehicle}
            onMediaSelect={handleMediaSelect}
            isSlideshow={isSlideshow}
            onSlideshowToggle={handleSlideshowToggle}
          />
        </div>
      </div>

      {/* Floating Elements for Added Glass Effect */}
      <div className="fixed top-8 right-8 w-4 h-4 bg-white/20 rounded-full blur-sm" />
      <div className="fixed bottom-8 left-8 w-6 h-6 bg-white/10 rounded-full blur-sm" />
      <div className="fixed top-1/3 right-1/3 w-2 h-2 bg-white/30 rounded-full blur-sm" />
      
      {/* Showroom Status Bar */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-full px-6 py-2 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isSlideshow ? 'bg-red-400 animate-pulse' : 'bg-green-400'}`}></div>
            <span className="text-white/70 text-sm">
              {isSlideshow ? 'Slideshow Active' : 'Manual Mode'}
            </span>
          </div>
          <div className="w-px h-4 bg-white/20"></div>
          <span className="text-white/70 text-sm">
            Bentley Supercenter • Showroom Display
          </span>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-full px-4 py-2">
          <p className="text-white/70 text-xs text-center flex items-center gap-2">
            <img 
              src={exampleImage} 
              alt="Bentley Logo"
              className="w-4 h-auto opacity-70"
            />
            Inventory Management System
          </p>
        </div>
      </div>
    </div>
  );
}