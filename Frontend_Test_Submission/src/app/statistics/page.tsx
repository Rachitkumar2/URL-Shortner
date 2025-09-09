'use client';

import MuiThemeProvider from '@/components/providers/MuiThemeProvider';
import Navigation from '@/components/Navigation';
import StatisticsPage from '@/components/StatisticsPage';
import { Container } from '@mui/material';

export default function Statistics() {
  return (
    <MuiThemeProvider>
      <Navigation />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <StatisticsPage />
      </Container>
    </MuiThemeProvider>
  );
}
