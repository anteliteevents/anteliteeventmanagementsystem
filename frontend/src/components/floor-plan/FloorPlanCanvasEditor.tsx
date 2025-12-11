/**
 * Floor Plan Canvas Editor
 * Canvas-based editor similar to n8n, allowing drawing shapes on images
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import './FloorPlanCanvasEditor.css';

export interface CanvasShape {
  id: string;
  type: 'rectangle' | 'circle' | 'polygon';
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  strokeColor?: string;
  strokeWidth?: number;
  boothId?: string;
  boothNumber?: string;
  label?: string;
  metadata?: any;
}

interface FloorPlanCanvasEditorProps {
  imageUrl?: string;
  shapes?: CanvasShape[];
  onShapesChange?: (shapes: CanvasShape[]) => void;
  onShapeSelect?: (shape: CanvasShape | null) => void;
  readOnly?: boolean;
  width?: number;
  height?: number;
}

const FloorPlanCanvasEditor: React.FC<FloorPlanCanvasEditorProps> = ({
  imageUrl,
  shapes = [],
  onShapesChange,
  onShapeSelect,
  readOnly = false,
  width = 1200,
  height = 800
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [currentShape, setCurrentShape] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [resizeStartPos, setResizeStartPos] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Load image
  useEffect(() => {
    if (imageUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        imageRef.current = img;
        setImageLoaded(true);
        draw();
      };
      img.onerror = () => {
        console.error('Failed to load image:', imageUrl);
        setImageLoaded(false);
      };
      img.src = imageUrl;
    } else {
      setImageLoaded(false);
      draw();
    }
  }, [imageUrl]);

  // Draw function
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply zoom and pan
    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    // Draw background image or grid
    if (imageRef.current && imageLoaded) {
      // Draw image background
      ctx.drawImage(imageRef.current, 0, 0, canvas.width / zoom, canvas.height / zoom);
    } else {
      // Draw grid background (when no image)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width / zoom, canvas.height / zoom);
      
      // Draw grid lines (more visible)
      ctx.strokeStyle = '#d0d0d0';
      ctx.lineWidth = 1;
      const gridSize = 50;
      
      // Draw vertical lines
      for (let x = 0; x < canvas.width / zoom; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height / zoom);
        ctx.stroke();
      }
      
      // Draw horizontal lines
      for (let y = 0; y < canvas.height / zoom; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width / zoom, y);
        ctx.stroke();
      }
      
      // Draw thicker lines every 5 grid cells (250px)
      ctx.strokeStyle = '#b0b0b0';
      ctx.lineWidth = 2;
      const majorGridSize = gridSize * 5;
      for (let x = 0; x < canvas.width / zoom; x += majorGridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height / zoom);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height / zoom; y += majorGridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width / zoom, y);
        ctx.stroke();
      }
    }

    // Draw shapes
    shapes.forEach(shape => {
      const isSelected = shape.id === selectedShapeId;
      
      // Draw shape
      ctx.fillStyle = shape.color || (isSelected ? 'rgba(74, 144, 226, 0.3)' : 'rgba(144, 238, 144, 0.3)');
      ctx.strokeStyle = shape.strokeColor || (isSelected ? '#4A90E2' : '#333');
      ctx.lineWidth = shape.strokeWidth || (isSelected ? 3 : 2);
      
      if (shape.type === 'rectangle') {
        ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      }

      // Draw label
      if (shape.label || shape.boothNumber) {
        ctx.fillStyle = '#333';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const label = shape.boothNumber || shape.label || '';
        ctx.fillText(
          label,
          shape.x + shape.width / 2,
          shape.y + shape.height / 2
        );
      }

      // Draw selection handles
      if (isSelected && !readOnly) {
        ctx.fillStyle = '#4A90E2';
        const handleSize = 8;
        const handles = [
          { x: shape.x, y: shape.y }, // top-left
          { x: shape.x + shape.width, y: shape.y }, // top-right
          { x: shape.x + shape.width, y: shape.y + shape.height }, // bottom-right
          { x: shape.x, y: shape.y + shape.height }, // bottom-left
        ];
        handles.forEach(handle => {
          ctx.fillRect(handle.x - handleSize / 2, handle.y - handleSize / 2, handleSize, handleSize);
        });
      }
    });

    // Draw current shape being drawn
    if (currentShape) {
      ctx.fillStyle = 'rgba(74, 144, 226, 0.2)';
      ctx.strokeStyle = '#4A90E2';
      ctx.lineWidth = 2;
      ctx.fillRect(currentShape.x, currentShape.y, currentShape.width, currentShape.height);
      ctx.strokeRect(currentShape.x, currentShape.y, currentShape.width, currentShape.height);
    }

    ctx.restore();
  }, [shapes, selectedShapeId, currentShape, zoom, pan, imageLoaded, readOnly]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Get mouse position relative to canvas
  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;
    return { x, y };
  };

  // Check if point is inside shape
  const isPointInShape = (point: { x: number; y: number }, shape: CanvasShape): boolean => {
    return (
      point.x >= shape.x &&
      point.x <= shape.x + shape.width &&
      point.y >= shape.y &&
      point.y <= shape.y + shape.height
    );
  };

  // Get shape at point
  const getShapeAtPoint = (point: { x: number; y: number }): CanvasShape | null => {
    // Check from last to first (top to bottom)
    for (let i = shapes.length - 1; i >= 0; i--) {
      if (isPointInShape(point, shapes[i])) {
        return shapes[i];
      }
    }
    return null;
  };

  // Get resize handle at point
  const getResizeHandleAtPoint = (point: { x: number; y: number }, shape: CanvasShape): string | null => {
    const handleSize = 10;
    const handles = [
      { x: shape.x, y: shape.y, type: 'nw' },
      { x: shape.x + shape.width, y: shape.y, type: 'ne' },
      { x: shape.x + shape.width, y: shape.y + shape.height, type: 'se' },
      { x: shape.x, y: shape.y + shape.height, type: 'sw' },
      { x: shape.x + shape.width / 2, y: shape.y, type: 'n' },
      { x: shape.x + shape.width, y: shape.y + shape.height / 2, type: 'e' },
      { x: shape.x + shape.width / 2, y: shape.y + shape.height, type: 's' },
      { x: shape.x, y: shape.y + shape.height / 2, type: 'w' },
    ];

    for (const handle of handles) {
      if (
        point.x >= handle.x - handleSize / 2 &&
        point.x <= handle.x + handleSize / 2 &&
        point.y >= handle.y - handleSize / 2 &&
        point.y <= handle.y + handleSize / 2
      ) {
        return handle.type;
      }
    }
    return null;
  };

  // Mouse down handler
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (readOnly) return;

    const pos = getMousePos(e);
    const clickedShape = getShapeAtPoint(pos);

    if (clickedShape) {
      // Check if clicking on resize handle
      const handle = getResizeHandleAtPoint(pos, clickedShape);
      if (handle && selectedShapeId === clickedShape.id) {
        // Start resizing
        setIsResizing(true);
        setResizeHandle(handle);
        setResizeStartPos({
          x: pos.x,
          y: pos.y,
          width: clickedShape.width,
          height: clickedShape.height
        });
      } else {
        // Start dragging
        setSelectedShapeId(clickedShape.id);
        setIsDragging(true);
        setDragOffset({
          x: pos.x - clickedShape.x,
          y: pos.y - clickedShape.y
        });
        onShapeSelect?.(clickedShape);
      }
    } else {
      // Start drawing new shape
      setSelectedShapeId(null);
      setIsDrawing(true);
      setStartPos(pos);
      setCurrentShape({ x: pos.x, y: pos.y, width: 0, height: 0 });
      onShapeSelect?.(null);
    }
  };

  // Mouse move handler
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);

    if (isResizing && selectedShapeId && resizeHandle && resizeStartPos) {
      // Update shape size
      const shape = shapes.find(s => s.id === selectedShapeId);
      if (shape) {
        let newX = shape.x;
        let newY = shape.y;
        let newWidth = shape.width;
        let newHeight = shape.height;

        const deltaX = pos.x - resizeStartPos.x;
        const deltaY = pos.y - resizeStartPos.y;

        // Handle different resize handles
        if (resizeHandle.includes('e')) {
          newWidth = Math.max(20, resizeStartPos.width + deltaX);
        }
        if (resizeHandle.includes('w')) {
          newWidth = Math.max(20, resizeStartPos.width - deltaX);
          newX = shape.x + (shape.width - newWidth);
        }
        if (resizeHandle.includes('s')) {
          newHeight = Math.max(20, resizeStartPos.height + deltaY);
        }
        if (resizeHandle.includes('n')) {
          newHeight = Math.max(20, resizeStartPos.height - deltaY);
          newY = shape.y + (shape.height - newHeight);
        }

        const newShapes = shapes.map(s =>
          s.id === selectedShapeId
            ? { ...s, x: newX, y: newY, width: newWidth, height: newHeight }
            : s
        );
        onShapesChange?.(newShapes);
      }
    } else if (isDragging && selectedShapeId && dragOffset) {
      // Update shape position
      const shape = shapes.find(s => s.id === selectedShapeId);
      if (shape) {
        const newShapes = shapes.map(s =>
          s.id === selectedShapeId
            ? { ...s, x: pos.x - dragOffset.x, y: pos.y - dragOffset.y }
            : s
        );
        onShapesChange?.(newShapes);
      }
    } else if (isDrawing && startPos) {
      // Update current shape being drawn
      const width = pos.x - startPos.x;
      const height = pos.y - startPos.y;
      setCurrentShape({
        x: Math.min(startPos.x, pos.x),
        y: Math.min(startPos.y, pos.y),
        width: Math.abs(width),
        height: Math.abs(height)
      });
    } else if (selectedShapeId && !readOnly) {
      // Update cursor based on hover over resize handles
      const shape = shapes.find(s => s.id === selectedShapeId);
      if (shape) {
        const handle = getResizeHandleAtPoint(pos, shape);
        const canvas = canvasRef.current;
        if (canvas) {
          if (handle) {
            const cursors: { [key: string]: string } = {
              'nw': 'nw-resize', 'ne': 'ne-resize', 'se': 'se-resize', 'sw': 'sw-resize',
              'n': 'n-resize', 'e': 'e-resize', 's': 's-resize', 'w': 'w-resize'
            };
            canvas.style.cursor = cursors[handle] || 'default';
          } else if (isPointInShape(pos, shape)) {
            canvas.style.cursor = 'move';
          } else {
            canvas.style.cursor = 'default';
          }
        }
      }
    }
  };

  // Mouse up handler
  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawing && startPos && currentShape && currentShape.width > 10 && currentShape.height > 10) {
      // Create new shape
      const newShape: CanvasShape = {
        id: `shape-${Date.now()}-${Math.random()}`,
        type: 'rectangle',
        x: currentShape.x,
        y: currentShape.y,
        width: currentShape.width,
        height: currentShape.height,
        color: 'rgba(144, 238, 144, 0.3)',
        strokeColor: '#333',
        strokeWidth: 2
      };
      onShapesChange?.([...shapes, newShape]);
      setSelectedShapeId(newShape.id);
      onShapeSelect?.(newShape);
    }

    setIsDrawing(false);
    setIsDragging(false);
    setIsResizing(false);
    setStartPos(null);
    setCurrentShape(null);
    setDragOffset(null);
    setResizeHandle(null);
    setResizeStartPos(null);
  };

  // Delete selected shape
  const deleteSelectedShape = () => {
    if (selectedShapeId && !readOnly) {
      const newShapes = shapes.filter(s => s.id !== selectedShapeId);
      onShapesChange?.(newShapes);
      setSelectedShapeId(null);
      onShapeSelect?.(null);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (readOnly) return;
      
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedShapeId) {
          deleteSelectedShape();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedShapeId, shapes, readOnly]);

  return (
    <div className="floor-plan-canvas-editor" ref={containerRef}>
      {/* Toolbar */}
      {!readOnly && (
        <div className="canvas-toolbar">
          <div className="toolbar-group">
            <button
              className="toolbar-btn"
              onClick={() => setZoom(prev => Math.min(prev + 0.1, 3))}
              title="Zoom In"
            >
              🔍+
            </button>
            <button
              className="toolbar-btn"
              onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.5))}
              title="Zoom Out"
            >
              🔍-
            </button>
            <span className="zoom-level">{Math.round(zoom * 100)}%</span>
          </div>
          <div className="toolbar-group">
            <button
              className="toolbar-btn"
              onClick={() => {
                setPan({ x: 0, y: 0 });
                setZoom(1);
              }}
              title="Reset View"
            >
              🏠 Reset
            </button>
          </div>
          {selectedShapeId && (
            <div className="toolbar-group">
              <button
                className="toolbar-btn danger"
                onClick={deleteSelectedShape}
                title="Delete Shape (Del)"
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>
      )}

      {/* Canvas Container */}
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {
            setIsDrawing(false);
            setIsDragging(false);
            setIsResizing(false);
            setCurrentShape(null);
            const canvas = canvasRef.current;
            if (canvas) canvas.style.cursor = 'default';
          }}
          className="floor-plan-canvas"
          style={{ cursor: isDrawing ? 'crosshair' : 'default' }}
        />
      </div>

      {/* Instructions */}
      {!readOnly && (
        <div className="canvas-instructions">
          <p>💡 <strong>Instructions:</strong></p>
          <ul>
            <li>Click and drag to draw a rectangle</li>
            <li>Click on a shape to select it</li>
            <li>Drag selected shapes to move them</li>
            <li>Press Delete to remove selected shape</li>
            <li>Use zoom controls to adjust view</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default FloorPlanCanvasEditor;

