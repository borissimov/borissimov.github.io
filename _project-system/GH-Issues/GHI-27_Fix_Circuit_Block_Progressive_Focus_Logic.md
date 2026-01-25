---
gh_issue_number: 27
type: "bug"
title: "Fix Circuit Block Progressive Focus Logic"
---

# TASK-27: Fix Circuit Block Progressive Focus Logic

The CircuitBlock component currently functions like a LinearBlock. It needs to be updated to support round-robin progressive focus: once a user logs a set for one exercise, focus should move to the first set of the next exercise, and loop back after the last exercise.

## Technical Implementation

### 1. Component Updates
- **`CircuitBlock.jsx`**: Now explicitly identifies itself as a circuit by passing `isCircuit={true}` to its child `BlockItemRow` components.
- **`BlockItemRow.jsx`**: 
    - Accepts the `isCircuit` prop.
    - Pass `isCircuit` to the store's `addLogEntry` function.
    - Correctly calculates `currentRoundNum` using `systemStep.round` when in circuit mode, ensuring targets match the current round of the circuit.

### 2. Store Logic (Existing but now triggered)
- **`useProgramStore.js`**: The `addLogEntry` function contains logic to:
    - Advance to the next item in the same round if `itemIdx < items.length - 1`.
    - Loop back to the first item and increment the round if the last item of a round is reached.
    - Fallback to the next incomplete item in the session if the circuit is finished.

## Verification Steps (UAT)
1. Start a "Metabolic" session (or any session with a Circuit block).
2. Expand the Circuit block.
3. Log a set for the first exercise.
4. **Expected:** Focus automatically moves to the second exercise.
5. Log a set for the last exercise in the circuit.
6. **Expected:** Focus loops back to the first exercise for the next round.