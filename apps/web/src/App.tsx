import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './lib/theme';
import HomeScreen from './components/HomeScreen';
import BagDetailScreen from './components/BagDetailScreen';
import MarketplaceScreen from './components/MarketplaceScreen';
import AuthScreen from './components/AuthScreen';
import ImpactDashboardScreen from './components/ImpactDashboardScreen';
import NotificationCenter from './components/NotificationCenter';
import CommunityFeed from './components/CommunityFeed';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/auth" element={<AuthScreen />} />
          <Route path="/marketplace" element={<MarketplaceScreen />} />
          <Route path="/bag/:id" element={<BagDetailScreen />} />
          <Route path="/impact" element={<ImpactDashboardScreen />} />
          <Route path="/notifications" element={<NotificationCenter />} />
          <Route path="/community" element={<CommunityFeed />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
