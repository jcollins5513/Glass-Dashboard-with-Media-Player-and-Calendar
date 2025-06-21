import { ShareData, URLParams } from '../types';

export function generateShareUrl(shareData: ShareData): string {
  const baseUrl = window.location.origin + window.location.pathname;
  const params = new URLSearchParams();
  
  params.set('shared', 'true');
  params.set('type', shareData.type);
  params.set('ts', shareData.timestamp.toString());
  
  if (shareData.vehicleId) {
    params.set('vehicleId', shareData.vehicleId);
  }
  
  if (shareData.mediaIds && shareData.mediaIds.length > 0) {
    params.set('mediaIds', shareData.mediaIds.join(','));
  }
  
  return `${baseUrl}?${params.toString()}`;
}

export function parseUrlParams(): URLParams {
  if (typeof window === 'undefined') return {};
  
  const urlParams = new URLSearchParams(window.location.search);
  
  return {
    shared: urlParams.get('shared') || undefined,
    vehicleId: urlParams.get('vehicleId') || undefined,
    mediaIds: urlParams.get('mediaIds') || undefined,
    type: urlParams.get('type') || undefined,
  };
}

export function isSharedUrl(): boolean {
  const params = parseUrlParams();
  return params.shared === 'true';
}

export function getSharedData(): ShareData | null {
  const params = parseUrlParams();
  
  if (!params.shared || params.shared !== 'true') {
    return null;
  }
  
  const mediaIds = params.mediaIds ? params.mediaIds.split(',') : undefined;
  
  return {
    vehicleId: params.vehicleId,
    mediaIds,
    type: (params.type as 'vehicle' | 'media' | 'slideshow') || 'vehicle',
    timestamp: Date.now()
  };
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'absolute';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    return new Promise((resolve, reject) => {
      try {
        document.execCommand('copy');
        textArea.remove();
        resolve();
      } catch (error) {
        textArea.remove();
        reject(error);
      }
    });
  }
}