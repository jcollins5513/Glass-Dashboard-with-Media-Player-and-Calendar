import React from 'react';
import { Calendar, RotateCcw, Star, MessageCircle, ExternalLink, Phone, Globe } from 'lucide-react';
import { Button } from './ui/button';

interface NavigationButtonsProps {
  is360Mode: boolean;
  onToggle360Mode: () => void;
  currentVehicle: any;
}

export function NavigationButtons({ is360Mode, onToggle360Mode, currentVehicle }: NavigationButtonsProps) {
  const handleBookAppointment = () => {
    // In a real app, this would open a booking modal or redirect to booking system
    console.log('Opening appointment booking for:', currentVehicle?.make, currentVehicle?.model);
    // Mock booking action
    alert(`Booking appointment for ${currentVehicle?.year} ${currentVehicle?.make} ${currentVehicle?.model}. A sales representative will contact you shortly!`);
  };

  const handleGoogleReviews = () => {
    // In a real app, this would open the dealership's Google reviews
    window.open('https://www.google.com/search?q=premium+auto+dealership+reviews', '_blank');
  };

  const handleChatbot = () => {
    // Placeholder for future chatbot functionality
    alert('AI Chatbot coming soon! This feature will allow you to ask questions about vehicle specifications, financing options, and more.');
  };

  return (
    <div className="h-full backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
          <Globe className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-white">Quick Actions</h3>
          <p className="text-white/70 text-sm">Dealership tools</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        {/* Book Appointment - Primary CTA */}
        <Button 
          onClick={handleBookAppointment}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 h-12 rounded-2xl"
        >
          <Calendar className="w-4 h-4 mr-3" />
          <div className="text-left flex-1">
            <div className="text-sm">Book Test Drive</div>
            <div className="text-xs opacity-80">Schedule appointment</div>
          </div>
          <ExternalLink className="w-3 h-3 ml-2" />
        </Button>

        {/* 360° Mode Toggle */}
        <Button 
          onClick={onToggle360Mode}
          variant="ghost"
          className={`w-full h-12 rounded-2xl border transition-all ${
            is360Mode 
              ? 'bg-blue-500/20 border-blue-500/40 text-blue-400' 
              : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
          }`}
        >
          <RotateCcw className={`w-4 h-4 mr-3 ${is360Mode ? 'animate-spin' : ''}`} />
          <div className="text-left flex-1">
            <div className="text-sm">{is360Mode ? '360° Mode Active' : '360° Interior'}</div>
            <div className="text-xs opacity-80">
              {is360Mode ? 'Viewing interior' : 'Explore inside'}
            </div>
          </div>
        </Button>

        {/* Google Reviews */}
        <Button 
          onClick={handleGoogleReviews}
          variant="ghost"
          className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 h-12 rounded-2xl"
        >
          <Star className="w-4 h-4 mr-3 text-yellow-400 fill-current" />
          <div className="text-left flex-1">
            <div className="text-sm">Our Reviews</div>
            <div className="text-xs opacity-80">4.8/5 • 247 reviews</div>
          </div>
          <ExternalLink className="w-3 h-3 ml-2" />
        </Button>

        {/* Coming Soon - Chatbot */}
        <div className="relative">
          <Button 
            onClick={handleChatbot}
            variant="ghost"
            className="w-full bg-white/5 text-white/60 border border-white/10 h-12 rounded-2xl cursor-pointer hover:bg-white/10"
          >
            <MessageCircle className="w-4 h-4 mr-3" />
            <div className="text-left flex-1">
              <div className="text-sm">AI Assistant</div>
              <div className="text-xs opacity-60">Ask about this vehicle</div>
            </div>
          </Button>
          
          {/* Coming Soon Badge */}
          <div className="absolute -top-2 -right-2">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full">
              Soon
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="flex items-center justify-between text-white/60 text-xs">
          <div className="flex items-center gap-2">
            <Phone className="w-3 h-3" />
            <span>(555) 123-AUTO</span>
          </div>
          <div>
            <span>Open until 8 PM</span>
          </div>
        </div>
        <p className="text-white/40 text-xs text-center mt-2">
          Premium Auto Dealership
        </p>
      </div>
    </div>
  );
}