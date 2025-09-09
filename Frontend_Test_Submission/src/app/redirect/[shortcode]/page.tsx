'use client';

import MuiThemeProvider from '@/components/providers/MuiThemeProvider';
import RedirectPage from '@/components/RedirectPage';

export default function Redirect() {
  return (
    <MuiThemeProvider>
      <RedirectPage />
    </MuiThemeProvider>
  );
}
