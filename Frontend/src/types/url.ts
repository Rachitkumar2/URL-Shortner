export interface ShortenedUrl {
  id: string;
  originalUrl: string;
  shortCode: string;
  expiryDate: Date;
  createdAt: Date;
  clicks: ClickRecord[];
  isExpired: boolean;
}

export interface ClickRecord {
  id: string;
  timestamp: Date;
  source: string;
  userLocation: string;
}

export interface UrlFormData {
  originalUrl: string;
  validityMinutes: number;
  preferredShortcode?: string;
}

export interface UrlValidationResult {
  isValid: boolean;
  error?: string;
}
