import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Avatar,
  IconButton,
  Badge,
  Tabs,
  Tab,
  Button,
  Divider,
  Chip,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Notifications,
  NotificationsActive,
  ShoppingBag,
  Store,
  Person,
  Payment,
  Delete,
  Settings,
  MoreVert,
  CheckCircle,
  Info,
  Warning,
  Error,
  Star,
  EcoOutlined,
  RestaurantOutlined,
  WaterDrop
} from '@mui/icons-material';

// Mock data for notifications
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'order',
    title: 'Order Confirmed',
    message: 'Your order #ORD-001 has been confirmed. Pickup available from 18:00-20:00.',
    time: '2025-05-30T14:30:00Z',
    read: false,
    priority: 'high',
    actionRequired: false,
    data: {
      orderId: 'ORD-001',
      vendorName: 'Lagos Bakery',
      bagName: 'Evening Bread Mix'
    }
  },
  {
    id: 2,
    type: 'vendor',
    title: 'New Vendor Nearby',
    message: 'Sweet Delights has joined ChopNow in your area with amazing pastry bags!',
    time: '2025-05-30T10:15:00Z',
    read: true,
    priority: 'medium',
    actionRequired: false,
    data: {
      vendorId: 'V-004',
      vendorName: 'Sweet Delights'
    }
  },
  {
    id: 3,
    type: 'subscription',
    title: 'Green Saver Pass Renewed',
    message: 'Your Green Saver Pass subscription has been automatically renewed for another month.',
    time: '2025-05-29T09:00:00Z',
    read: false,
    priority: 'medium',
    actionRequired: false,
    data: {
      subscriptionId: 'SUB-123',
      plan: 'Gold',
      amount: 2000
    }
  },
  {
    id: 4,
    type: 'impact',
    title: 'Impact Milestone Reached!',
    message: 'Congratulations! You\'ve saved 50 meals from going to waste. You\'ve helped reduce 60kg of CO₂ emissions.',
    time: '2025-05-28T16:45:00Z',
    read: true,
    priority: 'low',
    actionRequired: false,
    data: {
      mealsSaved: 50,
      co2Reduced: 60,
      waterSaved: 50000
    }
  },
  {
    id: 5,
    type: 'system',
    title: 'App Update Available',
    message: 'A new version of ChopNow is available with exciting new features. Update now!',
    time: '2025-05-28T11:20:00Z',
    read: true,
    priority: 'low',
    actionRequired: true,
    data: {
      version: '2.4.0',
      features: ['Improved map view', 'New payment options', 'Performance improvements']
    }
  },
  {
    id: 6,
    type: 'order',
    title: 'Order Ready for Pickup',
    message: 'Your order #ORD-002 is ready for pickup at Green Harvest.',
    time: '2025-05-30T12:30:00Z',
    read: false,
    priority: 'high',
    actionRequired: true,
    data: {
      orderId: 'ORD-002',
      vendorName: 'Green Harvest',
      bagName: 'Veggie Surprise'
    }
  },
  {
    id: 7,
    type: 'community',
    title: 'New Recipe Shared',
    message: 'Amara Okonkwo shared a new recipe using rescued vegetables. Check it out!',
    time: '2025-05-29T14:15:00Z',
    read: true,
    priority: 'low',
    actionRequired: false,
    data: {
      postId: 'P-123',
      authorName: 'Amara Okonkwo',
      title: 'Rescued Vegetable Stir-Fry'
    }
  }
];

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [tabValue, setTabValue] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleOpenSettings = () => {
    setSettingsOpen(true);
  };
  
  const handleCloseSettings = () => {
    setSettingsOpen(false);
  };
  
  const handleOpenDetails = (notification) => {
    setSelectedNotification(notification);
    setDetailsOpen(true);
  };
  
  const handleCloseDetails = () => {
    setDetailsOpen(false);
  };
  
  const handleMenuOpen = (event, notification) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedNotification(notification);
  };
  
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
  
  const handleMarkAsRead = (notificationId) => {
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
    handleMenuClose();
  };
  
  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };
  
  const handleDeleteNotification = (notificationId) => {
    setNotifications(notifications.filter(n => n.id !== notificationId));
    handleMenuClose();
  };
  
  const handleClearAll = () => {
    setNotifications([]);
  };
  
  const formatTime = (timeString) => {
    const date = new Date(timeString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' });
    }
  };
  
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return <ShoppingBag color="primary" />;
      case 'vendor':
        return <Store color="secondary" />;
      case 'subscription':
        return <Star sx={{ color: '#FFD700' }} />;
      case 'impact':
        return <EcoOutlined color="success" />;
      case 'system':
        return <Info color="info" />;
      case 'community':
        return <Person color="primary" />;
      default:
        return <Notifications />;
    }
  };
  
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <Error color="error" fontSize="small" />;
      case 'medium':
        return <Warning color="warning" fontSize="small" />;
      case 'low':
        return <Info color="info" fontSize="small" />;
      default:
        return null;
    }
  };
  
  const getFilteredNotifications = () => {
    switch (tabValue) {
      case 0: // All
        return notifications;
      case 1: // Unread
        return notifications.filter(n => !n.read);
      case 2: // Orders
        return notifications.filter(n => n.type === 'order');
      case 3: // Alerts
        return notifications.filter(n => n.priority === 'high' || n.actionRequired);
      default:
        return notifications;
    }
  };
  
  const renderNotificationDetails = () => {
    if (!selectedNotification) return null;
    
    const { type, title, message, time, data } = selectedNotification;
    
    return (
      <Dialog open={detailsOpen} onClose={handleCloseDetails} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getNotificationIcon(type)}
            <Typography variant="h6">{title}</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {message}
          </Typography>
          
          <Typography variant="caption" color="text.secondary" sx={{ mb: 3, display: 'block' }}>
            {new Date(time).toLocaleString('en-NG', { 
              day: 'numeric', 
              month: 'short', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          {type === 'order' && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>Order Details</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Order ID:</Typography>
                  <Typography variant="body2">{data.orderId}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Vendor:</Typography>
                  <Typography variant="body2">{data.vendorName}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Bag:</Typography>
                  <Typography variant="body2">{data.bagName}</Typography>
                </Box>
              </Box>
              <Button variant="contained" fullWidth>View Order</Button>
            </Box>
          )}
          
          {type === 'impact' && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>Impact Details</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <RestaurantOutlined fontSize="small" color="primary" />
                    <Typography variant="body1" fontWeight="bold">
                      {data.mealsSaved}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Meals Saved
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <EcoOutlined fontSize="small" color="success" />
                    <Typography variant="body1" fontWeight="bold">
                      {data.co2Reduced} kg
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    CO₂ Reduced
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <WaterDrop fontSize="small" color="info" />
                    <Typography variant="body1" fontWeight="bold">
                      {data.waterSaved} L
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Water Saved
                  </Typography>
                </Box>
              </Box>
              <Button variant="contained" fullWidth>View Impact Dashboard</Button>
            </Box>
          )}
          
          {type === 'subscription' && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>Subscription Details</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Subscription ID:</Typography>
                  <Typography variant="body2">{data.subscriptionId}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Plan:</Typography>
                  <Chip 
                    label={data.plan} 
                    size="small" 
                    color="primary" 
                    sx={{ fontWeight: 'bold' }} 
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Amount:</Typography>
                  <Typography variant="body2">
                    ₦{data.amount.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
              <Button variant="contained" fullWidth>Manage Subscription</Button>
            </Box>
          )}
          
          {type === 'system' && data.version && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>Update Details</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Version:</Typography>
                  <Typography variant="body2">{data.version}</Typography>
                </Box>
                <Typography variant="subtitle2" gutterBottom>New Features:</Typography>
                <List dense>
                  {data.features.map((feature, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
              </Box>
              <Button variant="contained" fullWidth>Update Now</Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  const renderNotificationSettings = () => (
    <Dialog open={settingsOpen} onClose={handleCloseSettings} maxWidth="sm" fullWidth>
      <DialogTitle>Notification Settings</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          Notification Types
        </Typography>
        
        <List>
          <ListItem>
            <ListItemText 
              primary="Order Updates" 
              secondary="Notifications about your orders, including confirmations and pickup reminders" 
            />
            <ListItemSecondaryAction>
              <Switch defaultChecked />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Vendor Updates" 
              secondary="New vendors in your area and special offers" 
            />
            <ListItemSecondaryAction>
              <Switch defaultChecked />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Subscription Updates" 
              secondary="Renewal reminders and subscription status changes" 
            />
            <ListItemSecondaryAction>
              <Switch defaultChecked />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Impact Milestones" 
              secondary="Updates on your environmental impact achievements" 
            />
            <ListItemSecondaryAction>
              <Switch defaultChecked />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="System Updates" 
              secondary="App updates and important system announcements" 
            />
            <ListItemSecondaryAction>
              <Switch defaultChecked />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Community Activity" 
              secondary="Updates on community posts and interactions" 
            />
            <ListItemSecondaryAction>
              <Switch defaultChecked />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle1" gutterBottom>
          Delivery Methods
        </Typography>
        
        <List>
          <ListItem>
            <ListItemText 
              primary="Push Notifications" 
              secondary="Receive notifications on your device" 
            />
            <ListItemSecondaryAction>
              <Switch defaultChecked />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Email Notifications" 
              secondary="Receive notifications via email" 
            />
            <ListItemSecondaryAction>
              <Switch defaultChecked />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="SMS Notifications" 
              secondary="Receive important notifications via SMS" 
            />
            <ListItemSecondaryAction>
              <Switch />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle1" gutterBottom>
          Notification Preferences
        </Typography>
        
        <List>
          <ListItem>
            <ListItemText 
              primary="Notification Sound" 
              secondary="Play sound when notifications arrive" 
            />
            <ListItemSecondaryAction>
              <Switch defaultChecked />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Vibration" 
              secondary="Vibrate when notifications arrive" 
            />
            <ListItemSecondaryAction>
              <Switch defaultChecked />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Do Not Disturb" 
              secondary="Mute notifications during specific hours" 
            />
            <ListItemSecondaryAction>
              <Switch />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseSettings}>Cancel</Button>
        <Button variant="contained" onClick={handleCloseSettings}>Save Changes</Button>
      </DialogActions>
    </Dialog>
  );
  
  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsActive color="primary" />
          </Badge>
          <Typography variant="h6">Notifications</Typography>
        </Box>
        <Box>
          <IconButton onClick={handleOpenSettings}>
            <Settings />
          </IconButton>
        </Box>
      </Box>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="All" />
          <Tab 
            label={
              <Badge badgeContent={unreadCount} color="error">
                Unread
              </Badge>
            } 
          />
          <Tab label="Orders" />
          <Tab label="Alerts" />
        </Tabs>
      </Box>
      
      <Box sx={{ p: 2 }}>
        {getFilteredNotifications().length > 0 ? (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button 
                size="small" 
                onClick={handleMarkAllAsRead}
                disabled={!notifications.some(n => !n.read)}
              >
                Mark all as read
              </Button>
              <Button 
                size="small" 
                onClick={handleClearAll}
                color="error"
              >
                Clear all
              </Button>
            </Box>
            
            <List>
              {getFilteredNotifications().map((notification) => (
                <React.Fragment key={notification.id}>
                  <ListItem 
                    alignItems="flex-start"
                    sx={{ 
                      bgcolor: notification.read ? 'transparent' : 'action.hover',
                      borderRadius: 1,
                      mb: 1
                    }}
                    secondaryAction={
                      <IconButton 
                        edge="end" 
                        onClick={(e) => handleMenuOpen(e, notification)}
                      >
                        <MoreVert />
                      </IconButton>
                    }
                    onClick={() => handleOpenDetails(notification)}
                    button
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: notification.read ? 'action.selected' : 'primary.light' }}>
                        {getNotificationIcon(notification.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography 
                            variant="subtitle2"
                            sx={{ fontWeight: notification.read ? 'normal' : 'bold' }}
                          >
                            {notification.title}
                          </Typography>
                          {notification.priority !== 'low' && getPriorityIcon(notification.priority)}
                          {notification.actionRequired && (
                            <Chip 
                              label="Action" 
                              size="small" 
                              color="warning" 
                              sx={{ height: 20, fontSize: '0.7rem' }} 
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography
                            variant="body2"
                            color="text.primary"
                            sx={{ 
                              display: 'inline',
                              fontWeight: notification.read ? 'normal' : 'medium'
                            }}
                          >
                            {notification.message}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: 'block', mt: 0.5 }}
                          >
                            {formatTime(notification.time)}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          </>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
            <Notifications sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No notifications
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              You're all caught up!
            </Typography>
          </Box>
        )}
      </Box>
      
      {/* Notification Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem 
          onClick={() => handleMarkAsRead(selectedNotification?.id)}
          disabled={selectedNotification?.read}
        >
          Mark as read
        </MenuItem>
        <MenuItem onClick={() => handleDeleteNotification(selectedNotification?.id)}>
          Delete
        </MenuItem>
      </Menu>
      
      {renderNotificationDetails()}
      {renderNotificationSettings()}
    </Box>
  );
};

export default NotificationCenter;
