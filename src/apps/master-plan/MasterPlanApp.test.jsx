import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import MasterPlanApp from './MasterPlanApp';
import React from 'react';

// Mock the V3 Store (Adapter)
vi.mock('./stores/useProgramStore', () => ({
  useProgramStore: vi.fn(() => ({
    activeSession: null,
    programDays: [
        { id: 'day-1', label: 'Push Day', sequence_number: 1 },
        { id: 'day-2', label: 'Pull Day', sequence_number: 2 }
    ],
    isLoading: false,
    fetchProgramManifest: vi.fn(),
    fetchGlobalHistory: vi.fn(),
    fetchUniqueExercises: vi.fn(),
    globalHistory: [],
    startSession: vi.fn(),
    resetStore: vi.fn(),
    dailyVolumes: {},
    uniqueExercises: []
  })),
}));

describe('MasterPlanApp (V3 Adapter Baseline)', () => {
  it('renders the dashboard correctly', () => {
    render(<MasterPlanApp onExit={() => {}} currentView={null} onNavigate={() => {}} />);
    
    // Check for "Ready to Train?" header
    expect(screen.getByText(/Ready to/i)).toBeDefined();
    
    // Check for Day Labels (from mock)
    expect(screen.getByText('Push Day')).toBeDefined();
    expect(screen.getByText('Pull Day')).toBeDefined();
  });
});