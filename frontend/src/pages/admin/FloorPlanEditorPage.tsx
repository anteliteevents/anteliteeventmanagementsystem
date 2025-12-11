/**
 * Floor Plan Editor Page
 * Full-featured canvas editor for creating and editing floor plans
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FloorPlanCanvasEditor, { CanvasShape } from '../../components/floor-plan/FloorPlanCanvasEditor';
import FloorPlanService, { FloorPlan } from '../../services/floor-plan.service';
import EventService from '../../services/event.service';
import { Event } from '../../types';
import './FloorPlanEditorPage.css';

const FloorPlanEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [floorPlan, setFloorPlan] = useState<FloorPlan | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedShape, setSelectedShape] = useState<CanvasShape | null>(null);
  const [shapes, setShapes] = useState<CanvasShape[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    loadFloorPlan();
  }, [id]);

  const loadFloorPlan = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const plan = await FloorPlanService.getFloorPlanById(id);
      setFloorPlan(plan);
      // Filter to only rectangle shapes for now (canvas editor only supports rectangles)
      const rectangleShapes = (plan.layoutData.shapes || []).filter(
        (shape): shape is CanvasShape => shape.type === 'rectangle'
      );
      setShapes(rectangleShapes);
      setImagePreview(plan.imageUrl || '');

      // Load event
      const eventData = await EventService.getEventById(plan.eventId);
      setEvent(eventData);
    } catch (error: any) {
      console.error('Error loading floor plan:', error);
      alert('Error loading floor plan: ' + error.message);
      navigate('/admin?view=floor-plans');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadImage = async () => {
    if (!imageFile || !id) return;

    try {
      setSaving(true);
      const result = await FloorPlanService.uploadImage(imageFile);
      
      // Update floor plan with new image URL
      const updated = await FloorPlanService.updateFloorPlan(id, {
        imageUrl: result.url
      });
      
      setFloorPlan(updated);
      setImagePreview(result.url);
      setImageFile(null);
      alert('Image uploaded successfully!');
    } catch (error: any) {
      alert('Error uploading image: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (!id) return;

    try {
      setSaving(true);
      const updatedLayoutData = {
        ...floorPlan!.layoutData,
        shapes: shapes
      };

      await FloorPlanService.updateFloorPlan(id, {
        layoutData: updatedLayoutData
      });

      alert('Floor plan saved successfully!');
    } catch (error: any) {
      alert('Error saving floor plan: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleShapeUpdate = (shape: CanvasShape) => {
    if (!selectedShape) return;

    const updatedShapes = shapes.map(s =>
      s.id === selectedShape.id ? { ...shape, id: s.id } : s
    );
    setShapes(updatedShapes);
    setSelectedShape(shape);
  };

  const handleAssignBooth = async () => {
    if (!selectedShape) {
      alert('Please select a shape first');
      return;
    }

    // TODO: Open booth selection modal
    const boothNumber = prompt('Enter booth number for this shape:');
    if (boothNumber) {
      const updatedShape = {
        ...selectedShape,
        boothNumber: boothNumber,
        label: boothNumber
      };
      handleShapeUpdate(updatedShape);
    }
  };

  if (loading) {
    return <div className="loading">Loading floor plan editor...</div>;
  }

  if (!floorPlan) {
    return <div className="error">Floor plan not found</div>;
  }

  return (
    <div className="floor-plan-editor-page">
      {/* Header */}
      <div className="editor-header">
        <div className="header-left">
          <button className="btn-back" onClick={() => navigate('/admin?view=floor-plans')}>
            ← Back
          </button>
          <div className="header-info">
            <h2>{floorPlan.name}</h2>
            {event && <p className="event-name">{event.name}</p>}
          </div>
        </div>
        <div className="header-actions">
          <button
            className="btn-secondary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : '💾 Save'}
          </button>
        </div>
      </div>

      <div className="editor-content">
        {/* Left Panel - Properties */}
        <div className="editor-sidebar">
          <div className="sidebar-section">
            <h3>📸 Background Image</h3>
            <div className="image-upload-area">
              {imagePreview ? (
                <div className="image-preview">
                  <img src={imagePreview} alt="Floor plan background" />
                  <button
                    className="btn-remove-image"
                    onClick={() => {
                      setImagePreview('');
                      setImageFile(null);
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <p>No image</p>
                </div>
              )}
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="image-upload" className="btn-upload">
                📁 Choose Image
              </label>
              {imageFile && (
                <button
                  className="btn-upload-confirm"
                  onClick={handleUploadImage}
                  disabled={saving}
                >
                  {saving ? 'Uploading...' : '⬆️ Upload'}
                </button>
              )}
            </div>
          </div>

          {/* Shape Properties */}
          {selectedShape && (
            <div className="sidebar-section">
              <h3>🎨 Shape Properties</h3>
              <div className="form-group">
                <label>Booth Number</label>
                <input
                  type="text"
                  value={selectedShape.boothNumber || ''}
                  onChange={(e) => handleShapeUpdate({
                    ...selectedShape,
                    boothNumber: e.target.value,
                    label: e.target.value
                  })}
                  placeholder="e.g., A1, B2"
                />
              </div>
              <div className="form-group">
                <label>Label</label>
                <input
                  type="text"
                  value={selectedShape.label || ''}
                  onChange={(e) => handleShapeUpdate({
                    ...selectedShape,
                    label: e.target.value
                  })}
                  placeholder="Display label"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>X Position</label>
                  <input
                    type="number"
                    value={Math.round(selectedShape.x)}
                    onChange={(e) => handleShapeUpdate({
                      ...selectedShape,
                      x: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>Y Position</label>
                  <input
                    type="number"
                    value={Math.round(selectedShape.y)}
                    onChange={(e) => handleShapeUpdate({
                      ...selectedShape,
                      y: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Width</label>
                  <input
                    type="number"
                    value={Math.round(selectedShape.width)}
                    onChange={(e) => handleShapeUpdate({
                      ...selectedShape,
                      width: parseFloat(e.target.value) || 0
                    })}
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label>Height</label>
                  <input
                    type="number"
                    value={Math.round(selectedShape.height)}
                    onChange={(e) => handleShapeUpdate({
                      ...selectedShape,
                      height: parseFloat(e.target.value) || 0
                    })}
                    min="1"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Color</label>
                <input
                  type="color"
                  value={selectedShape.color || '#90EE90'}
                  onChange={(e) => handleShapeUpdate({
                    ...selectedShape,
                    color: e.target.value
                  })}
                />
              </div>
              <button
                className="btn-primary"
                onClick={handleAssignBooth}
              >
                🔗 Assign Booth
              </button>
            </div>
          )}

          {/* Shapes List */}
          <div className="sidebar-section">
            <h3>📋 Shapes ({shapes.length})</h3>
            <div className="shapes-list">
              {shapes.length === 0 ? (
                <p className="empty-text">No shapes yet. Draw on the canvas to create shapes.</p>
              ) : (
                shapes.map(shape => (
                  <div
                    key={shape.id}
                    className={`shape-item ${selectedShape?.id === shape.id ? 'selected' : ''}`}
                    onClick={() => setSelectedShape(shape)}
                  >
                    <div className="shape-preview" style={{ backgroundColor: shape.color || '#90EE90' }} />
                    <div className="shape-info">
                      <div className="shape-label">{shape.boothNumber || shape.label || 'Shape'}</div>
                      <div className="shape-details">
                        {Math.round(shape.width)} × {Math.round(shape.height)}
                      </div>
                    </div>
                    <button
                      className="btn-delete-shape"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShapes(shapes.filter(s => s.id !== shape.id));
                        if (selectedShape?.id === shape.id) {
                          setSelectedShape(null);
                        }
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="editor-main">
          <FloorPlanCanvasEditor
            imageUrl={imagePreview || undefined}
            shapes={shapes}
            onShapesChange={setShapes}
            onShapeSelect={setSelectedShape}
            width={1200}
            height={800}
          />
        </div>
      </div>
    </div>
  );
};

export default FloorPlanEditorPage;

