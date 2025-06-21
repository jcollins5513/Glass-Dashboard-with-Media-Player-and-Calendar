import React, { useState, useEffect } from 'react';
import { CustomerVideoPlayer } from './components/CustomerVideoPlayer';
import { VehicleDetails } from './components/VehicleDetails';
import { NavigationButtons } from './components/NavigationButtons';
import { ShowroomVideoPlayer } from './components/ShowroomVideoPlayer';
import { ShowroomNavigationButtons } from './components/ShowroomNavigationButtons';
import { Button } from './components/ui/button';
import { Monitor, Users } from 'lucide-react';
import { Vehicle, MediaItem } from './types';
import { isSharedUrl, getSharedData } from './utils/shareUtils';
import exampleImage from 'figma:asset/dada8ef1ad64f0d311c47a8ec5b1cf7ca47dbd1f.png';

export default function App() {
  const [is360Mode, setIs360Mode] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(null);
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [isSlideshow, setIsSlideshow] = useState(false);
  const [viewMode, setViewMode] = useState<'customer' | 'showroom'>('showroom');
  const [isSharedMode, setIsSharedMode] = useState(false);
  const [sharedData, setSharedData] = useState<{vehicleId?: string; mediaIds?: string[]} | null>(null);

  // Check for shared URL on component mount
  useEffect(() => {
    const shared = isSharedUrl();
    if (shared) {
      const data = getSharedData();
      if (data) {
        setIsSharedMode(true);
        setViewMode('customer');
        setSharedData({
          vehicleId: data.vehicleId,
          mediaIds: data.mediaIds
        });
      }
    }
  }, []);

  const handleToggle360Mode = () => {
    setIs360Mode(!is360Mode);
  };

  const handleVehicleChange = (vehicle: Vehicle) => {
    setCurrentVehicle(vehicle);
  };

  const handleVehicleSelectionChange = (vehicleIds: string[]) => {
    setSelectedVehicles(vehicleIds);
  };

  const handleMediaSelect = (media: MediaItem) => {
    console.log('Selected media:', media);
    // In a real app, this would update the current media being displayed
  };

  const handleSlideshowToggle = () => {
    setIsSlideshow(!isSlideshow);
  };

  const toggleViewMode = () => {
    // Don't allow mode switching in shared mode
    if (isSharedMode) return;
    setViewMode(viewMode === 'customer' ? 'showroom' : 'customer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6 relative">
      {/* Brand Logo Overlay - Only for showroom mode */}
      {viewMode === 'showroom' && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
          <img 
            src={exampleImage} 
            alt="Bentley Supercenter Logo"
            className="w-96 h-auto opacity-5 select-none"
          />
        </div>
      )}

      {/* View Mode Toggle - Hidden in shared mode */}
      {!isSharedMode && (
        <div className="fixed top-4 right-4 z-30">
          <Button
            onClick={toggleViewMode}
            variant="ghost"
            className="backdrop-blur-sm bg-white/10 border border-white/20 text-white hover:bg-white/20"
          >
            {viewMode === 'customer' ? (
              <>
                <Monitor className="w-4 h-4 mr-2" />
                Switch to Showroom
              </>
            ) : (
              <>
                <Users className="w-4 h-4 mr-2" />
                Switch to Customer
              </>
            )}
          </Button>
        </div>
      )}

      {/* Shared Mode Indicator */}
      {isSharedMode && (
        <div className="fixed top-4 right-4 z-30">
          <div className="backdrop-blur-sm bg-green-500/20 border border-green-500/40 text-green-400 px-4 py-2 rounded-full text-sm">
            Customer View • Shared Content
          </div>
        </div>
      )}

      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-slate-600/10 rounded-full blur-3xl" />
      </div>

      {/* Main Dashboard Grid */}
      <div className="relative z-10 h-[calc(100vh-3rem)] grid grid-cols-4 grid-rows-2 gap-6">
        {/* Video Player - Takes up 50% (2x2 grid cells) */}
        <div className="col-span-2 row-span-2">
          {viewMode === 'showroom' ? (
            <ShowroomVideoPlayer 
              is360Mode={is360Mode} 
              onVehicleChange={handleVehicleChange}
              selectedVehicles={selectedVehicles}
              onMediaSelect={handleMediaSelect}
              isSlideshow={isSlideshow}
              onSlideshowToggle={handleSlideshowToggle}
            />
          ) : (
            <CustomerVideoPlayer 
              is360Mode={is360Mode} 
              onVehicleChange={handleVehicleChange}
              sharedVehicleId={sharedData?.vehicleId}
              sharedMediaIds={sharedData?.mediaIds}
            />
          )}
        </div>

        {/* Vehicle Details - Takes up 25% (2x1 grid cell on top right) */}
        <div className="col-span-2 row-span-1">
          <VehicleDetails currentVehicle={currentVehicle} />
        </div>

        {/* Navigation Buttons - Takes up 25% (2x1 grid cell on bottom right) */}
        <div className="col-span-2 row-span-1">
          {viewMode === 'showroom' ? (
            <ShowroomNavigationButtons 
              selectedVehicles={selectedVehicles}
              onVehicleSelectionChange={handleVehicleSelectionChange}
              currentVehicle={currentVehicle}
              onMediaSelect={handleMediaSelect}
              isSlideshow={isSlideshow}
              onSlideshowToggle={handleSlideshowToggle}
            />
          ) : (
            <NavigationButtons 
              is360Mode={is360Mode}
              onToggle360Mode={handleToggle360Mode}
              currentVehicle={currentVehicle}
            />
          )}
        </div>
      </div>

      {/* Floating Elements for Added Glass Effect */}
      <div className="fixed top-8 right-8 w-4 h-4 bg-white/20 rounded-full blur-sm" />
      <div className="fixed bottom-8 left-8 w-6 h-6 bg-white/10 rounded-full blur-sm" />
      <div className="fixed top-1/3 right-1/3 w-2 h-2 bg-white/30 rounded-full blur-sm" />
      
      {/* Status Bar - Conditional based on view mode */}
      {viewMode === 'showroom' && (
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
      )}

      {/* Footer Branding */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-full px-4 py-2">
          <p className="text-white/70 text-xs text-center flex items-center gap-2">
            <img 
              src={exampleImage} 
              alt="Bentley Logo"
              className="w-4 h-auto opacity-70"
            />
            {viewMode === 'showroom' 
              ? 'Inventory Management System' 
              : isSharedMode 
                ? 'Bentley Supercenter • Premium Automotive' 
                : 'Premium Auto Dealership • Inventory Showcase'
            }
          </p>
        </div>
      </div>
    </div>
  );
}