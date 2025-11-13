# Test Cases & Verification Guide

## Test Environment Setup

1. Open `index.html` in a modern web browser (Chrome, Firefox, Safari, Edge)
2. Use sample data: `sample-students.json` or `sample-students.csv`
3. All tests should be run in Teacher mode (default)

---

## Test Case 1: Classroom Creation ✓

**Objective**: Verify that teachers can create a new classroom with custom configuration

**Precondition**: Application loaded, no classroom exists

**Steps**:
1. Click the "📋 New Classroom" button in toolbar
2. Modal appears with form
3. Enter:
   - Classroom Name: "Grade 5A"
   - Rows: 4
   - Columns: 5
   - Seat Size: 80
   - Spacing: 15
   - Layout: Grid
   - Orientation: Portrait
4. Click "Create" button

**Expected Results**:
- ✓ Modal closes
- ✓ Main canvas displays "Grade 5A" as title
- ✓ Exactly 20 seats displayed in 4×5 grid
- ✓ All seats show empty chair icon (🪑)
- ✓ Canvas info shows "4 rows × 5 columns | 20 total seats"
- ✓ Right panel statistics: Total: 0, Assigned: 0, Unassigned: 0
- ✓ Toast notification appears: "Classroom 'Grade 5A' created successfully!"

**Pass/Fail**: ___________

---

## Test Case 2: Import Students from CSV ✓

**Objective**: Verify CSV import functionality with sample data

**Precondition**: Classroom created (Test Case 1)

**Steps**:
1. Click "📥 Import" button in toolbar
2. Verify "CSV Format" tab is active
3. Click file input, select `sample-students.csv`
4. Click "Import" button
5. Verify preview shows data

**Expected Results**:
- ✓ CSV file selected successfully
- ✓ Preview shows headers and rows
- ✓ Modal closes after import
- ✓ Toast notification: "Imported 15 students successfully!"
- ✓ Right panel shows "Unassigned Students" with 15 items
- ✓ Statistics update: Total: 15, Assigned: 0, Unassigned: 15
- ✓ Filter dropdowns populate with:
  - Grades: A, B, C
  - Groups: Group A, Group B, Group C

**Verification**:
- [ ] Scroll right panel to see all 15 students
- [ ] Verify each student displays: Name | ID | Grade

**Pass/Fail**: ___________

---

## Test Case 3: Drag & Drop Single Student ✓

**Objective**: Verify drag-and-drop functionality for assigning students to seats

**Precondition**: Classroom with 15 imported students (Test Cases 1-2)

**Steps**:
1. In right panel, locate "Alice Johnson"
2. Drag "Alice Johnson" card to first seat (top-left)
3. Release mouse to drop
4. Verify visual feedback
5. Check statistics update

**Expected Results**:
- ✓ Seat background changes from empty gray to light blue
- ✓ Seat displays student name "Alice Johnson" (truncated if needed)
- ✓ Seat displays student ID "STU001"
- ✓ "Alice Johnson" removed from unassigned list
- ✓ Statistics update: Assigned: 1, Unassigned: 14
- ✓ Dragged student no longer appears in right panel

**Additional Verification**:
- [ ] Double-click the seat with Alice to open student details modal
- [ ] Verify name, ID, grade, group, note are displayed correctly

**Pass/Fail**: ___________

---

## Test Case 4: Auto-Group with Random Strategy ✓

**Objective**: Verify automatic grouping assigns remaining students to empty seats

**Precondition**: 1 student assigned, 14 unassigned (after Test Case 3)

**Steps**:
1. Click "🔀 Auto-Group" button
2. Modal appears with grouping strategies
3. Select "Random Assignment" (default selected)
4. Click "Apply" button
5. Observe seating changes

**Expected Results**:
- ✓ Modal closes
- ✓ All previously unassigned students now assigned to seats
- ✓ Statistics show: Assigned: 15, Unassigned: 0
- ✓ All 20 seats contain students
- ✓ Toast notification: "Auto-grouped using 'random' strategy!"
- ✓ Seating arrangement appears random (not alphabetical)
- ✓ No student appears twice

**Verification**:
- [ ] Count visible students = 15 (5 per row × 4 rows... wait, we have 20 seats but 15 students)
- [ ] Verify 5 empty seats remain (no more students to assign)

**Pass/Fail**: ___________

---

## Test Case 5: Undo/Redo & History ✓

**Objective**: Verify undo/redo functionality preserves state and supports 20-step history

**Precondition**: Classroom with auto-grouped students (Test Cases 1-4)

**Steps**:
1. Make note of current seating arrangement (take mental snapshot)
2. Click "↶ Undo" button
3. Verify seating reverts to before auto-group (only Alice in seat)
4. Click "↷ Redo" button
5. Verify seating restores to full auto-group state
6. Test keyboard shortcut: Ctrl+Z (undo)
7. Test keyboard shortcut: Ctrl+Y (redo)

**Expected Results**:
- ✓ Undo removes all auto-grouped assignments (14 students removed)
- ✓ Only "Alice Johnson" remains in first seat
- ✓ Unassigned list shows 14 students again
- ✓ Statistics show: Assigned: 1, Unassigned: 14
- ✓ Redo restores full auto-group arrangement
- ✓ All 15 students assigned again
- ✓ Keyboard shortcuts (Ctrl+Z, Ctrl+Y) work identically
- ✓ Undo button disabled when no more history
- ✓ Redo button disabled when no more redo steps

**History Depth Test**:
1. Perform 5 additional operations (e.g., drag different student, undo, etc.)
2. Verify undo stack supports at least 20 operations

**Pass/Fail**: ___________

---

## Test Case 6: Save to LocalStorage ✓

**Objective**: Verify data persistence and restoration from browser storage

**Precondition**: Classroom with seating arrangement saved (Test Cases 1-5)

**Steps**:
1. With seating arrangement visible, click "💾 Save" button
2. Toast notification appears
3. Open browser DevTools (F12)
4. Navigate to Application → Local Storage
5. Find entry "seatingChartData"
6. Note the data structure
7. Reload the page (F5)
8. Verify classroom and students are restored

**Expected Results**:
- ✓ Toast shows "Saved to local storage"
- ✓ LocalStorage contains "seatingChartData" entry
- ✓ Entry includes classroom metadata
- ✓ Entry includes students array (15 items)
- ✓ Entry includes seatingArrangement mapping
- ✓ After page reload:
  - ✓ Classroom name restored: "Grade 5A"
  - ✓ All 15 students restored
  - ✓ Exact same seating arrangement displayed
  - ✓ Statistics match previous state

**Pass/Fail**: ___________

---

## Test Case 7: Export Functionality ✓

**Objective**: Verify export in multiple formats (JSON, CSV, PDF, PNG)

**Precondition**: Classroom with seating (Test Cases 1-5)

**Steps**:
1. Click "📤 Export" button
2. Modal shows checkboxes for:
   - [ ] JSON
   - [ ] CSV
   - [ ] PNG
   - [ ] PDF
3. Check JSON and CSV options
4. Click "Export" button
5. Verify files download

**Expected Results**:
- ✓ Modal closes
- ✓ Two files download to default Downloads folder:
  - `seating-chart-2025-11-13.json`
  - `seating-chart-2025-11-13.csv`
- ✓ Toast shows "Export completed!"
- ✓ JSON file contains:
  - Classroom object with metadata
  - Students array (15 items)
  - SeatingArrangement array with [seatId, studentId] pairs
- ✓ CSV file contains:
  - Headers: id, student_id, name, grade, group, note, seat
  - 15 data rows
  - Each student row includes their assigned seat ID

**Optional Tests**:
- [ ] Check PNG export creates image of seats
- [ ] Check PDF export shows print-friendly layout

**Pass/Fail**: ___________

---

## Test Case 8: Keyboard Navigation & Shortcuts ✓

**Objective**: Verify all keyboard shortcuts work correctly

**Precondition**: Classroom with seating arrangement

**Steps**:

### Navigation
1. Press Tab multiple times
   - [ ] Focus cycles through all interactive elements
   - [ ] Focus indicator clearly visible
2. Press Arrow Keys
   - [ ] Can navigate between seats

### Shortcuts
3. Press `Ctrl+Z` → Verifies undo works
4. Press `Ctrl+Y` → Verifies redo works
5. Press `Ctrl+S` → Verifies save to localStorage
6. Press `Ctrl+P` → Verifies print dialog opens
7. Press `?` → Verifies help modal opens

**Expected Results**:
- ✓ All Tab navigation works smoothly
- ✓ All keyboard shortcuts respond immediately
- ✓ Focus indicators are clearly visible
- ✓ No elements inaccessible via keyboard

**Pass/Fail**: ___________

---

## Test Case 9: High Contrast Mode ✓

**Objective**: Verify accessibility high contrast mode toggle

**Precondition**: Classroom with seating

**Steps**:
1. Click "◐ Contrast" button in toolbar
2. Observe visual changes
3. Click "◐ Contrast" again to toggle off

**Expected Results**:
- ✓ Button click toggles high contrast mode on/off
- ✓ Colors change to high-contrast palette (blacks, whites, bright colors)
- ✓ Text remains readable with increased contrast
- ✓ Seat indicators remain clearly visible
- ✓ Second click restores normal colors
- ✓ Toast confirms toggle: "High contrast enabled" / "High contrast disabled"

**Pass/Fail**: ___________

---

## Test Case 10: Teacher vs Viewer Mode ✓

**Objective**: Verify role-based access control (edit vs read-only)

**Precondition**: Classroom with seating

**Teacher Mode (Default)**:
1. Verify all toolbar buttons are enabled:
   - [ ] New Classroom - enabled
   - [ ] Import - enabled
   - [ ] Auto-Group - enabled
   - [ ] Undo/Redo - enabled
2. Verify drag-drop works

**Viewer Mode**:
3. Click mode selector dropdown
4. Select "👁️ Viewer (Read-only)"
5. Verify:
   - [ ] Edit buttons become disabled (grayed out)
   - [ ] Drag-drop is disabled
   - [ ] Attempt to drag student → Nothing happens
   - [ ] Can still see seating arrangement
   - [ ] Can still view student details
6. Switch back to Teacher mode
7. Verify all buttons re-enable

**Expected Results**:
- ✓ Teacher mode: all editing features work
- ✓ Viewer mode: all editing features disabled
- ✓ Mode switch is responsive and immediate
- ✓ User can still view data in viewer mode

**Pass/Fail**: ___________

---

## Bonus Test: Filter & Search ✓

**Objective**: Verify student filtering functionality

**Precondition**: Classroom with 15 students imported

**Steps**:
1. In right panel, type in search box "Alice"
2. Verify only Alice shows in list
3. Clear search
4. Select Grade "A" from dropdown
5. Verify only students with grade A show (Alice, Carol, Frank, Henry, Karen, Maya)
6. Select Group "Group A" 
7. Verify correct students filtered

**Expected Results**:
- ✓ Search filters by name/ID in real-time
- ✓ Grade filter shows only selected grade
- ✓ Group filter shows only selected group
- ✓ Filters can be combined
- ✓ Clear all selections to show all students

**Pass/Fail**: ___________

---

## Bonus Test: Seat Locking ✓

**Objective**: Verify locked seats cannot be moved

**Precondition**: Classroom with students assigned

**Steps**:
1. Double-click a student seat to open details modal
2. Check "Lock this student in current seat" checkbox
3. Click "Save"
4. Attempt to drag the locked student to another seat
5. Observe lock icon (🔒) on seat

**Expected Results**:
- ✓ Seat shows lock indicator (🔒 icon)
- ✓ Locked seat background shows warning color (pink/red)
- ✓ Cannot drag locked student to other seats
- ✓ Toast shows "This seat is locked" if attempted
- ✓ Can unlock by unchecking in modal again

**Pass/Fail**: ___________

---

## Summary

### Test Results
- Total Test Cases: 10
- Passed: _____ / 10
- Failed: _____ / 10
- Blocked: _____ / 10

### Defects Found
(List any bugs or issues discovered)

1. _______________
2. _______________
3. _______________

### Notes
_________________________________________________________________

---

**Test Date**: ___________  
**Tester Name**: ___________  
**Browser/OS**: ___________  
**Version Tested**: 1.0.0
