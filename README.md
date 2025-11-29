# SCDProject25 - NodeVault Application

A Node.js CLI application for managing records with MongoDB backend.

## Features
- Add, List, Update, Delete records
- Search and Sort functionality
- Data export to text file
- Automatic backup system
- Vault statistics display

## Prerequisites
- Docker
- Docker Compose

## Quick Start

### Using Docker Compose (Recommended)

1. Clone repository:
```bash
git clone https://github.com/AymenAkhtar/SCDProject25.git
cd SCDProject25
```

2. Create .env file:
```bash
cat > .env << 'EOL'
MONGO_USERNAME=admin
MONGO_PASSWORD=secure123
DB_NAME=vaultDB
NODE_ENV=production
EOL
```

3. Build and run:
```bash
docker-compose up -d --build
```

4. Check status:
```bash
docker-compose ps
```

5. View logs:
```bash
docker-compose logs
```

6. Stop services:
```bash
docker-compose down
```

## Architecture

- **Backend**: Node.js application (CLI)
- **Database**: MongoDB 7.0
- **Network**: Isolated Docker network (vault-network)
- **Storage**: Persistent volume for MongoDB data

## Docker Images

- Backend: Built from Dockerfile (Node.js 16 Alpine)
- Database: mongo:7.0 (official image)

## Environment Variables

Required variables in `.env` file:
- `MONGO_USERNAME` - MongoDB admin username
- `MONGO_PASSWORD` - MongoDB admin password
- `DB_NAME` - Database name
- `NODE_ENV` - Environment (development/production)

## Project Structure
```
SCDProject25/
├── docker-compose.yml    # Service orchestration
├── Dockerfile            # Backend image definition
├── .env.example          # Environment template
├── package.json          # Node.js dependencies
├── main.js               # Application entry point
├── db/
│   └── mongodb.js        # Database connection
└── data/
    └── vault.json        # Local data storage
```

## Author

Aymen Akhtar

## Docker Hub

Backend image: https://hub.docker.com/r/aymenakhtar123/scdproject25-backend
