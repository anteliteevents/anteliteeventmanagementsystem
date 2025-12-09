/**
 * Modular Architecture Test Page
 * 
 * Interactive test page to see and test the modular system
 */

import React, { useState, useEffect } from 'react';
import SVGFloorPlan from '../components/SVGFloorPlan';
import EventService from '../services/event.service';
import { Event } from '../types';
import './ModularTest.css';

const ModularTest: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [booths, setBooths] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooth, setSelectedBooth] = useState<any | null>(null);
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [eventLog, setEventLog] = useState<string[]>([]);

  useEffect(() => {
    loadData();
    loadSystemStatus();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      loadBooths();
    }
  }, [selectedEvent]);

  const loadData = async () => {
    try {
      const activeEvents = await EventService.getActiveEvents();
      setEvents(activeEvents);
      if (activeEvents.length > 0) {
        setSelectedEvent(activeEvents[0]);
      }
    } catch (error: any) {
      console.error('Error loading events:', error);
      addToLog(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadSystemStatus = async () => {
    try {
      const response = await fetch('http://localhost:3001/health');
      const data = await response.json();
      setSystemStatus(data);
      addToLog(`✅ System Status: ${data.modules?.length || 0} modules loaded`);
    } catch (error: any) {
      addToLog(`❌ Could not load system status: ${error.message}`);
    }
  };

  const loadBooths = async () => {
    if (!selectedEvent) return;

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3001/api/sales/booths/available?eventId=${selectedEvent.id}`
      );
      const data = await response.json();
      
      if (data.success) {
        setBooths(data.data || []);
        addToLog(`✅ Loaded ${data.data?.length || 0} available booths`);
      } else {
        addToLog(`❌ Error: ${data.error?.message || 'Unknown error'}`);
      }
    } catch (error: any) {
      addToLog(`❌ Error loading booths: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBoothSelect = (booth: any) => {
    setSelectedBooth(booth);
    addToLog(`🎯 Selected booth: ${booth.boothNumber} ($${booth.price})`);
  };

  const handleBoothBook = async (booth: any) => {
    if (!selectedEvent) return;

    try {
      addToLog(`📦 Attempting to book booth: ${booth.boothNumber}...`);
      
      // Note: This requires authentication in production
      // For testing, you might need to adjust the endpoint
      const response = await fetch('http://localhost:3001/api/sales/booths/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          boothId: booth.id,
          eventId: selectedEvent.id
        })
      });

      const data = await response.json();
      
      if (data.success) {
        addToLog(`✅ Booth ${booth.boothNumber} booked successfully!`);
        addToLog(`   Reservation ID: ${data.data?.reservationId}`);
        // Reload booths to see updated status
        setTimeout(() => loadBooths(), 1000);
      } else {
        addToLog(`❌ Booking failed: ${data.error?.message || 'Unknown error'}`);
        if (data.error?.code === 'UNAUTHORIZED') {
          addToLog(`   💡 Tip: You need to be logged in to book booths`);
        }
      }
    } catch (error: any) {
      addToLog(`❌ Error booking booth: ${error.message}`);
    }
  };

  const testFloorPlan = async () => {
    if (!selectedEvent) return;

    try {
      addToLog(`🗺️  Loading floor plan for event: ${selectedEvent.name}...`);
      const response = await fetch(
        `http://localhost:3001/api/sales/floor-plan/${selectedEvent.id}`
      );
      const data = await response.json();
      
      if (data.success) {
        addToLog(`✅ Floor plan loaded!`);
        addToLog(`   SVG generated: ${data.data.svgContent ? 'Yes' : 'No'}`);
        addToLog(`   Booths in plan: ${data.data.booths?.length || 0}`);
      } else {
        addToLog(`⚠️  Floor plan not found (this is OK if not created yet)`);
      }
    } catch (error: any) {
      addToLog(`❌ Error loading floor plan: ${error.message}`);
    }
  };

  const addToLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setEventLog(prev => [`[${timestamp}] ${message}`, ...prev].slice(0, 50));
  };

  if (loading && !selectedEvent) {
    return (
      <div className="modular-test-container">
        <div className="loading">Loading test page...</div>
      </div>
    );
  }

  return (
    <div className="modular-test-container">
      <div className="test-header">
        <h1>🧪 Modular Architecture Test Center</h1>
        <p>Interactive testing for the modular exhibitor management system</p>
      </div>

      <div className="test-grid">
        {/* System Status Panel */}
        <div className="test-panel">
          <h2>📊 System Status</h2>
          {systemStatus ? (
            <div className="status-info">
              <div className="status-item">
                <strong>Status:</strong> <span className="status-ok">✅ Running</span>
              </div>
              <div className="status-item">
                <strong>Modules Loaded:</strong> {systemStatus.modules?.length || 0}
              </div>
              <div className="status-item">
                <strong>Feature Flags:</strong> {systemStatus.featureFlags?.length || 0} enabled
              </div>
              {systemStatus.modules && systemStatus.modules.length > 0 && (
                <div className="modules-list">
                  <strong>Active Modules:</strong>
                  <ul>
                    {systemStatus.modules.map((module: string) => (
                      <li key={module}>✅ {module}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="status-loading">Loading system status...</div>
          )}
          <button onClick={loadSystemStatus} className="btn-refresh">
            🔄 Refresh Status
          </button>
        </div>

        {/* Event Selection */}
        <div className="test-panel">
          <h2>📅 Select Event</h2>
          {events.length === 0 ? (
            <p>No events found. Create an event first.</p>
          ) : (
            <div className="event-selector">
              {events.map(event => (
                <button
                  key={event.id}
                  className={`event-btn ${selectedEvent?.id === event.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedEvent(event);
                    setSelectedBooth(null);
                    addToLog(`📅 Selected event: ${event.name}`);
                  }}
                >
                  {event.name}
                </button>
              ))}
            </div>
          )}
          {selectedEvent && (
            <div className="selected-event-info">
              <h3>{selectedEvent.name}</h3>
              <p>Venue: {selectedEvent.venue || 'TBD'}</p>
              <p>Status: <span className={`status-${selectedEvent.status}`}>{selectedEvent.status}</span></p>
            </div>
          )}
        </div>

        {/* Floor Plan */}
        {selectedEvent && (
          <div className="test-panel floor-plan-panel">
            <div className="panel-header">
              <h2>🗺️ Interactive Floor Plan</h2>
              <button onClick={testFloorPlan} className="btn-test">
                Test Floor Plan API
              </button>
            </div>
            {booths.length > 0 ? (
              <div className="floor-plan-container">
                <SVGFloorPlan
                  eventId={selectedEvent.id}
                  booths={booths}
                  onBoothSelect={handleBoothSelect}
                  onBoothBook={handleBoothBook}
                />
              </div>
            ) : (
              <div className="no-booths">
                <p>No booths available for this event.</p>
                <button onClick={loadBooths} className="btn-load">
                  🔄 Load Booths
                </button>
              </div>
            )}
          </div>
        )}

        {/* Selected Booth Info */}
        {selectedBooth && (
          <div className="test-panel">
            <h2>🎯 Selected Booth</h2>
            <div className="booth-details">
              <div className="detail-row">
                <strong>Booth Number:</strong> {selectedBooth.boothNumber}
              </div>
              <div className="detail-row">
                <strong>Price:</strong> ${selectedBooth.price}
              </div>
              <div className="detail-row">
                <strong>Size:</strong> {selectedBooth.size || 'Standard'}
              </div>
              <div className="detail-row">
                <strong>Status:</strong> 
                <span className={`status-badge status-${selectedBooth.status}`}>
                  {selectedBooth.status}
                </span>
              </div>
              <div className="detail-row">
                <strong>Location:</strong> ({selectedBooth.locationX}, {selectedBooth.locationY})
              </div>
              <button
                onClick={() => handleBoothBook(selectedBooth)}
                className="btn-book"
                disabled={selectedBooth.status !== 'available'}
              >
                📦 Book This Booth
              </button>
            </div>
          </div>
        )}

        {/* Event Log */}
        <div className="test-panel event-log-panel">
          <div className="panel-header">
            <h2>📝 Event Log</h2>
            <button onClick={() => setEventLog([])} className="btn-clear">
              Clear
            </button>
          </div>
          <div className="event-log">
            {eventLog.length === 0 ? (
              <p className="log-empty">No events yet. Start interacting to see events!</p>
            ) : (
              eventLog.map((log, index) => (
                <div key={index} className="log-entry">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* API Testing */}
        <div className="test-panel">
          <h2>🔌 API Endpoints</h2>
          <div className="api-endpoints">
            <div className="endpoint-item">
              <strong>GET</strong>
              <code>/api/sales/booths/available?eventId=...</code>
              <button
                onClick={loadBooths}
                className="btn-test-small"
                disabled={!selectedEvent}
              >
                Test
              </button>
            </div>
            <div className="endpoint-item">
              <strong>GET</strong>
              <code>/api/sales/floor-plan/:eventId</code>
              <button
                onClick={testFloorPlan}
                className="btn-test-small"
                disabled={!selectedEvent}
              >
                Test
              </button>
            </div>
            <div className="endpoint-item">
              <strong>GET</strong>
              <code>/health</code>
              <button
                onClick={loadSystemStatus}
                className="btn-test-small"
              >
                Test
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModularTest;

