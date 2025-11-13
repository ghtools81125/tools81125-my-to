# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Open the App
Simply open `index.html` in your web browser:
- **Windows**: Double-click `index.html`
- **Mac**: Double-click `index.html` or `open index.html`
- **Linux**: Open in your browser or `firefox index.html`

### Step 2: Create Your First Classroom
1. Click the **"📋 New Classroom"** button
2. Fill in:
   - **Name**: e.g., "Grade 5A" or "Math Class"
   - **Rows**: 4 (number of rows of desks)
   - **Columns**: 5 (number of seats per row)
   - **Other settings**: Keep defaults or customize
3. Click **"Create"**

✓ You now have 20 empty seats!

### Step 3: Add Students
1. Click the **"📥 Import"** button
2. Choose **"CSV Format"** tab
3. Click the file input and select `sample-students.csv`
4. Click **"Import"**

✓ 15 students added to the unassigned list!

### Step 4: Assign Seating
**Option A: Drag & Drop (Manual)**
- Drag each student from the right panel onto a seat
- Takes ~1 minute for 15 students

**Option B: Auto-Group (Instant)**
- Click **"🔀 Auto-Group"**
- Select a strategy (Random, By Name, By Gender, By Performance)
- Click **"Apply"**

✓ All seats filled in 2 seconds!

### Step 5: Save Your Work
- Click the **"💾 Save"** button
- Data saves to your browser's local storage
- Close and reopen - your data is still there!

### Step 6: Export & Share
1. Click **"📤 Export"**
2. Check desired formats (JSON for data, CSV for spreadsheet, PDF for printing)
3. Click **"Export"**
4. Files download to your Downloads folder

---

## 📱 Features at a Glance

### Main Toolbar (Top)
| Button | Purpose |
|--------|---------|
| 📋 New Classroom | Create or modify classroom |
| 📥 Import | Load students from CSV/JSON |
| 📤 Export | Download seating data |
| ↶ Undo | Reverse last action |
| ↷ Redo | Redo last undone action |
| 🔀 Auto-Group | Automatically assign seats |
| 🔄 Rotate | Rotate seating periodically |
| 🏷️ Names | Show/hide student names |
| ◐ Contrast | Enable high contrast mode |
| 🖨️ Print | Print seating chart |
| 🎬 Present | Full-screen presentation |
| 💾 Save | Save to browser storage |

### Right Panel
- **Unassigned Students**: Drag these to seats
- **Filters**: Search by name, grade, or group
- **Grouping Options**: Quick auto-group buttons
- **Statistics**: Shows assigned/unassigned counts

### Main Canvas
- **Seats**: Click to select, double-click to edit student
- **Drag & Drop**: Drag students from list to seats
- **Multi-select**: Shift+click for bulk actions

---

## ⌨️ Keyboard Shortcuts

```
Ctrl+Z   → Undo
Ctrl+Y   → Redo
Ctrl+S   → Save
Ctrl+P   → Print
Tab      → Navigate
Arrows   → Move focus
?        → Show help
```

---

## 📊 Sample Data

Two sample datasets are included:

### `sample-students.csv`
Traditional comma-separated format with 15 students:
```
id,student_id,name,grade,group,note
1,STU001,Alice Johnson,A,Group A,High performer
...
```

### `sample-students.json`
JSON array format with same 15 students:
```json
[
  {
    "student_id": "STU001",
    "name": "Alice Johnson",
    "grade": "A",
    ...
  }
]
```

---

## 🎯 Common Tasks

### Create Custom Student List
1. Open a spreadsheet (Excel, Google Sheets)
2. Create columns: id, student_id, name, grade, group, note
3. Add your students
4. Export as CSV
5. Import into Seating Chart

### Rotate Seats Monthly
1. Click **"🔄 Rotate"**
2. Choose rotation strategy
3. Click **"Apply"**
4. Seats rearrange automatically!

### Lock Special Needs Seats
1. Double-click a student's seat
2. Check "Lock this student in current seat"
3. Click "Save"
4. That seat won't move during rotations

### Print for Physical Classroom
1. Arrange seating as desired
2. Click **"🖨️ Print"** or Ctrl+P
3. Browser print dialog opens
4. Print to PDF or physical printer
5. Perfect A4 layout for posting

---

## 🔐 Privacy & Storage

- ✓ **All data stored locally** in your browser
- ✓ **No server/cloud upload** - completely private
- ✓ **No account required** - just open and use
- ✓ **Export anytime** to backup your data
- ✓ **Clear browser cache** deletes all data (back up first!)

---

## ✨ Pro Tips

1. **Use student grades/groups**: Tag students with performance levels (A, B, C) for smart grouping

2. **Add notes**: Special needs, preferences, or interests in the note field

3. **Bulk import**: Copy-paste directly into "Paste Data" tab instead of file upload

4. **Keyboard power user**: Use Tab + Arrow keys + Space/Enter for entirely hands-off control

5. **Export regularly**: Create backups of working seating arrangements

6. **Presentation mode**: Use on projector to display classroom arrangement

7. **High contrast**: Enable for better visibility on projectors or for accessibility

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Data not saving | Click "Save" explicitly - browser may need permission |
| Can't drag students | Switch to Teacher mode (top right) |
| Import fails | Check CSV headers match: id,student_id,name,grade,group,note |
| Mobile not working | Application is responsive - should work, but desktop better for drag-drop |
| Forgot to save | LocalStorage auto-saves on each action - check browser storage |

---

## 📞 Need Help?

1. **Keyboard Shortcuts**: Press `?` to see full help
2. **Tooltips**: Hover over buttons for descriptions
3. **Test Mode**: Use sample data to learn features
4. **Read README.md**: Full documentation and features

---

**Happy Seating! 🎓**

*Classroom Seating Chart Manager v1.0.0*
