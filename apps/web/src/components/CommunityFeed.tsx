import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia, 
  Grid, 
  Button, 
  TextField, 
  Avatar, 
  IconButton, 
  Chip,
  Divider,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  ThumbUp, 
  Comment, 
  Share, 
  MoreVert, 
  Bookmark, 
  BookmarkBorder,
  EmojiEvents,
  EcoOutlined,
  RestaurantOutlined,
  WaterDrop
} from '@mui/icons-material';

// Mock data for community posts
const MOCK_POSTS = [
  {
    id: 1,
    author: {
      id: 'user1',
      name: 'Amara Okonkwo',
      avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
      role: 'Zero Waste Chef'
    },
    content: 'Did you know that a single surprise bag can save up to 2.5kg of CO2 emissions? That\'s equivalent to charging your phone for 4 months! #FoodRescue #ClimateAction',
    image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    tags: ['FoodRescue', 'ClimateAction', 'Sustainability'],
    category: 'education',
    likes: 124,
    comments: 18,
    shares: 32,
    saved: false,
    createdAt: '2025-05-28T14:32:00Z',
    impactStats: {
      co2Saved: 2.5,
      waterSaved: 1200,
      mealsRescued: 3
    }
  },
  {
    id: 2,
    author: {
      id: 'vendor1',
      name: 'Lagos Bakery',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      role: 'Verified Vendor'
    },
    content: 'We\'ve rescued over 500kg of bread this month thanks to ChopNow users! Check out our surprise bags available every evening from 7-9pm. #BreadRescue #ZeroWaste',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    tags: ['BreadRescue', 'ZeroWaste', 'LagosFood'],
    category: 'vendor',
    likes: 89,
    comments: 7,
    shares: 12,
    saved: true,
    createdAt: '2025-05-29T09:15:00Z',
    impactStats: {
      co2Saved: 750,
      waterSaved: 45000,
      mealsRescued: 1250
    }
  },
  {
    id: 3,
    author: {
      id: 'user2',
      name: 'Chijioke Eze',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      role: 'Community Champion'
    },
    content: 'Recipe idea for your surprise bag ingredients: I turned yesterday\'s rescued vegetables into this amazing stir-fry! Swipe for the recipe. #RescuedRecipes #NoWaste',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    tags: ['RescuedRecipes', 'NoWaste', 'CookingTips'],
    category: 'recipe',
    likes: 215,
    comments: 42,
    shares: 67,
    saved: false,
    createdAt: '2025-05-29T18:45:00Z',
    impactStats: null
  }
];

const CommunityFeed = () => {
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [activeFilter, setActiveFilter] = useState('all');
  const [commentText, setCommentText] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    // In a real app, this would fetch filtered posts from the API
  };
  
  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likes: post.liked ? post.likes - 1 : post.likes + 1, liked: !post.liked } : post
    ));
  };
  
  const handleSave = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, saved: !post.saved } : post
    ));
  };
  
  const handleComment = (postId) => {
    if (!commentText.trim()) return;
    
    // In a real app, this would send the comment to the API
    console.log(`Comment on post ${postId}: ${commentText}`);
    setCommentText('');
  };
  
  const handleShare = (post) => {
    setSelectedPost(post);
    setShareDialogOpen(true);
  };
  
  const handleMenuOpen = (event, post) => {
    setAnchorEl(event.currentTarget);
    setSelectedPost(post);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPost(null);
  };
  
  const handleReport = () => {
    // In a real app, this would open a report dialog
    console.log(`Reporting post ${selectedPost?.id}`);
    handleMenuClose();
  };
  
  const handleHide = () => {
    setPosts(posts.filter(post => post.id !== selectedPost?.id));
    handleMenuClose();
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' });
  };
  
  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Community & Education
      </Typography>
      
      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3, overflowX: 'auto', pb: 1 }}>
        <Chip 
          label="All Posts" 
          onClick={() => handleFilterChange('all')}
          color={activeFilter === 'all' ? 'primary' : 'default'}
          sx={{ fontWeight: activeFilter === 'all' ? 'bold' : 'normal' }}
        />
        <Chip 
          label="Recipes" 
          onClick={() => handleFilterChange('recipe')}
          color={activeFilter === 'recipe' ? 'primary' : 'default'}
          sx={{ fontWeight: activeFilter === 'recipe' ? 'bold' : 'normal' }}
        />
        <Chip 
          label="Tips" 
          onClick={() => handleFilterChange('tips')}
          color={activeFilter === 'tips' ? 'primary' : 'default'}
          sx={{ fontWeight: activeFilter === 'tips' ? 'bold' : 'normal' }}
        />
        <Chip 
          label="Vendors" 
          onClick={() => handleFilterChange('vendor')}
          color={activeFilter === 'vendor' ? 'primary' : 'default'}
          sx={{ fontWeight: activeFilter === 'vendor' ? 'bold' : 'normal' }}
        />
        <Chip 
          label="Education" 
          onClick={() => handleFilterChange('education')}
          color={activeFilter === 'education' ? 'primary' : 'default'}
          sx={{ fontWeight: activeFilter === 'education' ? 'bold' : 'normal' }}
        />
        <Chip 
          label="Saved" 
          onClick={() => handleFilterChange('saved')}
          color={activeFilter === 'saved' ? 'primary' : 'default'}
          sx={{ fontWeight: activeFilter === 'saved' ? 'bold' : 'normal' }}
        />
      </Box>
      
      {/* Posts */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {posts.map(post => (
          <Card key={post.id} sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            {/* Post Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar src={post.author.avatar} alt={post.author.name} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {post.author.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {post.author.role} • {formatDate(post.createdAt)}
                  </Typography>
                </Box>
              </Box>
              <IconButton onClick={(e) => handleMenuOpen(e, post)}>
                <MoreVert />
              </IconButton>
            </Box>
            
            {/* Post Content */}
            <CardContent sx={{ pt: 0, pb: 1 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {post.content}
              </Typography>
              
              {/* Tags */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                {post.tags.map(tag => (
                  <Typography 
                    key={tag} 
                    variant="caption" 
                    color="primary" 
                    sx={{ fontWeight: 'medium' }}
                  >
                    #{tag}
                  </Typography>
                ))}
              </Box>
            </CardContent>
            
            {/* Post Image */}
            {post.image && (
              <CardMedia
                component="img"
                height="240"
                image={post.image}
                alt="Post image"
                sx={{ objectFit: 'cover' }}
              />
            )}
            
            {/* Impact Stats (if available) */}
            {post.impactStats && (
              <Box sx={{ p: 2, bgcolor: 'primary.light', display: 'flex', justifyContent: 'space-around' }}>
                {post.impactStats.co2Saved && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <EcoOutlined fontSize="small" color="primary" />
                      <Typography variant="body2" fontWeight="bold" color="primary.dark">
                        {post.impactStats.co2Saved} kg
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      CO₂ Saved
                    </Typography>
                  </Box>
                )}
                
                {post.impactStats.waterSaved && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <WaterDrop fontSize="small" color="primary" />
                      <Typography variant="body2" fontWeight="bold" color="primary.dark">
                        {post.impactStats.waterSaved} L
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Water Saved
                    </Typography>
                  </Box>
                )}
                
                {post.impactStats.mealsRescued && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <RestaurantOutlined fontSize="small" color="primary" />
                      <Typography variant="body2" fontWeight="bold" color="primary.dark">
                        {post.impactStats.mealsRescued}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Meals Rescued
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
            
            {/* Engagement Stats */}
            <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="body2" color="text.secondary">
                  {post.likes} likes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  •
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {post.comments} comments
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {post.shares} shares
              </Typography>
            </Box>
            
            <Divider />
            
            {/* Action Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-around', p: 1 }}>
              <Button 
                startIcon={<ThumbUp />} 
                onClick={() => handleLike(post.id)}
                color={post.liked ? 'primary' : 'inherit'}
                sx={{ textTransform: 'none' }}
              >
                Like
              </Button>
              <Button 
                startIcon={<Comment />} 
                sx={{ textTransform: 'none' }}
              >
                Comment
              </Button>
              <Button 
                startIcon={<Share />} 
                onClick={() => handleShare(post)}
                sx={{ textTransform: 'none' }}
              >
                Share
              </Button>
              <Button 
                startIcon={post.saved ? <Bookmark /> : <BookmarkBorder />} 
                onClick={() => handleSave(post.id)}
                color={post.saved ? 'primary' : 'inherit'}
                sx={{ textTransform: 'none' }}
              >
                Save
              </Button>
            </Box>
            
            {/* Comment Input */}
            <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
              <Avatar 
                src="https://randomuser.me/api/portraits/women/44.jpg" 
                alt="Your avatar" 
                sx={{ width: 36, height: 36 }}
              />
              <TextField
                fullWidth
                size="small"
                placeholder="Write a comment..."
                variant="outlined"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleComment(post.id)}
                InputProps={{
                  sx: { borderRadius: 20 }
                }}
              />
            </Box>
          </Card>
        ))}
      </Box>
      
      {/* Post Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleSave}>
          {selectedPost?.saved ? 'Unsave Post' : 'Save Post'}
        </MenuItem>
        <MenuItem onClick={handleReport}>Report Post</MenuItem>
        <MenuItem onClick={handleHide}>Hide Post</MenuItem>
      </Menu>
      
      {/* Share Dialog */}
      <Dialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Share Post</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Button variant="outlined" fullWidth>
              Share to WhatsApp
            </Button>
            <Button variant="outlined" fullWidth>
              Share to Twitter
            </Button>
            <Button variant="outlined" fullWidth>
              Share to Facebook
            </Button>
            <Button variant="outlined" fullWidth>
              Copy Link
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CommunityFeed;
