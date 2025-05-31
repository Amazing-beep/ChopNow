import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar,
  Divider,
  Alert,
  LinearProgress
} from '@mui/material';
import {
  Dashboard,
  People,
  Store,
  ShoppingBag,
  Payment,
  Notifications,
  Settings,
  Edit,
  Delete,
  CheckCircle,
  Cancel,
  Visibility,
  BarChart,
  PieChart,
  LineChart,
  Search,
  FilterList,
  Download,
  Refresh
} from '@mui/icons-material';

// Mock data for admin dashboard
const MOCK_USERS = [
  { id: 1, name: 'Amara Okonkwo', email: 'amara@example.com', role: 'User', status: 'Active', joined: '2025-01-15', orders: 12 },
  { id: 2, name: 'Chijioke Eze', email: 'chijioke@example.com', role: 'User', status: 'Active', joined: '2025-02-03', orders: 8 },
  { id: 3, name: 'Ngozi Adeyemi', email: 'ngozi@example.com', role: 'User', status: 'Inactive', joined: '2025-03-21', orders: 3 },
  { id: 4, name: 'Oluwaseun Adeleke', email: 'oluwaseun@example.com', role: 'User', status: 'Active', joined: '2025-04-10', orders: 5 },
  { id: 5, name: 'Folake Johnson', email: 'folake@example.com', role: 'User', status: 'Active', joined: '2025-05-02', orders: 2 }
];

const MOCK_VENDORS = [
  { id: 1, name: 'Lagos Bakery', email: 'info@lagosbakery.com', category: 'Bakery', status: 'Verified', joined: '2025-01-10', bags: 45, rating: 4.8 },
  { id: 2, name: 'Green Harvest', email: 'contact@greenharvest.com', category: 'Grocery', status: 'Verified', joined: '2025-02-15', bags: 32, rating: 4.5 },
  { id: 3, name: 'Spice Haven', email: 'spicehaven@example.com', category: 'Restaurant', status: 'Pending', joined: '2025-04-05', bags: 12, rating: 4.2 },
  { id: 4, name: 'Sweet Delights', email: 'info@sweetdelights.com', category: 'Desserts', status: 'Verified', joined: '2025-03-20', bags: 28, rating: 4.7 },
  { id: 5, name: 'Fresh Farms', email: 'support@freshfarms.com', category: 'Produce', status: 'Suspended', joined: '2025-02-28', bags: 8, rating: 3.9 }
];

const MOCK_ORDERS = [
  { id: 'ORD-001', user: 'Amara Okonkwo', vendor: 'Lagos Bakery', bag: 'Evening Bread Mix', amount: 1500, status: 'Completed', date: '2025-05-29T18:30:00Z' },
  { id: 'ORD-002', user: 'Chijioke Eze', vendor: 'Green Harvest', bag: 'Veggie Surprise', amount: 2200, status: 'Pending', date: '2025-05-30T12:15:00Z' },
  { id: 'ORD-003', user: 'Ngozi Adeyemi', vendor: 'Sweet Delights', bag: 'Pastry Collection', amount: 1800, status: 'Cancelled', date: '2025-05-28T14:45:00Z' },
  { id: 'ORD-004', user: 'Oluwaseun Adeleke', vendor: 'Spice Haven', bag: 'Lunch Special', amount: 2500, status: 'Completed', date: '2025-05-29T13:20:00Z' },
  { id: 'ORD-005', user: 'Folake Johnson', vendor: 'Fresh Farms', bag: 'Fruit Mix', amount: 1200, status: 'Ready', date: '2025-05-30T10:00:00Z' }
];

const MOCK_BAGS = [
  { id: 'BAG-001', name: 'Evening Bread Mix', vendor: 'Lagos Bakery', price: 1500, value: 4500, status: 'Available', created: '2025-05-28', orders: 12 },
  { id: 'BAG-002', name: 'Veggie Surprise', vendor: 'Green Harvest', price: 2200, value: 6000, status: 'Sold Out', created: '2025-05-29', orders: 8 },
  { id: 'BAG-003', name: 'Pastry Collection', vendor: 'Sweet Delights', price: 1800, value: 5400, status: 'Available', created: '2025-05-27', orders: 5 },
  { id: 'BAG-004', name: 'Lunch Special', vendor: 'Spice Haven', price: 2500, value: 7500, status: 'Available', created: '2025-05-30', orders: 3 },
  { id: 'BAG-005', name: 'Fruit Mix', vendor: 'Fresh Farms', price: 1200, value: 3600, status: 'Available', created: '2025-05-29', orders: 7 }
];

const MOCK_IMPACT = {
  totalMealsSaved: 2845,
  totalCO2Reduced: 3414,
  totalWaterConserved: 284500,
  totalMoneyDonated: 125000,
  totalUsers: 1250,
  totalVendors: 48,
  totalOrders: 3120,
  weeklyGrowth: 12.5,
  monthlyStats: [
    { month: 'Jan', meals: 320, co2: 384, water: 32000 },
    { month: 'Feb', meals: 450, co2: 540, water: 45000 },
    { month: 'Mar', meals: 520, co2: 624, water: 52000 },
    { month: 'Apr', meals: 680, co2: 816, water: 68000 },
    { month: 'May', meals: 875, co2: 1050, water: 87500 }
  ]
};

const MOCK_CONTENT = [
  { id: 1, title: 'Food Waste Facts', type: 'Educational', author: 'Admin', status: 'Published', created: '2025-05-15', views: 1250 },
  { id: 2, title: 'Cooking with Leftovers', type: 'Recipe', author: 'Amara Okonkwo', status: 'Published', created: '2025-05-20', views: 875 },
  { id: 3, title: 'Vendor Spotlight: Lagos Bakery', type: 'Feature', author: 'Admin', status: 'Published', created: '2025-05-22', views: 620 },
  { id: 4, title: 'Sustainable Food Storage Tips', type: 'Educational', author: 'Admin', status: 'Draft', created: '2025-05-28', views: 0 },
  { id: 5, title: 'Community Impact Report', type: 'Report', author: 'Admin', status: 'Scheduled', created: '2025-05-29', views: 0 }
];

const AdminPanel = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const handleOpenDialog = (type, item = null) => {
    setDialogType(type);
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedItem(null);
  };

  const handleAction = () => {
    // In a real app, this would perform the actual action
    console.log(`Performing ${dialogType} action on:`, selectedItem);
    handleCloseDialog();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
  };

  const getStatusColor = (status) => {
    const statusMap = {
      'Active': 'success',
      'Inactive': 'error',
      'Verified': 'success',
      'Pending': 'warning',
      'Suspended': 'error',
      'Completed': 'success',
      'Ready': 'info',
      'Cancelled': 'error',
      'Available': 'success',
      'Sold Out': 'error',
      'Published': 'success',
      'Draft': 'default',
      'Scheduled': 'info'
    };
    return statusMap[status] || 'default';
  };

  const renderDashboard = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Overview
      </Typography>
      
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Users
              </Typography>
              <Typography variant="h4" component="div">
                {MOCK_IMPACT.totalUsers}
              </Typography>
              <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                +{MOCK_IMPACT.weeklyGrowth}% this week
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Vendors
              </Typography>
              <Typography variant="h4" component="div">
                {MOCK_IMPACT.totalVendors}
              </Typography>
              <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                +8.3% this week
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Orders
              </Typography>
              <Typography variant="h4" component="div">
                {MOCK_IMPACT.totalOrders}
              </Typography>
              <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                +15.2% this week
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Revenue
              </Typography>
              <Typography variant="h4" component="div">
                {formatCurrency(3750000)}
              </Typography>
              <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                +11.8% this week
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Impact Metrics */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Impact Metrics
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Meals Saved
              </Typography>
              <Typography variant="h4" component="div">
                {MOCK_IMPACT.totalMealsSaved}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={85} 
                sx={{ mt: 2, mb: 1, height: 8, borderRadius: 4 }} 
              />
              <Typography variant="body2" color="text.secondary">
                85% of monthly target
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                CO₂ Reduced (kg)
              </Typography>
              <Typography variant="h4" component="div">
                {MOCK_IMPACT.totalCO2Reduced}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={92} 
                sx={{ mt: 2, mb: 1, height: 8, borderRadius: 4 }} 
              />
              <Typography variant="body2" color="text.secondary">
                92% of monthly target
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Water Conserved (L)
              </Typography>
              <Typography variant="h4" component="div">
                {MOCK_IMPACT.totalWaterConserved}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={78} 
                sx={{ mt: 2, mb: 1, height: 8, borderRadius: 4 }} 
              />
              <Typography variant="body2" color="text.secondary">
                78% of monthly target
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Recent Activity */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Recent Activity
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Vendor</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {MOCK_ORDERS.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.user}</TableCell>
                <TableCell>{order.vendor}</TableCell>
                <TableCell>{formatCurrency(order.amount)}</TableCell>
                <TableCell>
                  <Chip 
                    label={order.status} 
                    color={getStatusColor(order.status)} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>{formatDate(order.date)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderUsers = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Users Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<People />}
          onClick={() => handleOpenDialog('Add User')}
        >
          Add User
        </Button>
      </Box>
      
      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          placeholder="Search users..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ flexGrow: 1 }}
          InputProps={{
            startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />
          }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            label="Status"
            onChange={handleFilterChange}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {/* Users Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Joined</TableCell>
              <TableCell>Orders</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {MOCK_USERS.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Chip 
                    label={user.status} 
                    color={getStatusColor(user.status)} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>{formatDate(user.joined)}</TableCell>
                <TableCell>{user.orders}</TableCell>
                <TableCell>
                  <IconButton 
                    size="small" 
                    onClick={() => handleOpenDialog('Edit User', user)}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => handleOpenDialog('Delete User', user)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderVendors = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Vendors Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Store />}
          onClick={() => handleOpenDialog('Add Vendor')}
        >
          Add Vendor
        </Button>
      </Box>
      
      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          placeholder="Search vendors..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ flexGrow: 1 }}
          InputProps={{
            startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />
          }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            label="Status"
            onChange={handleFilterChange}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Verified">Verified</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Suspended">Suspended</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {/* Vendors Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Joined</TableCell>
              <TableCell>Bags</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {MOCK_VENDORS.map((vendor) => (
              <TableRow key={vendor.id}>
                <TableCell>{vendor.name}</TableCell>
                <TableCell>{vendor.email}</TableCell>
                <TableCell>{vendor.category}</TableCell>
                <TableCell>
                  <Chip 
                    label={vendor.status} 
                    color={getStatusColor(vendor.status)} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>{formatDate(vendor.joined)}</TableCell>
                <TableCell>{vendor.bags}</TableCell>
                <TableCell>{vendor.rating}</TableCell>
                <TableCell>
                  <IconButton 
                    size="small" 
                    onClick={() => handleOpenDialog('Edit Vendor', vendor)}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => handleOpenDialog('Delete Vendor', vendor)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderOrders = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Orders Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Download />}
        >
          Export Orders
        </Button>
      </Box>
      
      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          placeholder="Search orders..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ flexGrow: 1 }}
          InputProps={{
            startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />
          }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            label="Status"
            onChange={handleFilterChange}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Ready">Ready</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {/* Orders Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Vendor</TableCell>
              <TableCell>Bag</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {MOCK_ORDERS.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.user}</TableCell>
                <TableCell>{order.vendor}</TableCell>
                <TableCell>{order.bag}</TableCell>
                <TableCell>{formatCurrency(order.amount)}</TableCell>
                <TableCell>
                  <Chip 
                    label={order.status} 
                    color={getStatusColor(order.status)} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>{formatDate(order.date)}</TableCell>
                <TableCell>
                  <IconButton 
                    size="small" 
                    onClick={() => handleOpenDialog('View Order', order)}
                  >
                    <Visibility fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => handleOpenDialog('Edit Order', order)}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderBags = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Surprise Bags Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<ShoppingBag />}
          onClick={() => handleOpenDialog('Add Bag')}
        >
          Add Bag
        </Button>
      </Box>
      
      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          placeholder="Search bags..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ flexGrow: 1 }}
          InputProps={{
            startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />
          }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            label="Status"
            onChange={handleFilterChange}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Available">Available</MenuItem>
            <MenuItem value="Sold Out">Sold Out</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {/* Bags Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Bag ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Vendor</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Orders</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {MOCK_BAGS.map((bag) => (
              <TableRow key={bag.id}>
                <TableCell>{bag.id}</TableCell>
                <TableCell>{bag.name}</TableCell>
                <TableCell>{bag.vendor}</TableCell>
                <TableCell>{formatCurrency(bag.price)}</TableCell>
                <TableCell>{formatCurrency(bag.value)}</TableCell>
                <TableCell>
                  <Chip 
                    label={bag.status} 
                    color={getStatusColor(bag.status)} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>{formatDate(bag.created)}</TableCell>
                <TableCell>{bag.orders}</TableCell>
                <TableCell>
                  <IconButton 
                    size="small" 
                    onClick={() => handleOpenDialog('Edit Bag', bag)}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => handleOpenDialog('Delete Bag', bag)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderContent = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Content Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Edit />}
          onClick={() => handleOpenDialog('Add Content')}
        >
          Create Content
        </Button>
      </Box>
      
      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          placeholder="Search content..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ flexGrow: 1 }}
          InputProps={{
            startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />
          }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            label="Status"
            onChange={handleFilterChange}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Published">Published</MenuItem>
            <MenuItem value="Draft">Draft</MenuItem>
            <MenuItem value="Scheduled">Scheduled</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {/* Content Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Views</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {MOCK_CONTENT.map((content) => (
              <TableRow key={content.id}>
                <TableCell>{content.title}</TableCell>
                <TableCell>{content.type}</TableCell>
                <TableCell>{content.author}</TableCell>
                <TableCell>
                  <Chip 
                    label={content.status} 
                    color={getStatusColor(content.status)} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>{formatDate(content.created)}</TableCell>
                <TableCell>{content.views}</TableCell>
                <TableCell>
                  <IconButton 
                    size="small" 
                    onClick={() => handleOpenDialog('Edit Content', content)}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => handleOpenDialog('Delete Content', content)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderReports = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Reports & Analytics
      </Typography>
      
      {/* Report Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Impact Metrics
                </Typography>
                <IconButton size="small">
                  <Download fontSize="small" />
                </IconButton>
              </Box>
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  [Impact Metrics Chart]
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  User Growth
                </Typography>
                <IconButton size="small">
                  <Download fontSize="small" />
                </IconButton>
              </Box>
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  [User Growth Chart]
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Order Distribution
                </Typography>
                <IconButton size="small">
                  <Download fontSize="small" />
                </IconButton>
              </Box>
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  [Order Distribution Chart]
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Revenue Analysis
                </Typography>
                <IconButton size="small">
                  <Download fontSize="small" />
                </IconButton>
              </Box>
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  [Revenue Analysis Chart]
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Export Options */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Export Reports
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button 
              variant="outlined" 
              fullWidth 
              startIcon={<Download />}
            >
              User Report
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button 
              variant="outlined" 
              fullWidth 
              startIcon={<Download />}
            >
              Vendor Report
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button 
              variant="outlined" 
              fullWidth 
              startIcon={<Download />}
            >
              Order Report
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button 
              variant="outlined" 
              fullWidth 
              startIcon={<Download />}
            >
              Impact Report
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );

  const renderSettings = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        System Settings
      </Typography>
      
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
            General Settings
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Platform Name"
                fullWidth
                defaultValue="ChopNow"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Support Email"
                fullWidth
                defaultValue="support@chopnow.com"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Contact Phone"
                fullWidth
                defaultValue="+234 800 123 4567"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Default Currency"
                fullWidth
                defaultValue="NGN"
                margin="normal"
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained">
              Save Changes
            </Button>
          </Box>
        </CardContent>
      </Card>
      
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
            Notification Settings
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Email Notifications</InputLabel>
                <Select
                  defaultValue="all"
                  label="Email Notifications"
                >
                  <MenuItem value="all">All Notifications</MenuItem>
                  <MenuItem value="important">Important Only</MenuItem>
                  <MenuItem value="none">None</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>SMS Notifications</InputLabel>
                <Select
                  defaultValue="important"
                  label="SMS Notifications"
                >
                  <MenuItem value="all">All Notifications</MenuItem>
                  <MenuItem value="important">Important Only</MenuItem>
                  <MenuItem value="none">None</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Push Notifications</InputLabel>
                <Select
                  defaultValue="all"
                  label="Push Notifications"
                >
                  <MenuItem value="all">All Notifications</MenuItem>
                  <MenuItem value="important">Important Only</MenuItem>
                  <MenuItem value="none">None</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Notification Frequency</InputLabel>
                <Select
                  defaultValue="realtime"
                  label="Notification Frequency"
                >
                  <MenuItem value="realtime">Real-time</MenuItem>
                  <MenuItem value="hourly">Hourly Digest</MenuItem>
                  <MenuItem value="daily">Daily Digest</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained">
              Save Changes
            </Button>
          </Box>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
            API Settings
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="API Key"
                fullWidth
                defaultValue="sk_live_51JKl2jH7z8nJK2jH7z8nJK2jH7z8nJK2jH7z8nJK2j"
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Webhook URL"
                fullWidth
                defaultValue="https://api.chopnow.com/webhooks/incoming"
                margin="normal"
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined">
              Regenerate API Key
            </Button>
            <Button variant="contained">
              Save Changes
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );

  const renderTabContent = () => {
    switch (tabValue) {
      case 0:
        return renderDashboard();
      case 1:
        return renderUsers();
      case 2:
        return renderVendors();
      case 3:
        return renderOrders();
      case 4:
        return renderBags();
      case 5:
        return renderContent();
      case 6:
        return renderReports();
      case 7:
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  const renderDialog = () => {
    let title = '';
    let content = null;
    
    switch (dialogType) {
      case 'Add User':
      case 'Edit User':
        title = dialogType;
        content = (
          <Box sx={{ minWidth: 400 }}>
            <TextField label="Name" fullWidth margin="normal" defaultValue={selectedItem?.name || ''} />
            <TextField label="Email" fullWidth margin="normal" defaultValue={selectedItem?.email || ''} />
            <FormControl fullWidth margin="normal">
              <InputLabel>Role</InputLabel>
              <Select
                defaultValue={selectedItem?.role || 'User'}
                label="Role"
              >
                <MenuItem value="User">User</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Moderator">Moderator</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                defaultValue={selectedItem?.status || 'Active'}
                label="Status"
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>
        );
        break;
        
      case 'Delete User':
        title = 'Confirm Deletion';
        content = (
          <Box>
            <Alert severity="warning" sx={{ mb: 2 }}>
              Are you sure you want to delete the user "{selectedItem?.name}"? This action cannot be undone.
            </Alert>
          </Box>
        );
        break;
        
      case 'Add Vendor':
      case 'Edit Vendor':
        title = dialogType;
        content = (
          <Box sx={{ minWidth: 400 }}>
            <TextField label="Name" fullWidth margin="normal" defaultValue={selectedItem?.name || ''} />
            <TextField label="Email" fullWidth margin="normal" defaultValue={selectedItem?.email || ''} />
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                defaultValue={selectedItem?.category || 'Restaurant'}
                label="Category"
              >
                <MenuItem value="Restaurant">Restaurant</MenuItem>
                <MenuItem value="Bakery">Bakery</MenuItem>
                <MenuItem value="Grocery">Grocery</MenuItem>
                <MenuItem value="Produce">Produce</MenuItem>
                <MenuItem value="Desserts">Desserts</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                defaultValue={selectedItem?.status || 'Pending'}
                label="Status"
              >
                <MenuItem value="Verified">Verified</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Suspended">Suspended</MenuItem>
              </Select>
            </FormControl>
          </Box>
        );
        break;
        
      case 'Delete Vendor':
        title = 'Confirm Deletion';
        content = (
          <Box>
            <Alert severity="warning" sx={{ mb: 2 }}>
              Are you sure you want to delete the vendor "{selectedItem?.name}"? This action cannot be undone.
            </Alert>
          </Box>
        );
        break;
        
      case 'View Order':
      case 'Edit Order':
        title = dialogType;
        content = (
          <Box sx={{ minWidth: 400 }}>
            <Typography variant="subtitle2" color="text.secondary">Order ID</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{selectedItem?.id || ''}</Typography>
            
            <Typography variant="subtitle2" color="text.secondary">User</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{selectedItem?.user || ''}</Typography>
            
            <Typography variant="subtitle2" color="text.secondary">Vendor</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{selectedItem?.vendor || ''}</Typography>
            
            <Typography variant="subtitle2" color="text.secondary">Bag</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{selectedItem?.bag || ''}</Typography>
            
            <Typography variant="subtitle2" color="text.secondary">Amount</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{selectedItem ? formatCurrency(selectedItem.amount) : ''}</Typography>
            
            <Typography variant="subtitle2" color="text.secondary">Date</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{selectedItem ? formatDate(selectedItem.date) : ''}</Typography>
            
            {dialogType === 'Edit Order' && (
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  defaultValue={selectedItem?.status || 'Pending'}
                  label="Status"
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Ready">Ready</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            )}
          </Box>
        );
        break;
        
      case 'Add Bag':
      case 'Edit Bag':
        title = dialogType;
        content = (
          <Box sx={{ minWidth: 400 }}>
            <TextField label="Name" fullWidth margin="normal" defaultValue={selectedItem?.name || ''} />
            <FormControl fullWidth margin="normal">
              <InputLabel>Vendor</InputLabel>
              <Select
                defaultValue={selectedItem?.vendor || ''}
                label="Vendor"
              >
                {MOCK_VENDORS.map(vendor => (
                  <MenuItem key={vendor.id} value={vendor.name}>{vendor.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField 
              label="Price" 
              fullWidth 
              margin="normal" 
              defaultValue={selectedItem?.price || ''} 
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>₦</Typography>
              }}
            />
            <TextField 
              label="Estimated Value" 
              fullWidth 
              margin="normal" 
              defaultValue={selectedItem?.value || ''} 
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>₦</Typography>
              }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                defaultValue={selectedItem?.status || 'Available'}
                label="Status"
              >
                <MenuItem value="Available">Available</MenuItem>
                <MenuItem value="Sold Out">Sold Out</MenuItem>
              </Select>
            </FormControl>
          </Box>
        );
        break;
        
      case 'Delete Bag':
        title = 'Confirm Deletion';
        content = (
          <Box>
            <Alert severity="warning" sx={{ mb: 2 }}>
              Are you sure you want to delete the bag "{selectedItem?.name}"? This action cannot be undone.
            </Alert>
          </Box>
        );
        break;
        
      case 'Add Content':
      case 'Edit Content':
        title = dialogType;
        content = (
          <Box sx={{ minWidth: 400 }}>
            <TextField label="Title" fullWidth margin="normal" defaultValue={selectedItem?.title || ''} />
            <FormControl fullWidth margin="normal">
              <InputLabel>Type</InputLabel>
              <Select
                defaultValue={selectedItem?.type || 'Educational'}
                label="Type"
              >
                <MenuItem value="Educational">Educational</MenuItem>
                <MenuItem value="Recipe">Recipe</MenuItem>
                <MenuItem value="Feature">Feature</MenuItem>
                <MenuItem value="Report">Report</MenuItem>
              </Select>
            </FormControl>
            <TextField 
              label="Content" 
              fullWidth 
              multiline 
              rows={4} 
              margin="normal" 
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                defaultValue={selectedItem?.status || 'Draft'}
                label="Status"
              >
                <MenuItem value="Published">Published</MenuItem>
                <MenuItem value="Draft">Draft</MenuItem>
                <MenuItem value="Scheduled">Scheduled</MenuItem>
              </Select>
            </FormControl>
          </Box>
        );
        break;
        
      case 'Delete Content':
        title = 'Confirm Deletion';
        content = (
          <Box>
            <Alert severity="warning" sx={{ mb: 2 }}>
              Are you sure you want to delete the content "{selectedItem?.title}"? This action cannot be undone.
            </Alert>
          </Box>
        );
        break;
        
      default:
        break;
    }
    
    return (
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {content}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleAction} 
            variant="contained" 
            color={dialogType.startsWith('Delete') ? 'error' : 'primary'}
          >
            {dialogType.startsWith('Delete') ? 'Delete' : dialogType.startsWith('View') ? 'Close' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 240,
          flexShrink: 0,
          bgcolor: 'background.paper',
          borderRight: 1,
          borderColor: 'divider',
          height: '100vh',
          position: 'sticky',
          top: 0,
          p: 2,
          display: { xs: 'none', md: 'block' }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>C</Avatar>
          <Typography variant="h6" fontWeight="bold">
            ChopNow Admin
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Button
            startIcon={<Dashboard />}
            onClick={() => setTabValue(0)}
            variant={tabValue === 0 ? 'contained' : 'text'}
            sx={{ justifyContent: 'flex-start', py: 1 }}
          >
            Dashboard
          </Button>
          <Button
            startIcon={<People />}
            onClick={() => setTabValue(1)}
            variant={tabValue === 1 ? 'contained' : 'text'}
            sx={{ justifyContent: 'flex-start', py: 1 }}
          >
            Users
          </Button>
          <Button
            startIcon={<Store />}
            onClick={() => setTabValue(2)}
            variant={tabValue === 2 ? 'contained' : 'text'}
            sx={{ justifyContent: 'flex-start', py: 1 }}
          >
            Vendors
          </Button>
          <Button
            startIcon={<Payment />}
            onClick={() => setTabValue(3)}
            variant={tabValue === 3 ? 'contained' : 'text'}
            sx={{ justifyContent: 'flex-start', py: 1 }}
          >
            Orders
          </Button>
          <Button
            startIcon={<ShoppingBag />}
            onClick={() => setTabValue(4)}
            variant={tabValue === 4 ? 'contained' : 'text'}
            sx={{ justifyContent: 'flex-start', py: 1 }}
          >
            Surprise Bags
          </Button>
          <Button
            startIcon={<Edit />}
            onClick={() => setTabValue(5)}
            variant={tabValue === 5 ? 'contained' : 'text'}
            sx={{ justifyContent: 'flex-start', py: 1 }}
          >
            Content
          </Button>
          <Button
            startIcon={<BarChart />}
            onClick={() => setTabValue(6)}
            variant={tabValue === 6 ? 'contained' : 'text'}
            sx={{ justifyContent: 'flex-start', py: 1 }}
          >
            Reports
          </Button>
          <Button
            startIcon={<Settings />}
            onClick={() => setTabValue(7)}
            variant={tabValue === 7 ? 'contained' : 'text'}
            sx={{ justifyContent: 'flex-start', py: 1 }}
          >
            Settings
          </Button>
        </Box>
      </Box>
      
      {/* Mobile Tabs */}
      <Box sx={{ width: '100%', display: { xs: 'block', md: 'none' }, borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<Dashboard />} label="Dashboard" />
          <Tab icon={<People />} label="Users" />
          <Tab icon={<Store />} label="Vendors" />
          <Tab icon={<Payment />} label="Orders" />
          <Tab icon={<ShoppingBag />} label="Bags" />
          <Tab icon={<Edit />} label="Content" />
          <Tab icon={<BarChart />} label="Reports" />
          <Tab icon={<Settings />} label="Settings" />
        </Tabs>
      </Box>
      
      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3, bgcolor: '#f9fafb', minHeight: '100vh' }}>
        {renderTabContent()}
        {renderDialog()}
      </Box>
    </Box>
  );
};

export default AdminPanel;
