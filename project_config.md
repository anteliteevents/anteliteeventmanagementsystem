outlining MVP: booth sales portal, database schema, payment flow.
// @BoothSelection.tsx
Implement a React component for booth selection with real-time availability,
// allowing users to filter booths by size and price.
// Leverage Socket.io for live updates.

- Display floor plan grid with available/unavailable booths.
- UI controls: dropdown/filter for booth size and price range.
- Highlight updated availability instantly when status changes.
- Clicking a booth selects/deselects it.

Test iteratively:
// 1. Mock API endpoint for fetching booths: GET /booths/available
// 2. Mock Socket.io events for live updates: "boothStatusUpdate"
// 3. Simulate user interactions: filtering, selecting, real-time changes
// 4. Ensure UI updates as expected without page reload.

Anchor code in BoothSelection.tsx and wire mock backend as needed.
