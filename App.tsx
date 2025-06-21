import React, { useState } from 'react';
import { VideoPlayer } from './components/VideoPlayer';
import { VehicleDetails } from './components/VehicleDetails';
import { NavigationButtons } from './components/NavigationButtons';

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
}

export default function App() {
  const [is360Mode, setIs360Mode] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(null);

  const handleToggle360Mode = () => {
    setIs360Mode(!is360Mode);
  };

  const handleVehicleChange = (vehicle: Vehicle) => {
    setCurrentVehicle(vehicle);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
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
          <VideoPlayer 
            is360Mode={is360Mode} 
            onVehicleChange={handleVehicleChange}
          />
        </div>

        {/* Vehicle Details - Takes up 25% (2x1 grid cell on top right) */}
        <div className="col-span-2 row-span-1">
          <VehicleDetails currentVehicle={currentVehicle} />
        </div>

        {/* Navigation Buttons - Takes up 25% (2x1 grid cell on bottom right) */}
        <div className="col-span-2 row-span-1">
          <NavigationButtons 
            is360Mode={is360Mode}
            onToggle360Mode={handleToggle360Mode}
            currentVehicle={currentVehicle}
          />
        </div>
      </div>

      {/* Floating Elements for Added Glass Effect */}
      <div className="fixed top-8 right-8 w-4 h-4 bg-white/20 rounded-full blur-sm" />
      <div className="fixed bottom-8 left-8 w-6 h-6 bg-white/10 rounded-full blur-sm" />
      <div className="fixed top-1/3 right-1/3 w-2 h-2 bg-white/30 rounded-full blur-sm" />
      
      {/* Dealership Branding */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-full px-4 py-2">
          <p className="text-white/70 text-xs text-center">
            Premium Auto Dealership • Inventory Showcase
          </p>
        </div>
      </div>
    </div>
  );
}