# ChopNow - Food Rescue Platform

ChopNow is a comprehensive food rescue platform designed to reduce food waste by connecting users with vendors offering surplus food at discounted prices. The platform includes mobile and web applications with features such as marketplace for surprise bags, vendor dashboard, blockchain-based payments, AI recommendations, community feed, and impact tracking.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Features

### User Features
- Authentication and profile management
- Browse and purchase surprise bags from local vendors
- AI-powered recommendations based on preferences and location
- Community feed for sharing recipes and tips
- Impact tracking to visualize environmental benefits
- Green Saver Pass subscription for premium benefits

### Vendor Features
- Dashboard for managing inventory and surprise bags
- Real-time order tracking and notifications
- Analytics and reporting tools
- Blockchain-based payment processing

### Admin Features
- Comprehensive admin panel for platform management
- User and vendor management
- Content moderation tools
- Impact metrics and reporting

## Architecture

The solution follows a microservices architecture with the following components:

1. **Frontend Applications**
   - Web application (React, TypeScript, Material UI)
   - Admin panel (React, TypeScript, Material UI)

2. **Backend Services**
   - API service (Node.js, Express)
   - Recommendation engine (Python, FastAPI)
   - Blockchain service (Node.js, Stellar SDK, Soroban)

3. **Infrastructure**
   - PostgreSQL database for persistent storage
   - Redis for caching and session management
   - Docker containers for all services
   - CI/CD pipeline via GitHub Actions

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (v20 or later)
- [Python](https://www.python.org/) (v3.11 or later)
- [Git](https://git-scm.com/)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Amazing-beep/ChopNow.git
   cd ChopNow
   ```

2. Install dependencies for all services:
   ```bash
   # Install web app dependencies
   cd apps/web
   npm install
   cd ../..

   # Install admin panel dependencies
   cd apps/admin
   npm install
   cd ../..

   # Install API service dependencies
   cd apps/api
   npm install
   cd ../..

   # Install recommendation engine dependencies
   cd apps/recommendation
   pip install -r requirements.txt
   cd ../..

   # Install blockchain service dependencies
   cd packages/blockchain
   npm install
   cd ../..
   ```

## Running the Application

### Using Docker Compose (Recommended)

The easiest way to run the entire application stack is using Docker Compose:

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# Stop all services
docker-compose down
```

After starting the services, you can access:
- Web application: http://localhost:3000
- Admin panel: http://localhost:3001
- API service: http://localhost:8080
- Recommendation engine: http://localhost:8000
- Blockchain service: http://localhost:9000

### Running Individual Services

#### Web Application
```bash
cd apps/web
npm start
```

#### Admin Panel
```bash
cd apps/admin
npm start
```

#### API Service
```bash
cd apps/api
npm start
```

#### Recommendation Engine
```bash
cd apps/recommendation
uvicorn src.app:app --reload --host 0.0.0.0 --port 8000
```

#### Blockchain Service
```bash
cd packages/blockchain
npm start
```

## Testing

### Running All Tests

To run all tests across all services:

```bash
# From the project root
npm run test:all
```

### Testing Individual Services

#### Web Application
```bash
cd apps/web
npm test
```

#### Admin Panel
```bash
cd apps/admin
npm test
```

#### API Service
```bash
cd apps/api
npm test
```

#### Recommendation Engine
```bash
cd apps/recommendation
pytest
```

#### Blockchain Service
```bash
cd packages/blockchain
npm test
```

### End-to-End Testing

```bash
# From the project root
npm run test:e2e
```

## Deployment

### Production Deployment

The application is configured for deployment using Docker and can be deployed to any environment that supports Docker containers.

1. Build production images:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml build
   ```

2. Deploy to production:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

### CI/CD Pipeline

The repository includes a GitHub Actions workflow for continuous integration and deployment:

- Automatically runs tests on every push and pull request
- Builds Docker images for all services
- Deploys to production on merges to the main branch

## Project Structure

```
chopnow/
├── apps/
│   ├── web/                 # Web application (React)
│   ├── admin/               # Admin panel (React)
│   ├── api/                 # Backend API service (Node.js)
│   └── recommendation/      # Recommendation engine (Python)
├── packages/
│   └── blockchain/          # Blockchain service (Node.js)
├── contracts/
│   ├── escrow/              # Soroban escrow contract (Rust)
│   ├── loyalty/             # Soroban loyalty token contract (Rust)
│   └── impact/              # Soroban impact tracking contract (Rust)
├── .github/
│   └── workflows/           # GitHub Actions CI/CD workflows
├── docker-compose.yml       # Docker Compose configuration
├── docker-compose.prod.yml  # Production Docker Compose overrides
└── README.md                # This file
```

## Technologies Used

### Frontend
- React
- TypeScript
- Material UI
- Redux Toolkit
- React Router
- Axios

### Backend
- Node.js
- Express
- PostgreSQL
- Redis
- FastAPI (Python)
- Stellar SDK
- Soroban SDK

### DevOps
- Docker
- Docker Compose
- GitHub Actions
- Jest
- Pytest

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
