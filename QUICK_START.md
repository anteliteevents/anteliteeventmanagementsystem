# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Setup Database

1. **Create PostgreSQL Database**
   ```bash
   createdb antelite_events
   ```

2. **Run Schema**
   ```bash
   psql -d antelite_events -f ../database/schema.sql
   ```

3. **(Optional) Seed Data**
   ```bash
   psql -d antelite_events -f ../database/seeds.sql
   ```

### Step 3: Configure Environment

**Backend:**
```bash
cd backend
cp .env.example .env
# Edit .env with your database credentials and API keys
```

**Frontend:**
```bash
cd frontend
cp .env.example .env
# Edit .env with your API URLs
```

### Step 4: Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### Step 5: Access Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/health

## 📋 What's Next?

1. **Review Documentation**
   - Read [README.md](README.md) for project overview
   - Check [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for file organization
   - Review [docs/development.md](docs/development.md) for development guidelines

2. **Start Development**
   - Implement authentication (see `docs/api/README.md`)
   - Build API endpoints
   - Create React components
   - Test real-time features with Socket.io

3. **Key Files to Review**
   - `project_config.md` - MVP requirements
   - `.cursor/rules/global.mdc` - Development rules
   - `database/schema.sql` - Database structure

## 🛠️ Common Commands

```bash
# Backend
npm run dev      # Start development server
npm run build    # Build for production
npm test         # Run tests

# Frontend
npm start        # Start development server
npm run build    # Build for production
npm test         # Run tests
```

## ❓ Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check connection string in `.env`
- Verify database exists

### Port Already in Use
- Change PORT in backend `.env`
- Update REACT_APP_API_URL in frontend `.env`

### Module Not Found
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

## 📚 Additional Resources

- [Architecture Documentation](docs/architecture.md)
- [API Documentation](docs/api/README.md)
- [Development Guidelines](docs/development.md)

