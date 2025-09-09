'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import { UrlFormData, ShortenedUrl } from '@/types/url';
import { urlService } from '@/services/urlService';
import { logger } from '@/middleware/logger';

interface UrlRow extends UrlFormData {
  id: string;
}

interface ShortenedUrlDisplay {
  original: UrlFormData;
  shortened: ShortenedUrl;
}

export default function UrlShortenerForm() {
  const [urlRows, setUrlRows] = useState<UrlRow[]>([
    {
      id: '1',
      originalUrl: '',
      validityMinutes: 30,
      preferredShortcode: '',
    },
  ]);
  const [shortenedUrls, setShortenedUrls] = useState<ShortenedUrlDisplay[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const addUrlRow = () => {
    if (urlRows.length < 5) {
      setUrlRows([
        ...urlRows,
        {
          id: Date.now().toString(),
          originalUrl: '',
          validityMinutes: 30,
          preferredShortcode: '',
        },
      ]);
    }
  };

  const removeUrlRow = (id: string) => {
    if (urlRows.length > 1) {
      setUrlRows(urlRows.filter((row) => row.id !== id));
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const updateUrlRow = (id: string, field: keyof UrlFormData, value: string | number) => {
    setUrlRows(
      urlRows.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
    
    // Clear error for this field
    if (errors[id]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    urlRows.forEach((row) => {
      if (!row.originalUrl.trim()) {
        newErrors[row.id] = 'URL is required';
        return;
      }

      const urlValidation = urlService.validateUrl(row.originalUrl);
      if (!urlValidation.isValid) {
        newErrors[row.id] = urlValidation.error!;
        return;
      }

      const shortcodeValidation = urlService.validateShortcode(row.preferredShortcode || '');
      if (!shortcodeValidation.isValid) {
        newErrors[row.id] = shortcodeValidation.error!;
        return;
      }

      const validityValidation = urlService.validateValidityMinutes(row.validityMinutes);
      if (!validityValidation.isValid) {
        newErrors[row.id] = validityValidation.error!;
        return;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    const newShortenedUrls: ShortenedUrlDisplay[] = [];

    try {
      for (const row of urlRows) {
        try {
          const shortened = urlService.shortenUrl({
            originalUrl: row.originalUrl,
            validityMinutes: row.validityMinutes,
            preferredShortcode: row.preferredShortcode || undefined,
          });

          newShortenedUrls.push({
            original: row,
            shortened,
          });
        } catch (error) {
          setErrors((prev) => ({
            ...prev,
            [row.id]: error instanceof Error ? error.message : 'Failed to shorten URL',
          }));
        }
      }

      setShortenedUrls(newShortenedUrls);
      
      if (newShortenedUrls.length === urlRows.length) {
        // Reset form if all URLs were successfully shortened
        setUrlRows([
          {
            id: Date.now().toString(),
            originalUrl: '',
            validityMinutes: 30,
            preferredShortcode: '',
          },
        ]);
      }
    } catch (error) {
      logger.error('UrlShortenerForm.handleSubmit', 'frontend', 'Error in bulk URL shortening', { error });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      logger.info('UrlShortenerForm.copyToClipboard', 'frontend', 'URL copied to clipboard', { url: text });
    } catch (error) {
      logger.error('UrlShortenerForm.copyToClipboard', 'frontend', 'Failed to copy URL to clipboard', { error });
    }
  };

  const formatExpiryDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LinkIcon color="primary" />
            URL Shortener
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Shorten up to 5 URLs at once with custom expiry times and shortcodes.
          </Typography>

          <Box sx={{ space: 2 }}>
            {urlRows.map((row, index) => (
              <Box key={row.id} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Typography variant="h6">URL {index + 1}</Typography>
                  {urlRows.length > 1 && (
                    <IconButton
                      size="small"
                      onClick={() => removeUrlRow(row.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Original URL"
                    placeholder="https://example.com/very-long-url"
                    value={row.originalUrl}
                    onChange={(e) => updateUrlRow(row.id, 'originalUrl', e.target.value)}
                    error={!!errors[row.id]}
                    helperText={errors[row.id]}
                    required
                  />

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      label="Validity (minutes)"
                      type="number"
                      value={row.validityMinutes}
                      onChange={(e) => updateUrlRow(row.id, 'validityMinutes', parseInt(e.target.value) || 30)}
                      sx={{ width: 200 }}
                      inputProps={{ min: 1, max: 525600 }}
                    />

                    <TextField
                      label="Custom Shortcode (optional)"
                      placeholder="mycode123"
                      value={row.preferredShortcode}
                      onChange={(e) => updateUrlRow(row.id, 'preferredShortcode', e.target.value)}
                      sx={{ flex: 1 }}
                      helperText="Leave empty to auto-generate"
                    />
                  </Box>
                </Box>

                {index < urlRows.length - 1 && <Divider sx={{ mt: 2 }} />}
              </Box>
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isLoading}
              sx={{ flex: 1 }}
            >
              {isLoading ? 'Shortening...' : 'Shorten URLs'}
            </Button>

            {urlRows.length < 5 && (
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addUrlRow}
              >
                Add URL
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      {shortenedUrls.length > 0 && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Shortened URLs
            </Typography>

            {shortenedUrls.map((item, index) => (
              <Box key={index} sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Original URL:
                </Typography>
                <Typography variant="body1" sx={{ wordBreak: 'break-all', mb: 2 }}>
                  {item.original.originalUrl}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Short URL:
                  </Typography>
                  <Chip 
                    label={`http://localhost:3000/${item.shortened.shortCode}`}
                    color="primary"
                    variant="outlined"
                  />
                  <IconButton
                    size="small"
                    onClick={() => copyToClipboard(`http://localhost:3000/${item.shortened.shortCode}`)}
                  >
                    <CopyIcon />
                  </IconButton>
                </Box>

                <Typography variant="body2" color="text.secondary">
                  Expires: {formatExpiryDate(item.shortened.expiryDate)}
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
