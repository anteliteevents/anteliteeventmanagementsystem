# 🔍 Where to Find CRUD Operations

**Quick Guide to Access All CRUD & Duplicate Operations**

---

## 📍 1. **Documentation Report**

**File Location:** `CRUD_DUPLICATE_OPERATIONS_REPORT.md`

This file contains:
- ✅ Complete list of all CRUD operations
- ✅ All API endpoints
- ✅ Request/response examples
- ✅ Security details
- ✅ Testing checklist

**How to Access:**
- Open the file in your project root: `CRUD_DUPLICATE_OPERATIONS_REPORT.md`

---

## 📍 2. **Backend API Endpoints** (Ready to Use)

All CRUD operations are available via REST API endpoints:

### **Users CRUD**
```
POST   /api/users                    - Create user
GET    /api/users                    - Get all users
GET    /api/users/:id                - Get user by ID
PUT    /api/users/:id                - Update user
DELETE /api/users/:id                - Delete user
POST   /api/users/:id/duplicate      - Duplicate user
```

### **Proposals CRUD**
```
POST   /api/proposals                        - Create proposal
GET    /api/proposals/event/:eventId         - Get event proposals
GET    /api/proposals/:id                    - Get proposal by ID
PUT    /api/proposals/:id                    - Update proposal
DELETE /api/proposals/:id                    - Delete proposal
POST   /api/proposals/:id/duplicate          - Duplicate proposal
```

### **Proposal Templates CRUD**
```
GET    /api/proposals/templates              - Get all templates
GET    /api/proposals/templates/:id          - Get template by ID
POST   /api/proposals/templates              - Create template
PUT    /api/proposals/templates/:id          - Update template
DELETE /api/proposals/templates/:id         - Delete template
POST   /api/proposals/templates/:id/duplicate - Duplicate template
```

### **Policies CRUD**
```
POST   /api/policies                    - Create policy
GET    /api/policies                    - Get all policies
GET    /api/policies/:id                - Get policy by ID
PUT    /api/policies/:id                - Update policy
DELETE /api/policies/:id                - Delete policy
POST   /api/policies/:id/duplicate      - Duplicate policy
```

### **Costing - Costs CRUD**
```
POST   /api/costing/costs                    - Add cost
GET    /api/costing/costs/event/:eventId    - Get event costs
GET    /api/costing/costs/:id               - Get cost by ID
PUT    /api/costing/costs/:id                - Update cost
DELETE /api/costing/costs/:id                - Delete cost
POST   /api/costing/costs/:id/duplicate      - Duplicate cost
```

### **Costing - Budgets CRUD**
```
POST   /api/costing/budget                   - Set budget
GET    /api/costing/budget/event/:eventId    - Get event budget
GET    /api/costing/budget/:id               - Get budget by ID
PUT    /api/costing/budget/:id               - Update budget
DELETE /api/costing/budget/:id               - Delete budget
POST   /api/costing/budget/:id/duplicate     - Duplicate budget
```

### **Invoices CRUD**
```
GET    /api/invoices                    - Get all invoices
GET    /api/invoices/:id                - Get invoice by ID
PUT    /api/invoices/:id                - Update invoice
DELETE /api/invoices/:id                - Delete invoice
POST   /api/invoices/:id/duplicate      - Duplicate invoice
```

### **Reservations CRUD**
```
GET    /api/reservations                    - Get all reservations
GET    /api/reservations/:id                - Get reservation by ID
PUT    /api/reservations/:id                - Update reservation
DELETE /api/reservations/:id                - Delete reservation
POST   /api/reservations/:id/duplicate      - Duplicate reservation
```

### **Events CRUD** (Already existed)
```
POST   /api/events                    - Create event
GET    /api/events                    - Get all events
GET    /api/events/:id                - Get event by ID
PUT    /api/events/:id                - Update event
DELETE /api/events/:id                - Delete event
POST   /api/events/:id/duplicate      - Duplicate event
```

### **Booths CRUD** (Already existed)
```
POST   /api/admin/booths                    - Create booth
GET    /api/admin/booths                    - Get all booths
GET    /api/admin/booths/:id                - Get booth by ID
PUT    /api/admin/booths/:id                - Update booth
DELETE /api/admin/booths/:id                - Delete booth
POST   /api/admin/booths/:id/duplicate      - Duplicate booth
```

---

## 📍 3. **Backend Code Files**

### **Controllers** (Business Logic)
- `backend/src/controllers/users.controller.ts` - User CRUD operations
- `backend/src/controllers/invoices.controller.ts` - Invoice CRUD operations
- `backend/src/controllers/reservations.controller.ts` - Reservation CRUD operations
- `backend/src/controllers/event.controller.ts` - Event CRUD operations
- `backend/src/controllers/booths.controller.ts` - Booth CRUD operations

### **Services** (Module Business Logic)
- `backend/src/modules/proposals/services/proposals.service.ts` - Proposal CRUD
- `backend/src/modules/policies/services/policies.service.ts` - Policy CRUD
- `backend/src/modules/costing/services/costing.service.ts` - Costing CRUD

### **Routes** (API Endpoints)
- `backend/src/routes/users.routes.ts` - User routes
- `backend/src/routes/invoices.routes.ts` - Invoice routes
- `backend/src/routes/reservations.routes.ts` - Reservation routes
- `backend/src/modules/proposals/routes/index.ts` - Proposal routes
- `backend/src/modules/policies/routes/index.ts` - Policy routes
- `backend/src/modules/costing/routes/index.ts` - Costing routes

### **Models** (Database Operations)
- `backend/src/models/user.model.ts` - User database operations
- `backend/src/models/invoice.model.ts` - Invoice database operations
- `backend/src/models/reservation.model.ts` - Reservation database operations

---

## 📍 4. **Frontend UI** (Currently Available)

### **Admin Dashboard Views:**
- `frontend/src/pages/admin/UsersManagementView.tsx` - Users management
- `frontend/src/pages/admin/EventsManagementView.tsx` - Events management
- `frontend/src/pages/admin/BoothsManagementView.tsx` - Booths management

### **Department Views:**
- `frontend/src/pages/admin/components/ProposalsDepartmentView.tsx` - Proposals (view only)
- `frontend/src/pages/admin/components/PoliciesDepartmentView.tsx` - Policies (view only)
- `frontend/src/pages/admin/components/CostingDepartmentView.tsx` - Costing (view only)
- `frontend/src/pages/admin/components/PaymentsDepartmentView.tsx` - Payments (view only)

**⚠️ Note:** The frontend UI currently shows data but may not have full CRUD forms yet. You can:
1. Use the API endpoints directly (via Postman, curl, or frontend API calls)
2. Add CRUD forms to the existing views

---

## 📍 5. **How to Test CRUD Operations**

### **Option 1: Using API Testing Tool (Postman/Insomnia)**

1. **Set up authentication:**
   ```
   POST /api/auth/login
   Body: { "email": "admin@example.com", "password": "password" }
   ```
   Copy the `token` from response

2. **Add Authorization header:**
   ```
   Authorization: Bearer <your-token>
   ```

3. **Test CRUD operations:**
   - Use the endpoints listed above
   - All endpoints require admin role

### **Option 2: Using cURL**

```bash
# Get all users
curl -X GET http://localhost:3001/api/users \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create user
curl -X POST http://localhost:3001/api/users \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "exhibitor"
  }'

# Update user
curl -X PUT http://localhost:3001/api/users/USER_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith"
  }'

# Delete user
curl -X DELETE http://localhost:3001/api/users/USER_ID \
  -H "Authorization: Bearer YOUR_TOKEN"

# Duplicate user
curl -X POST http://localhost:3001/api/users/USER_ID/duplicate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "copy@example.com"
  }'
```

### **Option 3: Using Frontend API Service**

The frontend has an API service at `frontend/src/services/api.ts`. You can use it in React components:

```typescript
import api from '../services/api';

// Get all users
const users = await api.get('/users');

// Create user
const newUser = await api.post('/users', {
  email: 'user@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe'
});

// Update user
const updated = await api.put(`/users/${userId}`, {
  firstName: 'Jane'
});

// Delete user
await api.delete(`/users/${userId}`);

// Duplicate user
const duplicated = await api.post(`/users/${userId}/duplicate`, {
  email: 'copy@example.com'
});
```

---

## 📍 6. **Quick Access Summary**

| Feature | Backend API | Frontend UI | Documentation |
|---------|-------------|-------------|---------------|
| Users | ✅ Ready | ✅ UsersManagementView | ✅ Report |
| Events | ✅ Ready | ✅ EventsManagementView | ✅ Report |
| Booths | ✅ Ready | ✅ BoothsManagementView | ✅ Report |
| Proposals | ✅ Ready | ⚠️ View only | ✅ Report |
| Templates | ✅ Ready | ❌ Not yet | ✅ Report |
| Policies | ✅ Ready | ⚠️ View only | ✅ Report |
| Costs | ✅ Ready | ⚠️ View only | ✅ Report |
| Budgets | ✅ Ready | ⚠️ View only | ✅ Report |
| Invoices | ✅ Ready | ❌ Not yet | ✅ Report |
| Reservations | ✅ Ready | ❌ Not yet | ✅ Report |

---

## 🎯 **Next Steps**

1. **To see the code:** Check the files listed in section 3
2. **To test the API:** Use Postman/curl with the endpoints in section 2
3. **To see documentation:** Open `CRUD_DUPLICATE_OPERATIONS_REPORT.md`
4. **To add UI forms:** Update the frontend views to include CRUD forms

---

## 📝 **Summary**

✅ **All CRUD operations are implemented in the backend**  
✅ **All API endpoints are ready to use**  
✅ **Complete documentation is available**  
⚠️ **Frontend UI forms may need to be added for some features**

**The CRUD operations exist and work - they're just accessed via API endpoints right now!**

