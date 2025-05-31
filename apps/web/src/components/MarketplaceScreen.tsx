import React from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Divider,
  Rating
} from '@mui/material';
import { 
  Search, 
  FilterList, 
  LocationOn, 
  AccessTime,
  Sort,
  FavoriteBorder
} from '@mui/icons-material';

// Mock data for marketplace bags
const BAGS = [
  {
    id: 'bag1',
    name: 'Evening Bread Mix',
    vendor: 'Lagos Bakery',
    price: 1500,
    originalValue: 4500,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    distance: '1.2 km',
    pickupTime: '18:00 - 20:00',
    rating: 4.8,
    category: 'Bakery'
  },
  {
    id: 'bag2',
    name: 'Veggie Surprise',
    vendor: 'Green Harvest',
    price: 2200,
    originalValue: 6000,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    distance: '0.8 km',
    pickupTime: '17:30 - 19:30',
    rating: 4.5,
    category: 'Grocery'
  },
  {
    id: 'bag3',
    name: 'Lunch Special',
    vendor: 'Spice Haven',
    price: 2500,
    originalValue: 7500,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    distance: '1.5 km',
    pickupTime: '12:00 - 14:00',
    rating: 4.2,
    category: 'Restaurant'
  },
  {
    id: 'bag4',
    name: 'Fruit Basket',
    vendor: 'Fresh Picks',
    price: 1800,
    originalValue: 5000,
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    distance: '2.0 km',
    pickupTime: '16:00 - 18:00',
    rating: 4.7,
    category: 'Grocery'
  },
  {
    id: 'bag5',
    name: 'Pastry Box',
    vendor: 'Sweet Delights',
    price: 1200,
    originalValue: 3600,
    image: 'https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    distance: '1.8 km',
    pickupTime: '15:00 - 17:00',
    rating: 4.6,
    category: 'Bakery'
  },
  {
    id: 'bag6',
    name: 'Dinner Combo',
    vendor: 'Family Kitchen',
    price: 3000,
    originalValue: 8500,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    distance: '2.2 km',
    pickupTime: '19:00 - 21:00',
    rating: 4.4,
    category: 'Restaurant'
  }
];

// Filter categories
const CATEGORIES = ['All', 'Bakery', 'Restaurant', 'Grocery', 'Cafe', 'Fast Food'];

const MarketplaceScreen = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };
  
  const filteredBags = BAGS.filter(bag => {
    // Filter by search query
    const matchesSearch = bag.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         bag.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by category
    const matchesCategory = selectedCategory === 'All' || bag.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
          Marketplace
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover surprise bags from local vendors
        </Typography>
      </Box>
      
      {/* Search and Filter */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search for bags or vendors..."
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <FilterList />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
        
        <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1 }}>
          {CATEGORIES.map((category) => (
            <Chip
              key={category}
              label={category}
              onClick={() => handleCategoryChange(category)}
              color={selectedCategory === category ? 'primary' : 'default'}
              variant={selectedCategory === category ? 'filled' : 'outlined'}
              sx={{ px: 1 }}
            />
          ))}
        </Box>
      </Box>
      
      {/* Sort Options */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          {filteredBags.length} results found
        </Typography>
        <Button startIcon={<Sort />} size="small">
          Sort by: Nearest
        </Button>
      </Box>
      
      {/* Bag Grid */}
      <Grid container spacing={3}>
        {filteredBags.map((bag) => (
          <Grid item xs={12} sm={6} md={4} key={bag.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                position: 'relative',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.3s ease-in-out',
                  boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              <IconButton 
                sx={{ 
                  position: 'absolute', 
                  top: 8, 
                  right: 8, 
                  bgcolor: 'background.paper',
                  '&:hover': { bgcolor: 'background.paper' }
                }}
              >
                <FavoriteBorder />
              </IconButton>
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
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                  <Rating value={bag.rating} precision={0.1} size="small" readOnly />
                  <Typography variant="body2" color="text.secondary">
                    ({bag.rating})
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      ₦{bag.price.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                      ₦{bag.originalValue.toLocaleString()}
                    </Typography>
                  </Box>
                  <Chip 
                    label={`Save ${Math.round((1 - bag.price / bag.originalValue) * 100)}%`} 
                    color="secondary" 
                    size="small" 
                  />
                </Box>
                
                <Divider sx={{ my: 1.5 }} />
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocationOn fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary">
                      {bag.distance}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AccessTime fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary">
                      {bag.pickupTime}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* Empty State */}
      {filteredBags.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" gutterBottom>
            No bags found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or filters
          </Typography>
          <Button 
            variant="outlined" 
            sx={{ mt: 2 }}
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
          >
            Clear Filters
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default MarketplaceScreen;
