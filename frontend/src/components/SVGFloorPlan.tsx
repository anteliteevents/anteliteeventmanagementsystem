/**
 * SVG Floor Plan Component
 * 
 * Interactive SVG floor plan with drag-drop booth selection
 */

import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import './SVGFloorPlan.css';

interface Booth {
  id: string;
  boothNumber: string;
  status: 'available' | 'reserved' | 'booked' | 'unavailable';
  price: number;
  locationX: number;
  locationY: number;
  width: number;
  height: number;
  size?: string;
}

interface FloorPlanProps {
  eventId: string;
  svgContent?: string;
  booths: Booth[];
  onBoothSelect?: (booth: Booth) => void;
  onBoothBook?: (booth: Booth) => void;
  selectedBooths?: string[];
  readOnly?: boolean;
}

const SVGFloorPlan: React.FC<FloorPlanProps> = ({
  eventId,
  svgContent,
  booths,
  onBoothSelect,
  onBoothBook,
  selectedBooths = [],
  readOnly = false
}) => {
  const [selectedBooth, setSelectedBooth] = useState<string | null>(null);
  const [hoveredBooth, setHoveredBooth] = useState<string | null>(null);
  const [realTimeBooths, setRealTimeBooths] = useState<Booth[]>(booths);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    setRealTimeBooths(booths);
  }, [booths]);

  // WebSocket connection for real-time updates
  useEffect(() => {
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
    socketRef.current = io(API_URL);

    socketRef.current.on('connect', () => {
      console.log('Connected to WebSocket');
      socketRef.current?.emit('join:event', eventId);
    });

    socketRef.current.on('boothStatusUpdate', (data: { boothId: string; status: string }) => {
      setRealTimeBooths(prev => prev.map(booth =>
        booth.id === data.boothId
          ? { ...booth, status: data.status as Booth['status'] }
          : booth
      ));
    });

    return () => {
      socketRef.current?.emit('leave:event', eventId);
      socketRef.current?.disconnect();
    };
  }, [eventId]);

  const handleBoothClick = (booth: Booth) => {
    if (readOnly || booth.status !== 'available') return;

    if (selectedBooth === booth.id) {
      setSelectedBooth(null);
      onBoothSelect?.(undefined as any);
    } else {
      setSelectedBooth(booth.id);
      onBoothSelect?.(booth);
    }
  };

  const handleBoothDoubleClick = (booth: Booth) => {
    if (readOnly || booth.status !== 'available') return;
    onBoothBook?.(booth);
  };

  const getBoothColor = (booth: Booth): string => {
    if (selectedBooth === booth.id || selectedBooths.includes(booth.id)) {
      return '#4A90E2'; // Selected - blue
    }
    if (hoveredBooth === booth.id) {
      return '#7ED321'; // Hover - bright green
    }
    switch (booth.status) {
      case 'available':
        return '#90EE90'; // Light green
      case 'reserved':
        return '#FFD700'; // Gold
      case 'booked':
        return '#FF6B6B'; // Red
      case 'unavailable':
        return '#CCCCCC'; // Gray
      default:
        return '#F5F5F5';
    }
  };

  const getBoothStroke = (booth: Booth): string => {
    if (selectedBooth === booth.id || selectedBooths.includes(booth.id)) {
      return '#2E5C8A';
    }
    return '#333';
  };

  const getBoothStrokeWidth = (booth: Booth): number => {
    if (selectedBooth === booth.id || selectedBooths.includes(booth.id)) {
      return 3;
    }
    return 2;
  };

  // Calculate SVG dimensions
  const maxX = Math.max(...realTimeBooths.map(b => (b.locationX || 0) + (b.width || 1)), 20);
  const maxY = Math.max(...realTimeBooths.map(b => (b.locationY || 0) + (b.height || 1)), 20);
  const cellSize = 50;
  const svgWidth = maxX * cellSize;
  const svgHeight = maxY * cellSize;

  // If SVG content is provided, use it
  if (svgContent) {
    return (
      <div className="svg-floor-plan-container">
        <div
          className="svg-floor-plan"
          dangerouslySetInnerHTML={{ __html: svgContent }}
          onClick={(e) => {
            const target = e.target as HTMLElement;
            const boothElement = target.closest('[data-booth-id]');
            if (boothElement) {
              const boothId = boothElement.getAttribute('data-booth-id');
              const booth = realTimeBooths.find(b => b.id === boothId);
              if (booth) handleBoothClick(booth);
            }
          }}
        />
        <div className="floor-plan-legend">
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#90EE90' }}></div>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#FFD700' }}></div>
            <span>Reserved</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#FF6B6B' }}></div>
            <span>Booked</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#CCCCCC' }}></div>
            <span>Unavailable</span>
          </div>
        </div>
      </div>
    );
  }

  // Generate SVG from booth data
  return (
    <div className="svg-floor-plan-container">
      <div className="floor-plan-header">
        <h3>Floor Plan</h3>
        <p>Click to select, double-click to book</p>
      </div>
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="svg-floor-plan"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Grid background */}
        <defs>
          <pattern id="grid" width={cellSize} height={cellSize} patternUnits="userSpaceOnUse">
            <path d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`} fill="none" stroke="#e0e0e0" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width={svgWidth} height={svgHeight} fill="url(#grid)" />

        {/* Booths */}
        {realTimeBooths.map((booth) => {
          const x = (booth.locationX || 0) * cellSize;
          const y = (booth.locationY || 0) * cellSize;
          const width = (booth.width || 1) * cellSize;
          const height = (booth.height || 1) * cellSize;

          return (
            <g
              key={booth.id}
              className={`booth-group ${booth.status} ${selectedBooth === booth.id ? 'selected' : ''}`}
              onClick={() => handleBoothClick(booth)}
              onDoubleClick={() => handleBoothDoubleClick(booth)}
              onMouseEnter={() => setHoveredBooth(booth.id)}
              onMouseLeave={() => setHoveredBooth(null)}
              style={{ cursor: booth.status === 'available' && !readOnly ? 'pointer' : 'not-allowed' }}
            >
              <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill={getBoothColor(booth)}
                stroke={getBoothStroke(booth)}
                strokeWidth={getBoothStrokeWidth(booth)}
                rx="4"
                className="booth-rect"
              />
              <text
                x={x + width / 2}
                y={y + height / 2 - 8}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="14"
                fontWeight="bold"
                fill="#333"
                className="booth-number"
              >
                {booth.boothNumber}
              </text>
              <text
                x={x + width / 2}
                y={y + height / 2 + 10}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="11"
                fill="#666"
                className="booth-price"
              >
                ${booth.price}
              </text>
              {booth.size && (
                <text
                  x={x + width / 2}
                  y={y + height / 2 + 22}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="9"
                  fill="#888"
                  className="booth-size"
                >
                  {booth.size}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="floor-plan-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#90EE90' }}></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#FFD700' }}></div>
          <span>Reserved</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#FF6B6B' }}></div>
          <span>Booked</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#CCCCCC' }}></div>
          <span>Unavailable</span>
        </div>
        {selectedBooth && (
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#4A90E2' }}></div>
            <span>Selected</span>
          </div>
        )}
      </div>

      {/* Selected booth info */}
      {selectedBooth && (
        <div className="selected-booth-info">
          {(() => {
            const booth = realTimeBooths.find(b => b.id === selectedBooth);
            return booth ? (
              <>
                <h4>Selected: {booth.boothNumber}</h4>
                <p>Price: ${booth.price}</p>
                <p>Size: {booth.size || 'Standard'}</p>
                <p>Status: {booth.status}</p>
                {!readOnly && booth.status === 'available' && (
                  <button
                    className="btn-book-booth"
                    onClick={() => onBoothBook?.(booth)}
                  >
                    Book This Booth
                  </button>
                )}
              </>
            ) : null;
          })()}
        </div>
      )}
    </div>
  );
};

export default SVGFloorPlan;

