'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from '@mui/material';
import {
  Link as LinkIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { logger } from '@/middleware/logger';

export default function Navigation() {
  const pathname = usePathname();

  const handleNavigation = (to: string) => {
    logger.info('Navigation.handleNavigation', 'frontend', 'User navigated to page', { from: pathname, to });
  };

  return (
    <AppBar position="static" elevation={1}>
      <Container maxWidth="xl">
        <Toolbar>
          <LinkIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            URL Shortener
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              color="inherit"
              component={Link}
              href="/"
              onClick={() => handleNavigation('/')}
              variant={pathname === '/' ? 'outlined' : 'text'}
              startIcon={<LinkIcon />}
            >
              Shorten URLs
            </Button>
            <Button
              color="inherit"
              component={Link}
              href="/statistics"
              onClick={() => handleNavigation('/statistics')}
              variant={pathname === '/statistics' ? 'outlined' : 'text'}
              startIcon={<AnalyticsIcon />}
            >
              Statistics
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
