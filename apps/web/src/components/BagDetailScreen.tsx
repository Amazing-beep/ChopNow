import React from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Card, 
  CardContent, 
  CardMedia,
  Grid,
  Button,
  Chip,
  Divider,
  Rating,
  IconButton,
  Stack,
  Avatar
} from '@mui/material';
import { 
  ArrowBack,
  ShoppingBag,
  AccessTime,
  LocationOn,
  Favorite,
  FavoriteBorder,
  Share,
  Info
} from '@mui/icons-material';

// Mock data for bag details
const BAG_DETAIL = {
  id: 'bag1',
  name: 'Evening Bread Mix',
  vendor: 'Lagos Bakery',
  price: 1500,
  originalValue: 4500,
  image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
  distance: '1.2 km',
  pickupTime: '18:00 - 20:00',
  rating: 4.8,
  category: 'Bakery',
  description: 'A delicious mix of freshly baked bread, pastries, and rolls from our evening batch. Perfect for dinner or breakfast the next day. May include white bread, whole wheat bread, dinner rolls, and croissants.',
  items: [
    'Artisan White Bread (1)',
    'Whole Wheat Rolls (4)',
    'Croissants (2)',
    'Baguette (1)',
    'Cinnamon Rolls (2)'
  ],
  availableUntil: '20:00',
  vendorInfo: {
    name: 'Lagos Bakery',
    image: 'https://images.unsplash.com/photo-1579697096985-41fe1430e5df?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    address: '123 Baker Street, Lagos Island',
    rating: 4.8,
    reviews: 245
  },
  impactStats: {
    co2Saved: 1.2,
    waterSaved: 800
  }
};

const BagDetailScreen = () => {
  const [isFavorite, setIsFavorite] = React.useState(false);
  
  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Back Button */}
      <Button 
        startIcon={<ArrowBack />} 
        sx={{ mb: 2 }}
        variant="text"
      >
        Back to Marketplace
      </Button>
      
      {/* Bag Image and Basic Info */}
      <Card sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="300"
            image={BAG_DETAIL.image}
            alt={BAG_DETAIL.name}
          />
          <Box 
            sx={{ 
              position: 'absolute', 
              top: 16, 
              right: 16, 
              display: 'flex', 
              gap: 1 
            }}
          >
            <IconButton 
              sx={{ bgcolor: 'background.paper' }}
              onClick={handleToggleFavorite}
            >
              {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
            </IconButton>
            <IconButton sx={{ bgcolor: 'background.paper' }}>
              <Share />
            </IconButton>
          </Box>
        </Box>
        
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {BAG_DETAIL.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {BAG_DETAIL.vendor}
              </Typography>
            </Box>
            <Chip 
              label={BAG_DETAIL.category} 
              color="primary" 
              variant="outlined" 
            />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Rating value={BAG_DETAIL.rating} precision={0.1} size="small" readOnly />
            <Typography variant="body2" color="text.secondary">
              ({BAG_DETAIL.rating})
            </Typography>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTime color="action" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Pickup Time
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {BAG_DETAIL.pickupTime}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn color="action" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Distance
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {BAG_DETAIL.distance}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h4" fontWeight="bold" color="primary">
                ₦{BAG_DETAIL.price.toLocaleString()}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                ₦{BAG_DETAIL.originalValue.toLocaleString()}
              </Typography>
            </Box>
            <Chip 
              label={`Save ${Math.round((1 - BAG_DETAIL.price / BAG_DETAIL.originalValue) * 100)}%`} 
              color="secondary" 
              size="medium" 
            />
          </Box>
          
          <Button 
            variant="contained" 
            fullWidth 
            size="large"
            startIcon={<ShoppingBag />}
            sx={{ borderRadius: 50, py: 1.5 }}
          >
            Reserve Bag
          </Button>
        </CardContent>
      </Card>
      
      {/* Bag Description */}
      <Card sx={{ mb: 4, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            About this Bag
          </Typography>
          <Typography variant="body1" paragraph>
            {BAG_DETAIL.description}
          </Typography>
          
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            What's inside:
          </Typography>
          <Box sx={{ bgcolor: 'background.default', borderRadius: 2, p: 2 }}>
            <Stack spacing={1}>
              {BAG_DETAIL.items.map((item, index) => (
                <Typography key={index} variant="body1">
                  • {item}
                </Typography>
              ))}
            </Stack>
          </Box>
          
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              mt: 3,
              bgcolor: 'info.light',
              color: 'info.contrastText',
              p: 2,
              borderRadius: 2
            }}
          >
            <Info />
            <Typography variant="body2">
              Available until {BAG_DETAIL.availableUntil} today. Reserve quickly to avoid missing out!
            </Typography>
          </Box>
        </CardContent>
      </Card>
      
      {/* Vendor Info */}
      <Card sx={{ mb: 4, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Vendor Information
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar 
              src={BAG_DETAIL.vendorInfo.image} 
              alt={BAG_DETAIL.vendorInfo.name}
              sx={{ width: 64, height: 64 }}
            />
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                {BAG_DETAIL.vendorInfo.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Rating value={BAG_DETAIL.vendorInfo.rating} precision={0.1} size="small" readOnly />
                <Typography variant="body2" color="text.secondary">
                  ({BAG_DETAIL.vendorInfo.reviews} reviews)
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <LocationOn fontSize="small" sx={{ verticalAlign: 'text-bottom', mr: 0.5 }} />
            {BAG_DETAIL.vendorInfo.address}
          </Typography>
          
          <Button 
            variant="outlined" 
            fullWidth 
            sx={{ mt: 2, borderRadius: 50 }}
          >
            View Vendor Profile
          </Button>
        </CardContent>
      </Card>
      
      {/* Environmental Impact */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Your Impact
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            By rescuing this bag, you will help save:
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Box 
                sx={{ 
                  bgcolor: 'primary.light', 
                  color: 'primary.contrastText',
                  p: 2,
                  borderRadius: 3,
                  textAlign: 'center'
                }}
              >
                <Typography variant="h5" fontWeight="bold">
                  {BAG_DETAIL.impactStats.co2Saved} kg
                </Typography>
                <Typography variant="body2">
                  CO₂ Emissions
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6}>
              <Box 
                sx={{ 
                  bgcolor: 'secondary.light', 
                  color: 'secondary.contrastText',
                  p: 2,
                  borderRadius: 3,
                  textAlign: 'center'
                }}
              >
                <Typography variant="h5" fontWeight="bold">
                  {BAG_DETAIL.impactStats.waterSaved} L
                </Typography>
                <Typography variant="body2">
                  Water Usage
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default BagDetailScreen;
