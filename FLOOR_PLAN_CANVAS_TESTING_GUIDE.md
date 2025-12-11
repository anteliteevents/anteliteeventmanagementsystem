# Floor Plan Canvas Editor - Testing Guide

## ✅ Enhanced Features Ready for Testing

### 🎨 Canvas Editor Features

1. **Drawing Shapes**
   - Click and drag on the canvas to draw rectangles
   - Works with or without background images
   - Grid is shown when no image is present

2. **Selecting Shapes**
   - Click on any shape to select it
   - Selected shapes show blue border and 8 resize handles
   - Selection handles appear at corners and edges

3. **Moving Shapes**
   - Click and drag a selected shape to move it
   - Cursor changes to "move" when hovering over a shape

4. **Resizing Shapes**
   - 8 resize handles: 4 corners + 4 edges
   - Hover over handles to see resize cursor (nw-resize, ne-resize, etc.)
   - Click and drag handles to resize
   - Minimum size: 20px (prevents shapes from becoming too small)

5. **Deleting Shapes**
   - Select a shape and press `Delete` or `Backspace` key
   - Or use the "🗑️ Delete" button in the toolbar

6. **Zoom Controls**
   - Use 🔍+ and 🔍- buttons to zoom in/out
   - Current zoom level is displayed (e.g., "100%")
   - Use 🏠 Reset button to reset zoom and pan

### 📝 How to Test

1. **Create/Edit a Floor Plan**
   - Go to Admin Dashboard → Floor Plans
   - Create a new floor plan or edit an existing one
   - Click "Edit" to open the canvas editor

2. **Test Drawing**
   - Click and drag on the canvas to create rectangles
   - Try drawing multiple shapes
   - Test with and without background images

3. **Test Selection & Movement**
   - Click on a shape to select it
   - Drag the selected shape to move it
   - Verify the shape moves smoothly

4. **Test Resizing**
   - Select a shape
   - Hover over the resize handles (corners and edges)
   - Verify cursor changes to resize cursor
   - Click and drag handles to resize
   - Try all 8 handles (4 corners + 4 edges)

5. **Test Deletion**
   - Select a shape
   - Press `Delete` key
   - Or click the "🗑️ Delete" button
   - Verify shape is removed

6. **Test Zoom**
   - Use zoom controls to zoom in/out
   - Verify shapes remain interactive at different zoom levels
   - Reset view and verify it returns to default

7. **Test Saving**
   - Make changes to shapes
   - Click "Save" button
   - Reload the page and verify changes are saved

### 🐛 Known Issues / Notes

- Resize handles are only visible when a shape is selected
- Minimum shape size is 20px to prevent accidental tiny shapes
- Canvas works best with modern browsers (Chrome, Firefox, Edge)

### 🔄 Next Steps (After Testing)

Once testing is complete, we'll add:
- Publish/Unpublish functionality
- Public sales view page
- Booth click handler with reservation form
- Shape-to-booth assignment

### 📊 Database Migration

**Important:** Before testing, run the database migration to add the `is_published` field:

```sql
-- Run this SQL script
ALTER TABLE floor_plans 
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_floor_plans_is_published ON floor_plans(is_published);
CREATE INDEX IF NOT EXISTS idx_floor_plans_event_published ON floor_plans(event_id, is_published);
```

Or use the migration file: `database/add-floor-plan-published.sql`

---

**Happy Testing! 🎉**

