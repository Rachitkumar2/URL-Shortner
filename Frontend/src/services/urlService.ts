import { ShortenedUrl, ClickRecord, UrlFormData, UrlValidationResult } from '@/types/url';
import { logger } from '@/middleware/logger';

class UrlService {
  private urls: Map<string, ShortenedUrl> = new Map();
  private readonly storageKey = 'shortened-urls';

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
          const urlsArray: ShortenedUrl[] = JSON.parse(stored);
          urlsArray.forEach(url => {
            // Convert date strings back to Date objects
            url.createdAt = new Date(url.createdAt);
            url.expiryDate = new Date(url.expiryDate);
            url.clicks = url.clicks.map(click => ({
              ...click,
              timestamp: new Date(click.timestamp)
            }));
            url.isExpired = new Date() > url.expiryDate;
            this.urls.set(url.shortCode, url);
          });
          logger.info('UrlService.loadFromStorage', 'frontend', `Loaded ${urlsArray.length} URLs from storage`, { count: urlsArray.length });
        }
      } catch (error) {
        logger.error('UrlService.loadFromStorage', 'frontend', 'Failed to load URLs from storage', { error });
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      try {
        const urlsArray = Array.from(this.urls.values());
        localStorage.setItem(this.storageKey, JSON.stringify(urlsArray));
        logger.debug('UrlService.saveToStorage', 'frontend', `Saved ${urlsArray.length} URLs to storage`, { count: urlsArray.length });
      } catch (error) {
        logger.error('UrlService.saveToStorage', 'frontend', 'Failed to save URLs to storage', { error });
      }
    }
  }

  validateUrl(url: string): UrlValidationResult {
    try {
      const urlObj = new URL(url);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return { isValid: false, error: 'URL must use HTTP or HTTPS protocol' };
      }
      return { isValid: true };
    } catch {
      return { isValid: false, error: 'Please enter a valid URL' };
    }
  }

  validateShortcode(shortcode: string): UrlValidationResult {
    if (!shortcode) {
      return { isValid: true }; // Empty shortcode is valid (will be auto-generated)
    }

    if (!/^[a-zA-Z0-9]+$/.test(shortcode)) {
      return { isValid: false, error: 'Shortcode must contain only alphanumeric characters' };
    }

    if (shortcode.length < 3 || shortcode.length > 20) {
      return { isValid: false, error: 'Shortcode must be between 3 and 20 characters' };
    }

    if (this.urls.has(shortcode)) {
      return { isValid: false, error: 'This shortcode is already taken' };
    }

    return { isValid: true };
  }

  validateValidityMinutes(minutes: number): UrlValidationResult {
    if (!Number.isInteger(minutes) || minutes <= 0) {
      return { isValid: false, error: 'Validity period must be a positive integer' };
    }

    if (minutes > 525600) { // 1 year in minutes
      return { isValid: false, error: 'Validity period cannot exceed 1 year' };
    }

    return { isValid: true };
  }

  private generateShortcode(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    
    do {
      result = '';
      for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    } while (this.urls.has(result));

    return result;
  }

  private getUserLocation(): string {
    // Simple coarse-grained location detection
    if (typeof window !== 'undefined' && 'navigator' in window) {
      const language = navigator.language || 'unknown';
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown';
      return `${language}/${timezone}`;
    }
    return 'unknown/unknown';
  }

  shortenUrl(formData: UrlFormData): ShortenedUrl {
    const urlValidation = this.validateUrl(formData.originalUrl);
    if (!urlValidation.isValid) {
      throw new Error(urlValidation.error);
    }

    const shortcodeValidation = this.validateShortcode(formData.preferredShortcode || '');
    if (!shortcodeValidation.isValid) {
      throw new Error(shortcodeValidation.error);
    }

    const validityValidation = this.validateValidityMinutes(formData.validityMinutes);
    if (!validityValidation.isValid) {
      throw new Error(validityValidation.error);
    }

    const shortCode = formData.preferredShortcode || this.generateShortcode();
    const now = new Date();
    const expiryDate = new Date(now.getTime() + formData.validityMinutes * 60 * 1000);

    const shortenedUrl: ShortenedUrl = {
      id: crypto.randomUUID(),
      originalUrl: formData.originalUrl,
      shortCode,
      expiryDate,
      createdAt: now,
      clicks: [],
      isExpired: false
    };

    this.urls.set(shortCode, shortenedUrl);
    this.saveToStorage();

    logger.info('UrlService.shortenUrl', 'frontend', 'URL shortened successfully', { 
      shortCode, 
      originalUrl: formData.originalUrl,
      expiryDate: expiryDate.toISOString()
    });

    return shortenedUrl;
  }

  getUrlByShortcode(shortCode: string): ShortenedUrl | null {
    const url = this.urls.get(shortCode);
    if (!url) {
      return null;
    }

    // Check if expired
    if (new Date() > url.expiryDate) {
      url.isExpired = true;
      this.saveToStorage();
      logger.warn('UrlService.getUrlByShortcode', 'frontend', 'Attempted to access expired URL', { shortCode });
      return null;
    }

    return url;
  }

  recordClick(shortCode: string, source: string = 'direct'): boolean {
    const url = this.getUrlByShortcode(shortCode);
    if (!url) {
      return false;
    }

    const clickRecord: ClickRecord = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      source,
      userLocation: this.getUserLocation()
    };

    url.clicks.push(clickRecord);
    this.saveToStorage();

    logger.info('UrlService.recordClick', 'frontend', 'Click recorded', { 
      shortCode, 
      source, 
      userLocation: clickRecord.userLocation 
    });

    return true;
  }

  getAllUrls(): ShortenedUrl[] {
    // Update expired status for all URLs
    const now = new Date();
    this.urls.forEach(url => {
      const wasExpired = url.isExpired;
      url.isExpired = now > url.expiryDate;
      if (!wasExpired && url.isExpired) {
        logger.info('UrlService.getAllUrls', 'frontend', 'URL expired', { shortCode: url.shortCode });
      }
    });

    this.saveToStorage();
    return Array.from(this.urls.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  deleteUrl(shortCode: string): boolean {
    const deleted = this.urls.delete(shortCode);
    if (deleted) {
      this.saveToStorage();
      logger.info('UrlService.deleteUrl', 'frontend', 'URL deleted', { shortCode });
    }
    return deleted;
  }

  clearAllUrls(): void {
    this.urls.clear();
    this.saveToStorage();
    logger.info('UrlService.clearAllUrls', 'frontend', 'All URLs cleared');
  }
}

export const urlService = new UrlService();
