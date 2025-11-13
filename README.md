# Classroom Seating Chart Manager

A comprehensive, professional-grade web application for creating, managing, and optimizing classroom seating arrangements. Built with vanilla HTML/CSS/JavaScript (ES6+), designed for accessibility and ease of use.

## Features

### Core Functionality ✓
- **Create Classrooms**: Configure rows, columns, seat size, spacing, and layout types
- **Student Management**: Add, edit, delete, and import students from CSV/JSON
- **Drag & Drop Interface**: Intuitively assign students to seats
- **Automatic Grouping**: Random, alphabetical, gender-based, or performance-based seating
- **Seat Rotation**: Periodic rotation strategies (by rows, clusters, or full shuffle)
- **Seat Locking**: Lock special needs students in specific seats
- **Undo/Redo**: Full history support (up to 20 steps)

### Data Management ✓
- **LocalStorage**: Automatic save of classroom state
- **Import/Export**: CSV and JSON formats
- **Export Options**: JSON data, CSV students list, PNG images, PDF (print-friendly)
- **Import Sources**: File upload or direct paste

### Accessibility ✓
- **Keyboard Navigation**: Tab, arrow keys, Enter/Space for actions
- **ARIA Labels**: Full screen reader support
- **High Contrast Mode**: Toggle for visual accessibility
- **Semantic HTML**: Proper heading hierarchy and landmarks

### UI/UX ✓
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Multiple Modals**: Classroom setup, import, export, student details, help
- **Tooltip Help**: Keyboard shortcuts and feature guidance
- **Real-time Statistics**: Student assignment tracking
- **Toast Notifications**: Feedback on all actions

### Roles & Permissions ✓
- **Teacher Mode**: Full editing capabilities
- **Viewer Mode**: Read-only access
- **No Backend Auth**: Simple client-side toggle

## Installation & Usage

### Quick Start

1. **Open the application**:
   ```bash
   # Simply open index.html in any modern web browser
   open index.html
   # or double-click in file explorer
   ```

2. **Create a Classroom**:
   - Click "New Classroom" button
   - Set classroom name, rows, columns, seat size, spacing
   - Choose layout type (Grid, Cluster, Circle, etc.)
   - Click "Create"

3. **Add Students**:
   - Click "Import" to load from CSV/JSON file
   - Or use sample files: `sample-students.json` or `sample-students.csv`
   - Or manually add students through import dialog

4. **Arrange Seating**:
   - Drag students from the right panel onto seats
   - Or use "Auto-Group" with various strategies
   - Lock important seats to prevent accidental moves

5. **Save & Export**:
   - Click "Save" to store locally
   - Click "Export" to download in your chosen format

## File Structure

```
├── index.html                 # Main HTML with all modals and UI
├── styles.css                 # Comprehensive styling (responsive, accessible)
├── app.js                      # Main application logic (~900 lines)
├── sample-students.json        # Sample student data (JSON format)
├── sample-students.csv         # Sample student data (CSV format)
├── README.md                   # This file
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `Ctrl+S` | Save to localStorage |
| `Ctrl+P` | Print seating chart |
| `Tab` | Navigate between elements |
| `Arrow Keys` | Navigate within layout |
| `Enter/Space` | Open student details |
| `Shift+Click` | Multi-select seats |
| `Double Click` | Edit student details |
| `Delete` | Remove selected student |
| `?` | Show help/shortcuts |

## Student Data Fields

Each student record contains:
- **id**: Unique internal identifier
- **student_id**: School/external student ID
- **name**: Student's full name
- **grade**: Grade level or performance tier (A, B, C, etc.)
- **group**: Classification group (Group A, B, C, etc.)
- **note**: Special notes (e.g., "needs front seat", "hearing assistance")

## CSV Format Example

```csv
id,student_id,name,grade,group,note
1,STU001,Alice Johnson,A,Group A,High performer
2,STU002,Bob Smith,B,Group B,Needs extra support
```

## JSON Format Example

```json
[
  {
    "id": "1",
    "student_id": "STU001",
    "name": "Alice Johnson",
    "grade": "A",
    "group": "Group A",
    "note": "High performer"
  }
]
```

## Features in Detail

### Automatic Grouping Strategies

1. **Random**: Shuffles all students randomly
2. **By Name**: Sorts alphabetically
3. **By Gender**: Groups by gender if available
4. **By Performance**: Sorts by grade level
5. **Rotate**: Shifts students one row/cluster forward

### Seat Rotation Strategies

1. **Rotate Between Rows**: Students move to next row
2. **Rotate Between Clusters**: Clusters of desks rotate
3. **Shuffle All**: Complete randomization

### Layout Types

- **Grid**: Traditional rows and columns
- **Cluster**: Grouped desk arrangements
- **Circle**: Circular seating
- **Horseshoe**: U-shaped arrangement
- **U-Shape**: Variant seating

### Export Formats

- **JSON**: Complete classroom data including seating arrangement
- **CSV**: Student list with assigned seat information
- **PNG**: Image snapshot of current layout
- **PDF**: Print-friendly A4 layout

## Test Cases

### Test Case 1: Basic Classroom Creation
**Steps:**
1. Click "New Classroom"
2. Enter name "Grade 5A"
3. Set 4 rows × 5 columns
4. Set seat size to 80px, spacing to 15px
5. Select "Grid" layout
6. Click "Create"

**Expected Result:**
- Classroom created with 20 empty seats
- Title shows "Grade 5A"
- Seats displayed in 4×5 grid
- Right panel shows 0 assigned, 0 unassigned

---

### Test Case 2: Import Students and Verify Data
**Steps:**
1. Create a classroom (Test Case 1)
2. Click "Import"
3. Select "CSV Format" tab
4. Choose `sample-students.csv` file
5. Click "Import"
6. Verify students appear in right panel

**Expected Result:**
- 15 students imported successfully
- Toast notification confirms import
- Right panel shows "Unassigned Students" list
- Statistics show: Total: 15, Assigned: 0, Unassigned: 15
- Filters populate with grades (A, B, C) and groups

---

### Test Case 3: Drag & Drop Student to Seat
**Steps:**
1. Complete Test Cases 1 & 2
2. Drag "Alice Johnson" from right panel
3. Drop on first seat (top-left)
4. Verify seat shows student name
5. Verify student removed from unassigned list

**Expected Result:**
- Alice Johnson appears on seat with name and ID
- Seat background color changes to indicate occupation
- Unassigned count decreases to 14
- Assigned count increases to 1

---

### Test Case 4: Auto-Group and Verify Distribution
**Steps:**
1. Complete Tests 1-3
2. Click "Auto-Group" button
3. Select "Random" strategy
4. Click "Apply"
5. Verify all 15 students assigned

**Expected Result:**
- All 15 seats filled with students
- Each student appears exactly once
- Unassigned count = 0
- Assigned count = 15
- Random distribution (not alphabetical)
- Toast shows success message

---

### Test Case 5: Undo/Redo History & Save
**Steps:**
1. Complete Test Case 4
2. Make note of seating arrangement
3. Click "Undo" (should revert auto-group)
4. Click "Redo" (should restore auto-group)
5. Click "Save" button
6. Reload page
7. Verify seating restored from localStorage

**Expected Result:**
- Undo removes all assignments
- Redo restores all assignments
- Save button shows success toast
- Page reload shows same classroom and seating
- LocalStorage persists data
- All 20 undo/redo steps work (test with multiple operations)

---

### Bonus Test: Accessibility Features
**Steps:**
1. Create classroom and add students
2. Press `Tab` to navigate through seats
3. Use `Arrow Keys` to move focus
4. Press `?` to open shortcuts help
5. Toggle "Contrast" button to enable high contrast mode
6. Try screen reader navigation

**Expected Result:**
- All interactive elements keyboard accessible
- ARIA labels present for all regions
- High contrast mode toggles successfully
- Screen reader announces regions and buttons
- Focus indicators clearly visible

---

### Bonus Test: Export Functionality
**Steps:**
1. Complete Test Case 4 (auto-grouped)
2. Click "Export"
3. Check JSON, CSV options
4. Click "Export"
5. Verify files download
6. Open exported JSON/CSV to verify data

**Expected Result:**
- Files download with correct timestamps
- JSON contains complete classroom data
- CSV shows student names with seat assignments
- All data matches current state

---

### Bonus Test: Role-Based Access
**Steps:**
1. Create classroom with students
2. Select "👨‍🏫 Teacher (Edit)" mode (default)
3. Verify all buttons enabled and functional
4. Select "👁️ Viewer (Read-only)" mode
5. Attempt to drag student (should fail)
6. Verify all edit buttons disabled

**Expected Result:**
- Teacher mode: All features working
- Viewer mode: Edit buttons disabled
- Drag & drop disabled in viewer mode
- Can still view layout and student info
- Mode toggle responsive

## Performance Considerations

- **Lazy Rendering**: Only visible seats rendered initially
- **DOM Optimization**: Minimal reflows on drag operations
- **History Compression**: Undo/redo limited to 20 steps
- **LocalStorage Efficient**: Data stored as JSON strings
- **Mobile Optimized**: Reduced seat size on small screens

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility Standards

- **WCAG 2.1 Level AA** compliance
- Full keyboard navigation
- Screen reader compatible
- High contrast mode support
- Semantic HTML structure
- ARIA labels and roles

## Technical Stack

- **HTML5**: Semantic markup
- **CSS3**: Flexbox/Grid layout, custom properties
- **JavaScript ES6+**: Modern async/await, classes, destructuring
- **LocalStorage**: Client-side persistence
- **No Dependencies**: Pure vanilla implementation

## Future Enhancement Ideas

- [ ] Drag seat positions to reorder
- [ ] Save multiple classroom snapshots
- [ ] Collaboration/sharing features
- [ ] Student image avatars
- [ ] Advanced filtering by multiple criteria
- [ ] Seating analytics and recommendations
- [ ] Integration with school systems
- [ ] Voice commands for accessibility

## Troubleshooting

**Problem**: Students not saving after refresh
- **Solution**: Click "Save" button explicitly, or check browser localStorage is enabled

**Problem**: Drag & drop not working on mobile
- **Solution**: Tap and hold, then drag (touch-enabled)

**Problem**: High contrast mode looks wrong
- **Solution**: Toggle "Contrast" button again, or check browser zoom

**Problem**: Import fails with "Invalid format"
- **Solution**: Ensure CSV has headers: id,student_id,name,grade,group,note

## License & Attribution

This application is designed as an open-source tool for educational institutions. Feel free to modify and deploy.

## Contact & Support

For issues or feature requests, please document:
- Browser and OS version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

---

**Version**: 1.0.0  
**Last Updated**: November 2025  
**Status**: Production Ready ✓