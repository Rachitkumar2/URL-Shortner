'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { urlService } from '@/services/urlService';
import { logger } from '@/middleware/logger';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import {
  Error as ErrorIcon,
  Launch as LaunchIcon,
} from '@mui/icons-material';
import Link from 'next/link';

export default function RedirectPage() {
  const params = useParams();
  const shortcode = params.shortcode as string;
  const [status, setStatus] = useState<'loading' | 'redirecting' | 'expired' | 'notfound'>('loading');
  const [originalUrl, setOriginalUrl] = useState<string>('');

  useEffect(() => {
    if (!shortcode) {
      setStatus('notfound');
      return;
    }

    const handleRedirect = () => {
      const url = urlService.getUrlByShortcode(shortcode);
      
      if (!url) {
        setStatus('notfound');
        logger.warn('RedirectPage.handleRedirect', 'frontend', 'Shortcode not found', { shortcode });
        return;
      }

      if (url.isExpired) {
        setStatus('expired');
        setOriginalUrl(url.originalUrl);
        logger.warn('RedirectPage.handleRedirect', 'frontend', 'Attempted to access expired URL', { shortcode, originalUrl: url.originalUrl });
        return;
      }

      // Record the click
      const recorded = urlService.recordClick(shortcode, document.referrer || 'direct');
      
      if (recorded) {
        setStatus('redirecting');
        setOriginalUrl(url.originalUrl);
        
        logger.info('RedirectPage.handleRedirect', 'frontend', 'Redirecting user', { 
          shortcode, 
          originalUrl: url.originalUrl,
          referrer: document.referrer || 'direct'
        });

        // Redirect after a short delay to show the redirecting message
        setTimeout(() => {
          window.location.href = url.originalUrl;
        }, 1000);
      } else {
        setStatus('notfound');
        logger.error('RedirectPage.handleRedirect', 'frontend', 'Failed to record click', { shortcode });
      }
    };

    handleRedirect();
  }, [shortcode]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <CircularProgress />
            <Typography>Processing your request...</Typography>
          </Box>
        );

      case 'redirecting':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <CircularProgress color="success" />
            <Typography variant="h6" color="success.main">
              Redirecting you now...
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              You will be redirected to:
            </Typography>
            <Typography variant="body1" sx={{ wordBreak: 'break-all', textAlign: 'center' }}>
              {originalUrl}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<LaunchIcon />}
              href={originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ mt: 2 }}
            >
              Click here if not redirected automatically
            </Button>
          </Box>
        );

      case 'expired':
        return (
          <Alert 
            severity="warning" 
            icon={<ErrorIcon />}
            action={
              <Button
                variant="outlined"
                startIcon={<LaunchIcon />}
                href={originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
              >
                Visit URL
              </Button>
            }
          >
            <Typography variant="h6" gutterBottom>
              Link Expired
            </Typography>
            <Typography variant="body2" gutterBottom>
              This shortened URL has expired and is no longer active.
            </Typography>
            <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
              Original URL: {originalUrl}
            </Typography>
          </Alert>
        );

      case 'notfound':
        return (
          <Alert severity="error" icon={<ErrorIcon />}>
            <Typography variant="h6" gutterBottom>
              URL Not Found
            </Typography>
            <Typography variant="body2">
              The shortened URL you're trying to access doesn't exist or has been deleted.
            </Typography>
          </Alert>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 3,
      }}
    >
      <Card sx={{ maxWidth: 600, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center' }}>
            URL Shortener
          </Typography>
          
          {renderContent()}

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              component={Link}
              href="/"
              variant="text"
              color="primary"
            >
              ← Back to URL Shortener
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
