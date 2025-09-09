'use client';

import MuiThemeProvider from '@/components/providers/MuiThemeProvider';
import Navigation from '@/components/Navigation';
import UrlShortenerForm from '@/components/UrlShortenerForm';
import { Container } from '@mui/material';

export default function Home() {
  return (
    <MuiThemeProvider>
      <Navigation />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <UrlShortenerForm />
      </Container>
    </MuiThemeProvider>
  );
}
