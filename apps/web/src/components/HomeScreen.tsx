import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  Button,
  CircularProgress,
  Divider,
  Stack,
  Paper
} from '@mui/material';
import { 
  RestaurantOutlined,
  AccessTimeOutlined,
  LocalOfferOutlined,
  TrendingUpOutlined
} from '@mui/icons-material';

// Mock featured bags data
const FEATURED_BAGS = [
  {
    id: 'bag1',
    name: 'Evening Bread Mix',
    vendor: 'Lagos Bakery',
    price: 1500,
    originalValue: 4500,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    distance: '1.2 km',
    pickupTime: '18:00 - 20:00'
  },
  {
    id: 'bag2',
    name: 'Veggie Surprise',
    vendor: 'Green Harvest',
    price: 2200,
    originalValue: 6000,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    distance: '0.8 km',
    pickupTime: '17:30 - 19:30'
  },
  {
    id: 'bag3',
    name: 'Lunch Special',
    vendor: 'Spice Haven',
    price: 2500,
    originalValue: 7500,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    distance: '1.5 km',
    pickupTime: '12:00 - 14:00'
  }
];

// Mock featured vendors data
const FEATURED_VENDORS = [
  {
    id: 'vendor1',
    name: 'Lagos Bakery',
    image: 'https://images.unsplash.com/photo-1579697096985-41fe1430e5df?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    rating: 4.8,
    category: 'Bakery',
    distance: '1.2 km'
  },
  {
    id: 'vendor2',
    name: 'Green Harvest',
    image: 'https://images.unsplash.com/photo-1506484381205-f7945653044d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    rating: 4.5,
    category: 'Grocery',
    distance: '0.8 km'
  },
  {
    id: 'vendor3',
    name: 'Spice Haven',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    rating: 4.2,
    category: 'Restaurant',
    distance: '1.5 km'
  }
];

const HomeScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}
        data-testid="loading-indicator"
      >
        <CircularProgress size={40} />
      </Box>
    );
  }
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Welcome Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Welcome to ChopNow
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Rescue delicious food, reduce waste, and save money
        </Typography>
      </Box>
      
      {/* Hero Banner */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 3, 
          bgcolor: 'primary.light',
          color: 'primary.contrastText',
          backgroundImage: 'linear-gradient(to right, #4caf50, #2e7d32)'
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={7}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Join the Food Rescue Movement
            </Typography>
            <Typography variant="body1" paragraph>
              Save up to 70% on quality food that would otherwise go to waste.
              Help local businesses and the environment at the same time.
            </Typography>
            <Button 
              variant="contained" 
              color="secondary"
              size="large"
              sx={{ 
                borderRadius: 50,
                px: 3,
                py: 1,
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.9)',
                }
              }}
            >
              Explore Marketplace
            </Button>
          </Grid>
          <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box 
              component="img"
              src="https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
              alt="Food rescue"
              sx={{ 
                width: '100%', 
                height: 200, 
                objectFit: 'cover',
                borderRadius: 2
              }}
            />
          </Grid>
        </Grid>
      </Paper>
      
      {/* Featured Bags Section */}
      <Box sx={{ mb: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            Featured Bags
          </Typography>
          <Button color="primary">See All</Button>
        </Box>
        
        <Grid container spacing={3}>
          {FEATURED_BAGS.map((bag) => (
            <Grid item xs={12} sm={6} md={4} key={bag.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 3,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.3s ease-in-out',
                    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)'
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={bag.image}
                  alt={bag.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    {bag.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {bag.vendor}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Box>
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        ₦{bag.price.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                        ₦{bag.originalValue.toLocaleString()}
                      </Typography>
                    </Box>
                    <Button 
                      variant="contained" 
                      size="small"
                      sx={{ borderRadius: 50 }}
                    >
                      Reserve
                    </Button>
                  </Box>
                  
                  <Divider sx={{ my: 1.5 }} />
                  
                  <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTimeOutlined fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        {bag.pickupTime}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocalOfferOutlined fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        {Math.round((1 - bag.price / bag.originalValue) * 100)}% off
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      
      {/* Featured Vendors Section */}
      <Box sx={{ mb: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            Featured Vendors
          </Typography>
          <Button color="primary">See All</Button>
        </Box>
        
        <Grid container spacing={3}>
          {FEATURED_VENDORS.map((vendor) => (
            <Grid item xs={12} sm={6} md={4} key={vendor.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 3,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.3s ease-in-out',
                    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)'
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={vendor.image}
                  alt={vendor.name}
                />
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    {vendor.name}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {vendor.category}
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      ★ {vendor.rating}
                    </Typography>
                  </Box>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    sx={{ mt: 2, borderRadius: 50 }}
                  >
                    View Bags
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      
      {/* Impact Stats */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          borderRadius: 3, 
          bgcolor: 'secondary.light',
          color: 'secondary.contrastText'
        }}
      >
        <Typography variant="h6" fontWeight="bold" gutterBottom align="center">
          Our Impact So Far
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold">
                12,450
              </Typography>
              <Typography variant="body2">
                Meals Saved
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold">
                14.9t
              </Typography>
              <Typography variant="body2">
                CO₂ Reduced
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold">
                1.2M
              </Typography>
              <Typography variant="body2">
                Liters of Water
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold">
                ₦24.9M
              </Typography>
              <Typography variant="body2">
                Money Saved
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default HomeScreen;
