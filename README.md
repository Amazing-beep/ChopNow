# ChopNow Food Rescue Platform

ChopNow is a comprehensive food rescue platform designed to reduce food waste by connecting consumers with restaurants, cafes, and grocery stores that have surplus food. The platform enables businesses to sell their excess food at discounted prices while helping consumers save money and reduce environmental impact.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Setup and Installation](#setup-and-installation)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Blockchain Integration](#blockchain-integration)
- [Contributing](#contributing)
- [License](#license)

## Overview

ChopNow addresses the global food waste crisis by creating a marketplace for surplus food that would otherwise be discarded. The platform uses blockchain technology to ensure transparency and traceability, while an AI recommendation engine helps match consumers with food options based on their preferences.

## Features

### Phase 1: Core UI and Marketplace
- User authentication (login/signup)
- Vendor profiles and management
- Surprise bag listings and reservations
- Payment processing
- User profiles and order history
- Impact metrics dashboard

### Phase 2: Blockchain & Subscription
- Stellar payments integration
- Soroban smart contracts for escrow & loyalty tokens
- "Green Saver Pass" subscription system
- Impact tracking and verification

### Phase 3: AI & Community
- Personalized recommendation engine
- Community feed with educational content
- Real-time notifications
- Admin panel and reporting tools

### Phase 4: Testing & Deployment
- Comprehensive test suite
- Docker containerization
- CI/CD pipeline
- Production deployment

## Project Structure

```
chopnow_fullstack/
├── apps/
│   ├── web/                 # Frontend React application
│   ├── admin/               # Admin dashboard
│   ├── api/                 # Backend API service
│   └── recommendation/      # AI recommendation service
├── packages/
│   └── blockchain/          # Blockchain integration services
├── contracts/
│   ├── escrow/              # Soroban smart contracts for escrow
│   ├── loyalty/             # Loyalty token smart contracts
│   └── impact/              # Impact tracking smart contracts
├── docker-compose.yml       # Docker Compose configuration
└── README.md                # This file
```

## Technology Stack

### Frontend
- React with TypeScript
- Material UI component library
- Redux for state management
- React Router for navigation

### Backend
- Node.js with Express
- MongoDB for database
- JWT for authentication

### Blockchain
- Stellar for payments
- Soroban for smart contracts

### AI & Machine Learning
- Python with scikit-learn
- FastAPI for recommendation service

### DevOps
- Docker for containerization
- GitHub Actions for CI/CD
- AWS for cloud hosting

## Setup and Installation

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- Docker and Docker Compose
- MongoDB
- Git

### Clone the Repository
```bash
git clone https://github.com/Amazing-beep/ChopNow.git
cd ChopNow
```

### Frontend Setup
```bash
cd apps/web
npm install
```

### Backend Setup
```bash
cd apps/api
npm install
```

### Recommendation Service Setup
```bash
cd apps/recommendation
pip install -r requirements.txt
```

### Blockchain Service Setup
```bash
cd packages/blockchain
npm install
```

## Running the Application

### Development Mode

#### Frontend
```bash
cd apps/web
npm start
```
The frontend will be available at http://localhost:3000

#### Backend API
```bash
cd apps/api
npm start
```
The API will be available at http://localhost:4000

#### Recommendation Service
```bash
cd apps/recommendation
python src/app.py
```
The recommendation service will be available at http://localhost:5000

### Using Docker Compose
To run the entire application stack:

```bash
docker-compose up -d
```

This will start all services and make them available at their respective ports.

## Testing

### Frontend Tests
```bash
cd apps/web
npm test
```

### Backend Tests
```bash
cd apps/api
npm test
```

### Recommendation Service Tests
```bash
cd apps/recommendation
python -m pytest src/test_app.py -v
```

### Blockchain Service Tests
```bash
cd packages/blockchain
npm test
```

## Deployment

### Docker Deployment
The application is containerized and can be deployed using Docker Compose:

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Manual Deployment

#### Frontend
```bash
cd apps/web
npm run build
# Deploy the build directory to your web server
```

#### Backend
```bash
cd apps/api
npm run build
# Deploy using PM2 or similar process manager
pm2 start dist/index.js
```

#### Recommendation Service
```bash
cd apps/recommendation
# Deploy using Gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker src.app:app
```

## API Documentation

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token

### Vendors
- `GET /api/vendors` - List all vendors
- `GET /api/vendors/:id` - Get vendor details
- `POST /api/vendors` - Create a new vendor (admin only)
- `PUT /api/vendors/:id` - Update vendor details

### Bags
- `GET /api/bags` - List all available bags
- `GET /api/bags/:id` - Get bag details
- `POST /api/bags` - Create a new bag (vendor only)
- `PUT /api/bags/:id` - Update bag details

### Orders
- `GET /api/orders` - List user's orders
- `POST /api/orders` - Create a new order
- `GET /api/orders/:id` - Get order details

### Recommendations
- `GET /api/recommendations` - Get personalized recommendations
- `GET /api/recommendations/nearby` - Get nearby recommendations
- `GET /api/recommendations/trending` - Get trending items

## Blockchain Integration

ChopNow uses Stellar for payments and Soroban for smart contracts. The blockchain integration provides:

1. **Secure Payments**: Cryptocurrency payments using Stellar
2. **Escrow System**: Funds held in escrow until order completion
3. **Loyalty Tokens**: Reward tokens for regular users
4. **Impact Tracking**: Verifiable environmental impact metrics

### Stellar Integration
The platform integrates with the Stellar network for payment processing. Users can pay using XLM or other Stellar-based assets.

### Soroban Smart Contracts
Three main smart contracts power the platform:

1. **Escrow Contract**: Manages the order payment flow
2. **Loyalty Contract**: Issues and manages loyalty tokens
3. **Impact Contract**: Tracks and verifies environmental impact

## Contributing

We welcome contributions to the ChopNow platform! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
