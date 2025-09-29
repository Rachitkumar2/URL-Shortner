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
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import Link from 'next/link';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <AppBar position="static" elevation={1}>
      <Container maxWidth="xl">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            URL Shortener
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              color="inherit"
              component={Link}
              href="/"
              variant={pathname === '/' ? 'outlined' : 'text'}
            >
              Shorten URLs
            </Button>
            <Button
              color="inherit"
              component={Link}
              href="/statistics"
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