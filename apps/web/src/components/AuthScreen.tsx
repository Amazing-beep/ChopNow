import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  TextField, 
  Button, 
  Paper, 
  Tabs, 
  Tab, 
  InputAdornment,
  IconButton,
  Avatar,
  Link
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Email, 
  Lock,
  Person,
  Phone
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `auth-tab-${index}`,
    'aria-controls': `auth-tabpanel-${index}`,
  };
}

const AuthScreen = () => {
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login with:', { loginEmail, loginPassword });
    // In a real app, this would call an API endpoint
  };
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Register with:', { 
      registerName, 
      registerEmail, 
      registerPhone,
      registerPassword, 
      registerConfirmPassword 
    });
    // In a real app, this would call an API endpoint
  };
  
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          borderRadius: 4, 
          overflow: 'hidden',
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.08)'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
          <Avatar 
            sx={{ 
              width: 80, 
              height: 80, 
              bgcolor: 'primary.main',
              mb: 2
            }}
          >
            <img 
              src="/logo.png" 
              alt="ChopNow Logo" 
              style={{ width: '60%', height: '60%' }}
              onError={(e) => {
                e.currentTarget.src = '';
                e.currentTarget.alt = 'CN';
              }}
            />
          </Avatar>
        </Box>
        
        <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
          Welcome to ChopNow
        </Typography>
        
        <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
          Join the food rescue movement
        </Typography>
        
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth" 
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Login" {...a11yProps(0)} />
          <Tab label="Register" {...a11yProps(1)} />
        </Tabs>
        
        <TabPanel value={tabValue} index={0}>
          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              margin="normal"
              label="Email Address"
              variant="outlined"
              type="email"
              required
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              variant="outlined"
              type={showPassword ? 'text' : 'password'}
              required
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, mb: 2 }}>
              <Link href="#" variant="body2" underline="hover">
                Forgot password?
              </Link>
            </Box>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ 
                mt: 2, 
                mb: 2,
                py: 1.5
              }}
            >
              Login
            </Button>
          </form>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <form onSubmit={handleRegister}>
            <TextField
              fullWidth
              margin="normal"
              label="Full Name"
              variant="outlined"
              required
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              fullWidth
              margin="normal"
              label="Email Address"
              variant="outlined"
              type="email"
              required
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              fullWidth
              margin="normal"
              label="Phone Number"
              variant="outlined"
              required
              value={registerPhone}
              onChange={(e) => setRegisterPhone(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone color="action" />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              variant="outlined"
              type={showPassword ? 'text' : 'password'}
              required
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              fullWidth
              margin="normal"
              label="Confirm Password"
              variant="outlined"
              type={showPassword ? 'text' : 'password'}
              required
              value={registerConfirmPassword}
              onChange={(e) => setRegisterConfirmPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ 
                mt: 3, 
                mb: 2,
                py: 1.5
              }}
            >
              Register
            </Button>
          </form>
        </TabPanel>
        
        <Box sx={{ p: 3, bgcolor: 'background.default', textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            By continuing, you agree to ChopNow's{' '}
            <Link href="#" underline="hover">Terms of Service</Link> and{' '}
            <Link href="#" underline="hover">Privacy Policy</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default AuthScreen;
