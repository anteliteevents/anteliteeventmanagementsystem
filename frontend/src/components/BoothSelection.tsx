import React, { useState, useEffect } from 'react';
import { Booth, BoothFilters } from '../types';
import api from '../services/api';
import { getSocket } from '../services/socket';

interface BoothSelectionProps {
  eventId: string;
  onBoothSelect?: (booth: Booth) => void;
}

const BoothSelection: React.FC<BoothSelectionProps> = ({ eventId, onBoothSelect }) => {
  const [booths, setBooths] = useState<Booth[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<BoothFilters>({
    eventId,
    size: undefined,
    minPrice: undefined,
    maxPrice: undefined,
  });
  const [selectedBooths, setSelectedBooths] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Fetch available booths
    const fetchBooths = async () => {
      try {
        setLoading(true);
        const response = await api.get('/booths/available', {
          params: filters,
        });
        if (response.data.success) {
          setBooths(response.data.data || []);
        }
      } catch (error) {
        console.error('Error fetching booths:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooths();

    // Setup Socket.io for real-time updates
    const socket = getSocket();
    socket.emit('join:event', { eventId });

    socket.on('boothStatusUpdate', (data: { boothId: string; status: string }) => {
      setBooths((prevBooths) =>
        prevBooths.map((booth) =>
          booth.id === data.boothId
            ? { ...booth, status: data.status as Booth['status'] }
            : booth
        )
      );
    });

    return () => {
      socket.emit('leave:event', { eventId });
      socket.off('boothStatusUpdate');
    };
  }, [eventId, filters]);

  const handleBoothClick = (booth: Booth) => {
    if (booth.status !== 'available') return;

    const newSelected = new Set(selectedBooths);
    if (newSelected.has(booth.id)) {
      newSelected.delete(booth.id);
    } else {
      newSelected.add(booth.id);
    }
    setSelectedBooths(newSelected);

    if (onBoothSelect) {
      onBoothSelect(booth);
    }
  };

  const handleFilterChange = (key: keyof BoothFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const getBoothColor = (booth: Booth): string => {
    if (selectedBooths.has(booth.id)) return '#4CAF50'; // Green for selected
    if (booth.status === 'available') return '#2196F3'; // Blue for available
    if (booth.status === 'reserved') return '#FF9800'; // Orange for reserved
    if (booth.status === 'booked') return '#F44336'; // Red for booked
    return '#9E9E9E'; // Gray for unavailable
  };

  if (loading) {
    return <div>Loading booths...</div>;
  }

  return (
    <div className="booth-selection">
      <h2>Select Your Booth</h2>

      {/* Filters */}
      <div className="filters" style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <select
          value={filters.size || ''}
          onChange={(e) => handleFilterChange('size', e.target.value || undefined)}
        >
          <option value="">All Sizes</option>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
          <option value="xlarge">X-Large</option>
        </select>

        <input
          type="number"
          placeholder="Min Price"
          value={filters.minPrice || ''}
          onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
        />

        <input
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice || ''}
          onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
        />
      </div>

      {/* Floor Plan Grid */}
      <div className="floor-plan" style={{ display: 'grid', gap: '10px' }}>
        {booths.map((booth) => (
          <div
            key={booth.id}
            onClick={() => handleBoothClick(booth)}
            style={{
              padding: '15px',
              border: '2px solid',
              borderColor: getBoothColor(booth),
              borderRadius: '4px',
              cursor: booth.status === 'available' ? 'pointer' : 'not-allowed',
              backgroundColor: getBoothColor(booth),
              color: 'white',
              opacity: booth.status === 'available' ? 1 : 0.6,
            }}
          >
            <div><strong>{booth.boothNumber}</strong></div>
            <div>Size: {booth.size}</div>
            <div>Price: ${booth.price}</div>
            <div>Status: {booth.status}</div>
          </div>
        ))}
      </div>

      {selectedBooths.size > 0 && (
        <div style={{ marginTop: '20px' }}>
          <p>Selected: {selectedBooths.size} booth(s)</p>
          <button>Proceed to Checkout</button>
        </div>
      )}
    </div>
  );
};

export default BoothSelection;

