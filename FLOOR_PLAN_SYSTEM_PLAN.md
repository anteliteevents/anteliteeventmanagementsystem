# 🗺️ Floor Plan System - Comprehensive Plan

## 📊 Current State Analysis

### ✅ What Exists
1. **Database Schema**
   - `floor_plans` table with `layout_data` (JSONB)
   - Booths have `location_x`, `location_y`, `width`, `height` fields
   - Support for zones in type definitions

2. **Backend Service** (`floor-plan.service.ts`)
   - `getFloorPlan()` - Get floor plan for event
   - `generateSVG()` - Generate SVG from booth data
   - `saveFloorPlan()` - Save floor plan (basic)

3. **Backend Route**
   - `GET /api/sales/floor-plan/:eventId` - Get floor plan with SVG

4. **Frontend Component** (`SVGFloorPlan.tsx`)
   - Displays floor plan with booths
   - Real-time updates via WebSocket
   - Interactive booth selection
   - Color-coded by status

### ❌ What's Missing
1. **CRUD Operations** - Only GET exists, no CREATE, UPDATE, DELETE, DUPLICATE
2. **Admin UI** - No interface to manage floor plans
3. **Visual Editor** - No drag-and-drop editor to create/edit layouts
4. **Zone Management** - Zones defined but not fully implemented
5. **Booth Positioning** - No visual tool to position booths on floor plan
6. **Image Upload** - `image_url` field exists but no upload functionality
7. **Multiple Plans** - Currently only gets latest, no way to manage multiple plans per event

---

## 🎯 Proposed Features

### Phase 1: Core CRUD Operations
1. **Backend API**
   - `POST /api/floor-plans` - Create new floor plan
   - `GET /api/floor-plans/:id` - Get specific floor plan
   - `PUT /api/floor-plans/:id` - Update floor plan
   - `DELETE /api/floor-plans/:id` - Delete floor plan
   - `POST /api/floor-plans/:id/duplicate` - Duplicate floor plan
   - `GET /api/floor-plans/event/:eventId` - Get all floor plans for event

2. **Enhanced Service Methods**
   - `createFloorPlan()` - Create with validation
   - `updateFloorPlan()` - Update with validation
   - `deleteFloorPlan()` - Delete with cascade checks
   - `duplicateFloorPlan()` - Clone existing plan
   - `getFloorPlansByEvent()` - Get all plans for event

### Phase 2: Visual Floor Plan Editor
1. **Editor Component** (`FloorPlanEditor.tsx`)
   - Grid-based canvas (configurable cell size)
   - Drag-and-drop booth placement
   - Resize booths (width/height)
   - Visual grid overlay
   - Zoom in/out
   - Pan/drag canvas
   - Undo/redo functionality

2. **Editor Features**
   - Set grid dimensions (width x height)
   - Set cell size (pixels per grid cell)
   - Add/remove booths visually
   - Position booths by dragging
   - Resize booths by dragging corners
   - Snap to grid option
   - Show/hide grid lines
   - Background image support

### Phase 3: Zone Management
1. **Zone Features**
   - Create zones (rectangular areas)
   - Name zones (e.g., "Premium Zone", "Standard Zone")
   - Color-code zones
   - Assign booths to zones automatically
   - Zone pricing rules (optional)
   - Zone capacity limits

2. **Zone UI**
   - Visual zone creation (draw rectangles)
   - Zone list panel
   - Zone properties editor
   - Assign booths to zones

### Phase 4: Admin Management UI
1. **Floor Plan Management View**
   - List all floor plans (with event filter)
   - Create new floor plan button
   - Edit/Delete/Duplicate actions
   - Preview floor plan
   - Set as default for event

2. **Floor Plan Editor Page**
   - Full-screen editor
   - Toolbar with tools
   - Properties panel
   - Booth list panel
   - Zone management panel
   - Save/Cancel buttons

### Phase 5: Advanced Features
1. **Image Upload**
   - Upload floor plan background image
   - Image overlay on grid
   - Adjust image opacity
   - Image positioning/scaling

2. **Booth Auto-Positioning**
   - Auto-arrange booths in grid
   - Auto-position based on booth number
   - Smart spacing algorithm

3. **Export/Import**
   - Export floor plan as JSON
   - Export as SVG
   - Export as PNG/PDF
   - Import from JSON

4. **Templates**
   - Save floor plan as template
   - Apply template to new event
   - Template library

---

## 🏗️ Architecture

### Backend Structure
```
backend/src/
├── modules/
│   └── floor-plans/
│       ├── routes/
│       │   └── index.ts          # Floor plan routes
│       ├── services/
│       │   └── floor-plan.service.ts  # Enhanced service
│       ├── controllers/
│       │   └── floor-plan.controller.ts  # New controller
│       └── models/
│           └── floor-plan.model.ts     # Database model
```

### Frontend Structure
```
frontend/src/
├── pages/
│   └── admin/
│       └── FloorPlanManagementView.tsx  # Management UI
├── components/
│   ├── floor-plan/
│   │   ├── FloorPlanEditor.tsx          # Visual editor
│   │   ├── FloorPlanCanvas.tsx          # Canvas component
│   │   ├── BoothDraggable.tsx           # Draggable booth
│   │   ├── ZoneEditor.tsx                # Zone creation
│   │   └── FloorPlanToolbar.tsx         # Editor toolbar
│   └── SVGFloorPlan.tsx                 # Existing viewer (enhanced)
```

---

## 📋 Implementation Steps

### Step 1: Backend CRUD API
- [ ] Create `floor-plan.controller.ts`
- [ ] Create `floor-plan.model.ts`
- [ ] Create routes in `floor-plans/routes/index.ts`
- [ ] Enhance `floor-plan.service.ts` with CRUD methods
- [ ] Add validation for layout data
- [ ] Register routes in `server.ts`

### Step 2: Frontend Service
- [ ] Create `floor-plan.service.ts` in frontend
- [ ] Add API methods for CRUD operations
- [ ] Add TypeScript types

### Step 3: Visual Editor Component
- [ ] Create `FloorPlanEditor.tsx` base component
- [ ] Implement grid canvas
- [ ] Add drag-and-drop for booths
- [ ] Add resize handles
- [ ] Add zoom/pan controls
- [ ] Add toolbar

### Step 4: Zone Management
- [ ] Create `ZoneEditor.tsx` component
- [ ] Add zone creation (draw rectangles)
- [ ] Add zone properties panel
- [ ] Implement zone-booth assignment

### Step 5: Admin UI
- [ ] Create `FloorPlanManagementView.tsx`
- [ ] Add floor plan list
- [ ] Add create/edit modals
- [ ] Integrate editor component
- [ ] Add preview functionality

### Step 6: Integration
- [ ] Connect editor to backend API
- [ ] Add real-time updates
- [ ] Add error handling
- [ ] Add loading states
- [ ] Add success/error notifications

---

## 🎨 UI/UX Design

### Floor Plan Editor Layout
```
┌─────────────────────────────────────────────────────┐
│  [Toolbar] [Zoom] [Grid] [Snap] [Undo] [Redo] [Save]│
├──────────────┬───────────────────────────────────────┤
│              │                                       │
│  Properties  │         Canvas (Grid)                │
│  Panel       │                                       │
│              │    [Booths Draggable Here]           │
│  - Grid Size │                                       │
│  - Cell Size │                                       │
│  - Zones     │                                       │
│              │                                       │
│  Booth List  │                                       │
│  - A1        │                                       │
│  - A2        │                                       │
│  - B1        │                                       │
└──────────────┴───────────────────────────────────────┘
```

### Color Scheme
- **Available Booths**: Light Green (#90EE90)
- **Reserved Booths**: Gold (#FFD700)
- **Booked Booths**: Red (#FF6B6B)
- **Unavailable Booths**: Gray (#CCCCCC)
- **Selected Booth**: Blue (#4A90E2)
- **Zones**: Semi-transparent overlays with different colors

---

## 🔧 Technical Details

### Layout Data Structure
```typescript
interface LayoutData {
  gridWidth: number;        // Grid columns
  gridHeight: number;       // Grid rows
  cellSize: number;         // Pixels per cell
  zones?: Zone[];           // Zone definitions
  backgroundImage?: {
    url: string;
    opacity: number;
    x: number;
    y: number;
    scale: number;
  };
}

interface Zone {
  id: string;
  name: string;
  color: string;
  x: number;               // Grid position
  y: number;               // Grid position
  width: number;            // Grid width
  height: number;          // Grid height
  booths: string[];        // Booth IDs in zone
}
```

### Booth Positioning
- Booths use `location_x`, `location_y` (grid coordinates)
- `width`, `height` in grid cells
- Editor updates booth positions in real-time
- Changes saved to database

---

## 🚀 Quick Start Implementation

Would you like me to start implementing? I suggest we begin with:

1. **Backend CRUD API** (Step 1) - Foundation for everything
2. **Admin Management UI** (Step 5) - Basic list/create/edit
3. **Visual Editor** (Step 3) - Core editing functionality
4. **Zone Management** (Step 4) - Advanced feature
5. **Image Upload** (Step 5) - Polish

Let me know which phase you'd like to start with, or if you want me to implement all of them!

