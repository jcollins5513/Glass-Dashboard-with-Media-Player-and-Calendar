export enum VehicleStatus {
  available = 'available',
  sold = 'sold'
}

export interface Vehicle {
  id: string;
  stockNumber: string;
  vin: string;
  year: number;
  make: string;
  model: string;
  price: number;
  mileage: number;
  features: string[];
  images: string[];
  createdAt: Date;
  updatedAt: Date;
  color: string;
  trim?: string;
  engine?: string;
  transmission?: string;
  description: string;
  sourceUrl?: string;
  facebookPostId?: string;
  lastFacebookPostDate?: Date;
  lastMarketplacePostDate?: Date;
  carfaxHighlights?: any;
  bodyStyle?: string;
  vehicleClass: string;
  status: VehicleStatus;
}

export interface MediaItem {
  id: string;
  vehicleId: string;
  type: 'video' | 'drone' | 'photo' | '360';
  url: string;
  thumbnail: string;
  duration?: number;
  title: string;
  order?: number;
}

export interface ShareData {
  vehicleId?: string;
  mediaIds?: string[];
  type: 'vehicle' | 'media' | 'slideshow';
  timestamp: number;
}

export interface URLParams {
  shared?: string;
  vehicleId?: string;
  mediaIds?: string;
  type?: string;
}