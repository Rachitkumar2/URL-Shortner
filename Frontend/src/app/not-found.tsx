'use client';

import MuiThemeProvider from '@/components/providers/MuiThemeProvider';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import {
  Home as HomeIcon,
} from '@mui/icons-material';
import Link from 'next/link';

export default function NotFound() {
  return (
    <MuiThemeProvider>
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
        <Card sx={{ maxWidth: 500, width: '100%', textAlign: 'center' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h1" component="h1" sx={{ fontSize: '4rem', fontWeight: 'bold', color: 'primary.main' }}>
              404
            </Typography>
            <Typography variant="h4" component="h2" gutterBottom>
              Page Not Found
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              The page you're looking for doesn't exist or has been moved.
            </Typography>
            <Button
              component={Link}
              href="/"
              variant="contained"
              startIcon={<HomeIcon />}
              size="large"
              sx={{ mt: 2 }}
            >
              Go Home
            </Button>
          </CardContent>
        </Card>
      </Box>
    </MuiThemeProvider>
  );
}
