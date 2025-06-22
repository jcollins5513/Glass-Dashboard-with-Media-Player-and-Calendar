import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Car, Fuel, Gauge, Palette, MapPin } from 'lucide-react';
import { Badge } from './ui/badge';
import { Vehicle } from '../types';

interface VehicleSpec {
  engine: string;
  transmission: string;
  drivetrain: string;
  mpg: string;
  features: string[];
}

const vehicleSpecs: Record<string | number, VehicleSpec> = {
  1: {
    engine: "3.0L Twin-Turbo I6",
    transmission: "8-Speed Automatic",
    drivetrain: "xDrive AWD",
    mpg: "21/26 City/Hwy",
    features: ["Premium Package", "M Sport", "Panoramic Roof", "Harman Kardon Audio"]
  },
  2: {
    engine: "3.0L Turbo V6 + EQBoost",
    transmission: "9G-TRONIC",
    drivetrain: "4MATIC AWD",
    mpg: "20/26 City/Hwy",
    features: ["AMG Line", "MBUX", "Air Suspension", "Burmester Sound"]
  },
  3: {
    engine: "3.0L TFSI V6",
    transmission: "8-Speed Tiptronic",
    drivetrain: "Quattro AWD",
    mpg: "19/25 City/Hwy",
    features: ["Prestige Package", "Virtual Cockpit", "Matrix LED", "Bang & Olufsen"]
  },
  4: {
    engine: "2.4L Hybrid I4",
    transmission: "CVT",
    drivetrain: "AWD",
    mpg: "37/34 City/Hwy",
    features: ["Luxury Package", "Mark Levinson Audio", "Head-Up Display", "Safety System+ 2.0"]
  }
};

interface VehicleDetailsProps {
  currentVehicle: Vehicle | null;
}

export function VehicleDetails({ currentVehicle }: VehicleDetailsProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
  };

  if (!currentVehicle) {
    return (
      <div className="h-full backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 flex items-center justify-center">
        <p className="text-white/70">Loading vehicle details...</p>
      </div>
    );
  }

  const specs = vehicleSpecs[currentVehicle.id as string | number] || vehicleSpecs[1];

  return (
    <div className="h-full backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6">
      {/* Header with Date/Time */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Car className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-white">Vehicle Details</h3>
            <p className="text-white/70 text-sm">Currently Viewing</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center gap-2 text-white/70 text-sm mb-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(currentTime)}</span>
          </div>
          <div className="flex items-center gap-2 text-white text-sm">
            <Clock className="w-3 h-3" />
            <span>{formatTime(currentTime)}</span>
          </div>
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="space-y-4 overflow-y-auto max-h-[calc(100%-120px)]">
        {/* Main Details */}
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <h4 className="text-white mb-2">
            {currentVehicle.year} {currentVehicle.make} {currentVehicle.model}
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-white/70">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>{formatPrice(currentVehicle.price)}</span>
            </div>
            <div className="flex items-center gap-2 text-white/70">
              <Gauge className="w-3 h-3" />
              <span>{currentVehicle.mileage.toLocaleString()} mi</span>
            </div>
            <div className="flex items-center gap-2 text-white/70">
              <Palette className="w-3 h-3" />
              <span>{currentVehicle.color}</span>
            </div>
            <div className="flex items-center gap-2 text-white/70">
              <MapPin className="w-3 h-3" />
              <span>In Stock</span>
            </div>
          </div>
        </div>

        {/* Engine & Performance */}
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <h5 className="text-white text-sm mb-3 flex items-center gap-2">
            <Fuel className="w-3 h-3" />
            Performance
          </h5>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-white/60">Engine:</span>
              <span className="text-white/80">{specs.engine}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Transmission:</span>
              <span className="text-white/80">{specs.transmission}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Drivetrain:</span>
              <span className="text-white/80">{specs.drivetrain}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">MPG:</span>
              <span className="text-white/80">{specs.mpg}</span>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <h5 className="text-white text-sm mb-3">Key Features</h5>
          <div className="flex flex-wrap gap-2">
            {specs.features.map((feature: string, index: number) => (
              <Badge 
                key={index}
                variant="secondary" 
                className="bg-white/10 text-white/80 border-white/20 text-xs"
              >
                {feature}
              </Badge>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-xs">Available Now</span>
          </div>
          <span className="text-white/50 text-xs">ID: VIN{currentVehicle.id.toString().padStart(6, '0')}</span>
        </div>
      </div>
    </div>
  );
}