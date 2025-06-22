import React, { useState } from 'react';
import { Facebook, Car, Image, Share2, Users, CheckCircle, Plus, Link, Copy } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { Vehicle, MediaItem, ShareData } from '../types';
import { generateShareUrl, copyToClipboard } from '../utils/shareUtils';

const mockVehicles = [
  { id: "clx1a2b3c4d5e6f7g8h9i0", make: "Bentley", model: "Continental GT", year: 2024, stockNumber: "BT2024001" },
  { id: "clx2b3c4d5e6f7g8h9i1j", make: "Bentley", model: "Bentayga", year: 2024, stockNumber: "BT2024002" },
  { id: "clx3c4d5e6f7g8h9i2jk", make: "Bentley", model: "Flying Spur", year: 2024, stockNumber: "BT2024003" },
  { id: "clx4d5e6f7g8h9i3jkl", make: "Bentley", model: "Mulsanne Speed", year: 2023, stockNumber: "BT2023004" },
];

const mockMediaItems = [
  { id: "media1", vehicleId: "clx1a2b3c4d5e6f7g8h9i0", type: 'video' as const, url: '', thumbnail: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop', title: 'Continental GT Showcase' },
  { id: "media2", vehicleId: "clx1a2b3c4d5e6f7g8h9i0", type: 'drone' as const, url: '', thumbnail: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop', title: 'Continental GT Aerial' },
  { id: "media3", vehicleId: "clx1a2b3c4d5e6f7g8h9i0", type: '360' as const, url: '', thumbnail: 'https://images.unsplash.com/photo-1606611013016-969ae84d8329?w=400&h=300&fit=crop', title: 'Continental GT Interior 360°' },
  { id: "media4", vehicleId: "clx2b3c4d5e6f7g8h9i1j", type: 'video' as const, url: '', thumbnail: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop', title: 'Bentayga V8 Showcase' },
  { id: "media5", vehicleId: "clx2b3c4d5e6f7g8h9i1j", type: 'photo' as const, url: '', thumbnail: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop', title: 'Bentayga V8 Gallery' },
];

interface ShowroomNavigationButtonsProps {
  selectedVehicles: string[];
  onVehicleSelectionChange: (vehicleIds: string[]) => void;
  currentVehicle: Vehicle | null;
  onMediaSelect: (media: MediaItem) => void;
  isSlideshow: boolean;
  onSlideshowToggle: () => void;
}

export function ShowroomNavigationButtons({ 
  selectedVehicles, 
  onVehicleSelectionChange, 
  currentVehicle,
  onMediaSelect,
  isSlideshow,
  onSlideshowToggle
}: ShowroomNavigationButtonsProps) {
  const [isVehicleDialogOpen, setIsVehicleDialogOpen] = useState(false);
  const [isMediaDialogOpen, setIsMediaDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [selectedMediaForShare, setSelectedMediaForShare] = useState<string[]>([]);
  const [shareUrl, setShareUrl] = useState('');

  const handlePostToFacebook = () => {
    const vehicleText = currentVehicle 
      ? `Check out this stunning ${currentVehicle.year} ${currentVehicle.make} ${currentVehicle.model}!`
      : 'Check out our luxury vehicle inventory!';
    
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(vehicleText + ' #BentleySupercenter #LuxuryCars')}`;
    
    window.open(facebookUrl, '_blank', 'width=600,height=400');
    toast.success('Opening Facebook sharing dialog...');
  };

  const handleVehicleToggle = (vehicleId: string) => {
    const newSelection = selectedVehicles.includes(vehicleId)
      ? selectedVehicles.filter(id => id !== vehicleId)
      : [...selectedVehicles, vehicleId];
    
    onVehicleSelectionChange(newSelection);
    toast.success(`Vehicle ${selectedVehicles.includes(vehicleId) ? 'removed from' : 'added to'} slideshow`);
  };

  const handleSelectAllVehicles = () => {
    const allIds = mockVehicles.map(v => v.id);
    onVehicleSelectionChange(allIds);
    toast.success('All vehicles selected for slideshow');
  };

  const handleClearSelection = () => {
    onVehicleSelectionChange([]);
    toast.success('Vehicle selection cleared');
  };

  const handleGenerateShareUrl = () => {
    if (!currentVehicle) {
      toast.error('Please select a vehicle first');
      return;
    }

    const shareData: ShareData = {
      vehicleId: currentVehicle.id,
      mediaIds: selectedMediaForShare.length > 0 ? selectedMediaForShare : undefined,
      type: selectedMediaForShare.length > 0 ? 'media' : 'vehicle',
      timestamp: Date.now()
    };

    const url = generateShareUrl(shareData);
    setShareUrl(url);
    toast.success('Share URL generated successfully!');
  };

  const handleCopyShareUrl = async () => {
    try {
      await copyToClipboard(shareUrl);
      toast.success('Share URL copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy URL to clipboard');
    }
  };

  const handleMediaToggleForShare = (mediaId: string) => {
    setSelectedMediaForShare(prev => 
      prev.includes(mediaId) 
        ? prev.filter(id => id !== mediaId)
        : [...prev, mediaId]
    );
  };

  const currentVehicleMedia = currentVehicle 
    ? mockMediaItems.filter(m => m.vehicleId === currentVehicle.id)
    : [];

  return (
    <div className="h-full backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
          <Share2 className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-white">Showroom Tools</h3>
          <p className="text-white/70 text-sm">Marketing & Display</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        {/* Post to Facebook */}
        <Button 
          onClick={handlePostToFacebook}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 h-12 rounded-2xl"
        >
          <Facebook className="w-4 h-4 mr-3" />
          <div className="text-left flex-1">
            <div className="text-sm">Post to Facebook</div>
            <div className="text-xs opacity-80">Share current vehicle</div>
          </div>
        </Button>

        {/* Vehicle Selection */}
        <Dialog open={isVehicleDialogOpen} onOpenChange={setIsVehicleDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="ghost"
              className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 h-12 rounded-2xl"
            >
              <Car className="w-4 h-4 mr-3" />
              <div className="text-left flex-1">
                <div className="text-sm">Vehicle Selection</div>
                <div className="text-xs opacity-80">
                  {selectedVehicles.length} vehicles selected
                </div>
              </div>
              {selectedVehicles.length > 0 && (
                <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                  {selectedVehicles.length}
                </Badge>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black/90 border-white/20 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Select Vehicles for Slideshow</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={handleSelectAllVehicles} size="sm" variant="outline" 
                        className="border-white/20 text-white hover:bg-white/10">
                  <Plus className="w-3 h-3 mr-1" />
                  Select All
                </Button>
                <Button onClick={handleClearSelection} size="sm" variant="outline"
                        className="border-white/20 text-white hover:bg-white/10">
                  Clear All
                </Button>
              </div>
              
              <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                {mockVehicles.map((vehicle) => (
                  <div 
                    key={vehicle.id} 
                    className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 border border-white/10"
                  >
                    <Checkbox
                      checked={selectedVehicles.includes(vehicle.id)}
                      onCheckedChange={() => handleVehicleToggle(vehicle.id)}
                      className="border-white/40"
                    />
                    <div className="flex-1">
                      <p className="text-white text-sm">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </p>
                      <p className="text-white/60 text-xs">Stock: {vehicle.stockNumber}</p>
                    </div>
                    {selectedVehicles.includes(vehicle.id) && (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Media Selection */}
        <Dialog open={isMediaDialogOpen} onOpenChange={setIsMediaDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="ghost"
              className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 h-12 rounded-2xl"
              disabled={!currentVehicle}
            >
              <Image className="w-4 h-4 mr-3" />
              <div className="text-left flex-1">
                <div className="text-sm">Media Selection</div>
                <div className="text-xs opacity-80">
                  {currentVehicle ? `${currentVehicleMedia.length} items` : 'No vehicle selected'}
                </div>
              </div>
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black/90 border-white/20 text-white max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-white">
                Media for {currentVehicle?.year} {currentVehicle?.make} {currentVehicle?.model}
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {currentVehicleMedia.map((media) => (
                <div 
                  key={media.id}
                  className="relative group cursor-pointer rounded-lg overflow-hidden bg-white/5 border border-white/10 hover:border-white/30 transition-all"
                  onClick={() => {
                    onMediaSelect(media);
                    setIsMediaDialogOpen(false);
                    toast.success(`Selected: ${media.title}`);
                  }}
                >
                  <div className="aspect-video">
                    <img 
                      src={media.thumbnail} 
                      alt={media.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                    <Button size="sm" className="bg-white text-black">
                      Select
                    </Button>
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="bg-black/70 text-white text-xs">
                      {media.type.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="p-3">
                    <p className="text-white text-sm truncate">{media.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Share Link Generator */}
        <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="ghost"
              className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 h-12 rounded-2xl"
              disabled={!currentVehicle}
            >
              <Link className="w-4 h-4 mr-3" />
              <div className="text-left flex-1">
                <div className="text-sm">Generate Customer Link</div>
                <div className="text-xs opacity-80">Share with customers</div>
              </div>
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black/90 border-white/20 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Generate Customer Share Link</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-white">Vehicle to Share</Label>
                <div className="mt-2 p-3 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-white">
                    {currentVehicle?.year} {currentVehicle?.make} {currentVehicle?.model}
                  </p>
                  <p className="text-white/60 text-sm">Stock: {currentVehicle?.stockNumber}</p>
                </div>
              </div>

              <div>
                <Label className="text-white">Select Specific Media (Optional)</Label>
                <div className="mt-2 grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {currentVehicleMedia.map((media) => (
                    <div 
                      key={media.id}
                      className="flex items-center space-x-2 p-2 bg-white/5 rounded border border-white/10"
                    >
                      <Checkbox
                        checked={selectedMediaForShare.includes(media.id)}
                        onCheckedChange={() => handleMediaToggleForShare(media.id)}
                        className="border-white/40"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs truncate">{media.title}</p>
                        <p className="text-white/60 text-xs">{media.type.toUpperCase()}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-white/60 text-xs mt-2">
                  Leave empty to share all media for this vehicle
                </p>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleGenerateShareUrl}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  Generate Link
                </Button>
              </div>

              {shareUrl && (
                <div>
                  <Label className="text-white">Share URL</Label>
                  <div className="mt-2 flex gap-2">
                    <Input 
                      value={shareUrl}
                      readOnly
                      className="bg-white/5 border-white/20 text-white"
                    />
                    <Button
                      onClick={handleCopyShareUrl}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-white/60 text-xs mt-1">
                    Customer will only see the selected vehicle/media and cannot access showroom mode
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Slideshow Toggle */}
        <Button 
          onClick={onSlideshowToggle}
          variant="ghost"
          className={`w-full h-12 rounded-2xl border transition-all ${
            isSlideshow 
              ? 'bg-red-500/20 border-red-500/40 text-red-400' 
              : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
          }`}
        >
          <Users className="w-4 h-4 mr-3" />
          <div className="text-left flex-1">
            <div className="text-sm">
              {isSlideshow ? 'Stop Slideshow' : 'Start Slideshow'}
            </div>
            <div className="text-xs opacity-80">
              {isSlideshow ? 'Currently running' : 'Auto-rotate display'}
            </div>
          </div>
          {isSlideshow && (
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
          )}
        </Button>
      </div>

      {/* Status Info */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="space-y-2 text-xs">
          <div className="flex justify-between text-white/60">
            <span>Selected Vehicles:</span>
            <span>{selectedVehicles.length}/{mockVehicles.length}</span>
          </div>
          <div className="flex justify-between text-white/60">
            <span>Slideshow Status:</span>
            <span className={isSlideshow ? 'text-red-400' : 'text-white/60'}>
              {isSlideshow ? 'Running' : 'Stopped'}
            </span>
          </div>
        </div>
        <p className="text-white/40 text-xs text-center mt-3">
          Bentley Supercenter • Showroom Display
        </p>
      </div>
    </div>
  );
}