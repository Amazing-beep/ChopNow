import React from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent,
  Paper,
  LinearProgress,
  Divider,
  Button,
  Tabs,
  Tab
} from '@mui/material';
import {
  EcoOutlined,
  RestaurantOutlined,
  WaterOutlined,
  LocalAtmOutlined,
  BarChartOutlined,
  CalendarTodayOutlined
} from '@mui/icons-material';

// Mock impact data
const IMPACT_DATA = {
  mealsSaved: 2845,
  co2Reduced: 3414,
  waterSaved: 284500,
  moneySaved: 568900,
  weeklyProgress: 75,
  monthlyGoal: 85
};

// Mock historical data for charts
const MONTHLY_DATA = [
  { month: 'Jan', meals: 120, co2: 144, water: 12000 },
  { month: 'Feb', meals: 150, co2: 180, water: 15000 },
  { month: 'Mar', meals: 200, co2: 240, water: 20000 },
  { month: 'Apr', meals: 180, co2: 216, water: 18000 },
  { month: 'May', meals: 250, co2: 300, water: 25000 },
  { month: 'Jun', meals: 300, co2: 360, water: 30000 },
  { month: 'Jul', meals: 350, co2: 420, water: 35000 },
  { month: 'Aug', meals: 400, co2: 480, water: 40000 },
  { month: 'Sep', meals: 450, co2: 540, water: 45000 },
  { month: 'Oct', meals: 500, co2: 600, water: 50000 },
  { month: 'Nov', meals: 550, co2: 660, water: 55000 },
  { month: 'Dec', meals: 600, co2: 720, water: 60000 }
];

const ImpactDashboardScreen = () => {
  const [tabValue, setTabValue] = React.useState(0);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
          Your Impact Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track your contribution to reducing food waste
        </Typography>
      </Box>
      
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth"
        >
          <Tab label="Overview" />
          <Tab label="History" />
          <Tab label="Goals" />
        </Tabs>
      </Box>
      
      {/* Overview Tab */}
      {tabValue === 0 && (
        <>
          {/* Impact Stats */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={6} md={3}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  textAlign: 'center',
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText',
                  borderRadius: 3
                }}
              >
                <RestaurantOutlined sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h5" fontWeight="bold">
                  {IMPACT_DATA.mealsSaved.toLocaleString()}
                </Typography>
                <Typography variant="body2">
                  Meals Saved
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={6} md={3}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  textAlign: 'center',
                  bgcolor: 'secondary.light',
                  color: 'secondary.contrastText',
                  borderRadius: 3
                }}
              >
                <EcoOutlined sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h5" fontWeight="bold">
                  {IMPACT_DATA.co2Reduced.toLocaleString()} kg
                </Typography>
                <Typography variant="body2">
                  CO₂ Reduced
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={6} md={3}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  textAlign: 'center',
                  bgcolor: 'info.light',
                  color: 'info.contrastText',
                  borderRadius: 3
                }}
              >
                <WaterOutlined sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h5" fontWeight="bold">
                  {(IMPACT_DATA.waterSaved / 1000).toLocaleString()} kL
                </Typography>
                <Typography variant="body2">
                  Water Saved
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={6} md={3}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  textAlign: 'center',
                  bgcolor: 'success.light',
                  color: 'success.contrastText',
                  borderRadius: 3
                }}
              >
                <LocalAtmOutlined sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h5" fontWeight="bold">
                  ₦{(IMPACT_DATA.moneySaved / 1000).toLocaleString()}k
                </Typography>
                <Typography variant="body2">
                  Money Saved
                </Typography>
              </Paper>
            </Grid>
          </Grid>
          
          {/* Weekly Progress */}
          <Card sx={{ mb: 4, borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Weekly Progress
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <CalendarTodayOutlined sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
                  This Week
                </Typography>
              </Box>
              
              <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Progress
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {IMPACT_DATA.weeklyProgress}%
                </Typography>
              </Box>
              
              <LinearProgress 
                variant="determinate" 
                value={IMPACT_DATA.weeklyProgress} 
                sx={{ 
                  height: 10, 
                  borderRadius: 5,
                  mb: 2
                }} 
              />
              
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      12
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Bags Rescued
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      5
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Vendors Supported
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      3
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Days Streak
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          
          {/* Monthly Goal */}
          <Card sx={{ mb: 4, borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Monthly Goal
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <BarChartOutlined sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
                  May 2025
                </Typography>
              </Box>
              
              <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Goal: 50 bags
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {IMPACT_DATA.monthlyGoal}%
                </Typography>
              </Box>
              
              <LinearProgress 
                variant="determinate" 
                value={IMPACT_DATA.monthlyGoal} 
                color="secondary"
                sx={{ 
                  height: 10, 
                  borderRadius: 5,
                  mb: 2
                }} 
              />
              
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  You've rescued 42 bags this month
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Just 8 more to reach your goal!
                </Typography>
              </Box>
            </CardContent>
          </Card>
          
          {/* Environmental Impact */}
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Environmental Equivalent
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Your food rescue efforts are equivalent to:
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box 
                      sx={{ 
                        bgcolor: 'primary.light', 
                        borderRadius: '50%', 
                        p: 1, 
                        mr: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <EcoOutlined sx={{ color: 'primary.contrastText' }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        341 trees
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        absorbing CO₂ for one year
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box 
                      sx={{ 
                        bgcolor: 'info.light', 
                        borderRadius: '50%', 
                        p: 1, 
                        mr: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <WaterOutlined sx={{ color: 'info.contrastText' }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        1,422 showers
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        worth of water saved
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box 
                      sx={{ 
                        bgcolor: 'secondary.light', 
                        borderRadius: '50%', 
                        p: 1, 
                        mr: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <RestaurantOutlined sx={{ color: 'secondary.contrastText' }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        2,845 meals
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        provided to those in need
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box 
                      sx={{ 
                        bgcolor: 'success.light', 
                        borderRadius: '50%', 
                        p: 1, 
                        mr: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <LocalAtmOutlined sx={{ color: 'success.contrastText' }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        ₦568,900
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        saved on food expenses
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </>
      )}
      
      {/* History Tab */}
      {tabValue === 1 && (
        <Box>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Your historical impact data will be displayed here with charts and trends.
          </Typography>
          
          <Button variant="contained" disabled>
            Download Impact Report
          </Button>
        </Box>
      )}
      
      {/* Goals Tab */}
      {tabValue === 2 && (
        <Box>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Set and track your personal impact goals here.
          </Typography>
          
          <Button variant="contained" disabled>
            Set New Goal
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default ImpactDashboardScreen;
