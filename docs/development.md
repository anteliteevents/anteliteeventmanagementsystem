# Development Guidelines

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+
- Git

### Initial Setup

1. **Clone and Install**
   ```bash
   git clone <repository>
   cd anteliteeventssystem
   
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

2. **Database Setup**
   ```bash
   # Create database
   createdb antelite_events
   
   # Run schema
   psql -d antelite_events -f ../database/schema.sql
   
   # (Optional) Seed data
   psql -d antelite_events -f ../database/seeds.sql
   ```

3. **Environment Configuration**
   ```bash
   # Backend
   cd backend
   cp .env.example .env
   # Edit .env with your configuration
   
   # Frontend
   cd ../frontend
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start Development Servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

## Code Style

### TypeScript
- Use strict mode
- Prefer interfaces over types for object shapes
- Use meaningful variable and function names
- Add JSDoc comments for public functions

### React
- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use TypeScript for all components

### Backend
- Follow RESTful conventions
- Use async/await for asynchronous operations
- Implement proper error handling
- Validate all inputs

## Git Workflow

### Branch Naming
- `main` - Production-ready code
- `develop` - Development branch
- `feature/feature-name` - New features
- `bugfix/bug-name` - Bug fixes
- `hotfix/issue-name` - Critical fixes

### Commit Messages
Follow conventional commits:
```
feat: add booth selection component
fix: resolve socket connection issue
docs: update API documentation
refactor: reorganize service layer
test: add unit tests for auth service
```

## Testing

### Frontend Tests
```bash
cd frontend
npm test
```

### Backend Tests
```bash
cd backend
npm test
```

### Test Coverage
- Aim for 80%+ coverage
- Test critical paths: authentication, payments, reservations

## Code Review Checklist

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] No console.logs or debug code
- [ ] Environment variables are in .env.example
- [ ] API endpoints are documented
- [ ] Error handling is implemented
- [ ] Security considerations addressed
- [ ] Performance optimizations applied

## Debugging

### Backend
- Use `console.log` for development (remove before commit)
- Check server logs in terminal
- Use PostgreSQL query logs
- Use Postman/Insomnia for API testing

### Frontend
- Use React DevTools
- Check browser console
- Use Network tab for API calls
- Use Redux DevTools (if applicable)

## Common Tasks

### Adding a New API Endpoint
1. Create route in `backend/src/routes/`
2. Create controller in `backend/src/controllers/`
3. Add service logic in `backend/src/services/`
4. Update API documentation
5. Add tests

### Adding a New React Component
1. Create component in appropriate folder
2. Add TypeScript types
3. Create tests
4. Add to storybook (if applicable)

### Database Migration
1. Create migration file in `backend/migrations/`
2. Test migration on development database
3. Update schema.sql if needed
4. Document changes

## Performance Tips

- Use database indexes for frequently queried columns
- Implement pagination for list endpoints
- Use React.memo for expensive components
- Lazy load routes and components
- Optimize images and assets
- Use connection pooling for database

## Security Best Practices

- Never commit .env files
- Hash all passwords with bcrypt
- Validate and sanitize all inputs
- Use parameterized queries (prevent SQL injection)
- Implement rate limiting
- Use HTTPS in production
- Keep dependencies updated

## Troubleshooting

### Database Connection Issues
- Check PostgreSQL is running
- Verify connection string in .env
- Check firewall settings

### Socket.io Connection Issues
- Verify CORS settings
- Check socket URL in frontend .env
- Ensure backend socket server is running

### Build Errors
- Clear node_modules and reinstall
- Check Node.js version compatibility
- Verify TypeScript version

## Resources

- [React Documentation](https://react.dev)
- [Express Documentation](https://expressjs.com)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Socket.io Documentation](https://socket.io/docs/)
- [Stripe Documentation](https://stripe.com/docs)

