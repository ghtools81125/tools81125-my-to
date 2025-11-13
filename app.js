/**
 * Classroom Seating Chart Manager - Main Application
 * A comprehensive web application for managing classroom seating arrangements
 * 
 * Features:
 * - Create and configure classrooms
 * - Import/export student data
 * - Drag-and-drop seating interface
 * - Automatic grouping and rotation
 * - Undo/redo history (20 steps)
 * - Accessibility-first design
 * - Fully client-side (localStorage based)
 */

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

class AppState {
  constructor() {
    this.classroom = null;
    this.students = [];
    this.seats = [];
    this.seatingArrangement = new Map(); // seatId -> studentId
    this.historyStack = [];
    this.redoStack = [];
    this.maxHistorySteps = 20;
    this.userMode = 'teacher'; // 'teacher' or 'viewer'
    this.showLabels = true;
    this.lockedSeats = new Set();
    this.rotationHistory = [];
  }

  saveToHistory() {
    const state = {
      classroom: JSON.parse(JSON.stringify(this.classroom)),
      students: JSON.parse(JSON.stringify(this.students)),
      seatingArrangement: new Map(this.seatingArrangement),
      lockedSeats: new Set(this.lockedSeats),
    };
    this.historyStack.push(state);
    if (this.historyStack.length > this.maxHistorySteps) {
      this.historyStack.shift();
    }
    this.redoStack = [];
  }

  undo() {
    if (this.historyStack.length === 0) return false;
    const state = this.historyStack.pop();
    this.redoStack.push({
      classroom: JSON.parse(JSON.stringify(this.classroom)),
      students: JSON.parse(JSON.stringify(this.students)),
      seatingArrangement: new Map(this.seatingArrangement),
      lockedSeats: new Set(this.lockedSeats),
    });
    this.classroom = state.classroom;
    this.students = state.students;
    this.seatingArrangement = state.seatingArrangement;
    this.lockedSeats = state.lockedSeats;
    return true;
  }

  redo() {
    if (this.redoStack.length === 0) return false;
    const state = this.redoStack.pop();
    this.historyStack.push({
      classroom: JSON.parse(JSON.stringify(this.classroom)),
      students: JSON.parse(JSON.stringify(this.students)),
      seatingArrangement: new Map(this.seatingArrangement),
      lockedSeats: new Set(this.lockedSeats),
    });
    this.classroom = state.classroom;
    this.students = state.students;
    this.seatingArrangement = state.seatingArrangement;
    this.lockedSeats = state.lockedSeats;
    return true;
  }
}

// ============================================================================
// MAIN APPLICATION CLASS
// ============================================================================

class SeatingChartApp {
  constructor() {
    this.state = new AppState();
    this.draggedStudent = null;
    this.draggedStudentSource = null;
    this.selectedSeats = new Set();
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadFromLocalStorage();
    this.render();
  }

  // ============================================================================
  // EVENT LISTENERS SETUP
  // ============================================================================

  setupEventListeners() {
    // Toolbar buttons
    document.getElementById('btn-new-classroom').addEventListener('click', () => this.showModal('modal-classroom-setup'));
    document.getElementById('btn-import').addEventListener('click', () => this.showModal('modal-import'));
    document.getElementById('btn-export').addEventListener('click', () => this.showModal('modal-export'));
    document.getElementById('btn-undo').addEventListener('click', () => this.handleUndo());
    document.getElementById('btn-redo').addEventListener('click', () => this.handleRedo());
    document.getElementById('btn-auto-group').addEventListener('click', () => this.showModal('modal-auto-group'));
    document.getElementById('btn-rotate-seats').addEventListener('click', () => this.showModal('modal-rotate'));
    document.getElementById('btn-toggle-labels').addEventListener('click', () => this.toggleLabels());
    document.getElementById('btn-high-contrast').addEventListener('click', () => this.toggleHighContrast());
    document.getElementById('btn-print').addEventListener('click', () => window.print());
    document.getElementById('btn-presentation').addEventListener('click', () => this.enterPresentationMode());
    document.getElementById('btn-save').addEventListener('click', () => this.saveToLocalStorage());

    // Mode selection
    document.getElementById('mode-select').addEventListener('change', (e) => {
      this.state.userMode = e.target.value;
      this.updateUIForMode();
    });

    // Filters
    document.getElementById('filter-students').addEventListener('input', () => this.renderStudentsList());
    document.getElementById('filter-grade').addEventListener('change', () => this.renderStudentsList());
    document.getElementById('filter-group').addEventListener('change', () => this.renderStudentsList());

    // Grouping buttons
    document.getElementById('btn-group-random').addEventListener('click', () => this.autoGroup('random'));
    document.getElementById('btn-group-by-name').addEventListener('click', () => this.autoGroup('name'));
    document.getElementById('btn-group-by-gender').addEventListener('click', () => this.autoGroup('gender'));
    document.getElementById('btn-group-by-performance').addEventListener('click', () => this.autoGroup('performance'));

    // Classroom setup modal
    document.getElementById('btn-modal-create-classroom').addEventListener('click', () => this.createClassroom());
    document.getElementById('btn-modal-cancel-classroom').addEventListener('click', () => this.closeModal('modal-classroom-setup'));

    // Import modal
    document.getElementById('btn-modal-import-confirm').addEventListener('click', () => this.confirmImport());
    document.getElementById('btn-modal-cancel-import').addEventListener('click', () => this.closeModal('modal-import'));
    document.querySelectorAll('.import-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.switchImportTab(e.target.dataset.tab));
    });

    // Export modal
    document.getElementById('btn-modal-export-confirm').addEventListener('click', () => this.confirmExport());
    document.getElementById('btn-modal-cancel-export').addEventListener('click', () => this.closeModal('modal-export'));

    // Auto-group modal
    document.getElementById('btn-modal-confirm-autogroup').addEventListener('click', () => this.applyAutoGroup());
    document.getElementById('btn-modal-cancel-autogroup').addEventListener('click', () => this.closeModal('modal-auto-group'));

    // Rotate modal
    document.getElementById('btn-modal-confirm-rotate').addEventListener('click', () => this.applyRotation());
    document.getElementById('btn-modal-cancel-rotate').addEventListener('click', () => this.closeModal('modal-rotate'));

    // Student details modal
    document.getElementById('btn-modal-save-student').addEventListener('click', () => this.saveStudentDetails());
    document.getElementById('btn-modal-student-delete').addEventListener('click', () => this.deleteStudent());
    document.getElementById('btn-modal-cancel-student').addEventListener('click', () => this.closeModal('modal-student-details'));

    // Exit presentation
    document.getElementById('btn-exit-presentation').addEventListener('click', () => this.exitPresentationMode());

    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        if (modal) this.closeModal(modal.id);
      });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

    // Close modal on background click
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeModal(modal.id);
      });
    });
  }

  // ============================================================================
  // CLASSROOM MANAGEMENT
  // ============================================================================

  createClassroom() {
    const name = document.getElementById('classroom-name').value;
    const rows = parseInt(document.getElementById('classroom-rows').value);
    const cols = parseInt(document.getElementById('classroom-cols').value);
    const seatSize = parseInt(document.getElementById('seat-size').value);
    const spacing = parseInt(document.getElementById('seat-spacing').value);
    const layout = document.getElementById('classroom-layout').value;
    const orientation = document.getElementById('classroom-orientation').value;

    if (!name || rows < 1 || cols < 1) {
      this.showToast('Please fill in all required fields', 'error');
      return;
    }

    this.state.saveToHistory();

    this.state.classroom = {
      id: this.generateId(),
      name,
      rows,
      cols,
      seatSize,
      spacing,
      layout,
      orientation,
      createdAt: new Date().toISOString(),
    };

    // Generate seats
    this.state.seats = [];
    this.state.seatingArrangement = new Map();
    this.state.lockedSeats = new Set();

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        this.state.seats.push({
          id: this.generateId(),
          row: r,
          col: c,
          position: { x: c * (seatSize + spacing), y: r * (seatSize + spacing) },
        });
      }
    }

    this.closeModal('modal-classroom-setup');
    this.render();
    this.showToast(`Classroom "${name}" created successfully!`, 'success');
  }

  // ============================================================================
  // STUDENT MANAGEMENT
  // ============================================================================

  addStudent(studentData) {
    const student = {
      id: this.generateId(),
      student_id: studentData.student_id || '',
      name: studentData.name || 'Student',
      grade: studentData.grade || '',
      group: studentData.group || '',
      note: studentData.note || '',
    };
    this.state.students.push(student);
    return student;
  }

  deleteStudentById(studentId) {
    this.state.students = this.state.students.filter(s => s.id !== studentId);
    for (const [seatId, sid] of this.state.seatingArrangement.entries()) {
      if (sid === studentId) {
        this.state.seatingArrangement.delete(seatId);
      }
    }
  }

  assignStudentToSeat(studentId, seatId) {
    // Remove from other seats
    for (const [s, sid] of this.state.seatingArrangement.entries()) {
      if (sid === studentId) {
        this.state.seatingArrangement.delete(s);
        break;
      }
    }
    this.state.seatingArrangement.set(seatId, studentId);
  }

  // ============================================================================
  // IMPORT/EXPORT
  // ============================================================================

  switchImportTab(tab) {
    document.querySelectorAll('.import-tab-content').forEach(el => (el.style.display = 'none'));
    document.getElementById(`tab-${tab}`).style.display = 'block';
    document.querySelectorAll('.import-tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
  }

  confirmImport() {
    try {
      let data = [];
      const activeTab = document.querySelector('.import-tab-btn.active').dataset.tab;

      if (activeTab === 'csv') {
        const file = document.getElementById('csv-file').files[0];
        if (!file) {
          this.showToast('Please select a CSV file', 'error');
          return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
          data = this.parseCSV(e.target.result);
          this.importStudents(data);
          this.closeModal('modal-import');
        };
        reader.readAsText(file);
      } else if (activeTab === 'json') {
        const file = document.getElementById('json-file').files[0];
        if (!file) {
          this.showToast('Please select a JSON file', 'error');
          return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
          data = JSON.parse(e.target.result);
          this.importStudents(data);
          this.closeModal('modal-import');
        };
        reader.readAsText(file);
      } else if (activeTab === 'paste') {
        const paste = document.getElementById('paste-data').value;
        if (!paste) {
          this.showToast('Please paste data', 'error');
          return;
        }
        try {
          data = JSON.parse(paste);
        } catch {
          data = this.parseCSV(paste);
        }
        this.importStudents(data);
        this.closeModal('modal-import');
      }
    } catch (error) {
      this.showToast(`Import error: ${error.message}`, 'error');
    }
  }

  parseCSV(csv) {
    const lines = csv.split('\n').filter(l => l.trim());
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const data = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const obj = {};
      headers.forEach((h, idx) => {
        obj[h] = values[idx] || '';
      });
      data.push(obj);
    }
    return data;
  }

  importStudents(data) {
    this.state.saveToHistory();
    let count = 0;
    data.forEach(studentData => {
      if (studentData.name) {
        this.addStudent(studentData);
        count++;
      }
    });
    this.updateFilterOptions();
    this.render();
    this.showToast(`Imported ${count} students successfully!`, 'success');
  }

  confirmExport() {
    const exportJson = document.getElementById('export-json').checked;
    const exportCsv = document.getElementById('export-csv').checked;
    const exportPng = document.getElementById('export-png').checked;
    const exportPdf = document.getElementById('export-pdf').checked;

    if (!exportJson && !exportCsv && !exportPng && !exportPdf) {
      this.showToast('Please select at least one export format', 'error');
      return;
    }

    const timestamp = new Date().toISOString().split('T')[0];
    const baseFilename = `seating-chart-${timestamp}`;

    if (exportJson) {
      this.exportJSON(baseFilename);
    }
    if (exportCsv) {
      this.exportCSV(baseFilename);
    }
    if (exportPng) {
      this.exportPNG(baseFilename);
    }
    if (exportPdf) {
      window.print();
    }

    this.closeModal('modal-export');
    this.showToast('Export completed!', 'success');
  }

  exportJSON(filename) {
    const data = {
      classroom: this.state.classroom,
      students: this.state.students,
      seatingArrangement: Array.from(this.state.seatingArrangement.entries()),
    };
    const json = JSON.stringify(data, null, 2);
    this.downloadFile(json, `${filename}.json`, 'application/json');
  }

  exportCSV(filename) {
    let csv = 'id,student_id,name,grade,group,note,seat\n';
    this.state.students.forEach(student => {
      const seat = Array.from(this.state.seatingArrangement.entries()).find(([_, sid]) => sid === student.id)?.[0] || '';
      csv += `"${student.id}","${student.student_id}","${student.name}","${student.grade}","${student.group}","${student.note}","${seat}"\n`;
    });
    this.downloadFile(csv, `${filename}.csv`, 'text/csv');
  }

  exportPNG(filename) {
    const canvas = document.getElementById('seats-container');
    const link = document.createElement('a');
    link.href = canvas.toDataURL ? canvas.toDataURL('image/png') : '#';
    link.download = `${filename}.png`;
    link.click();
  }

  downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  // ============================================================================
  // AUTOMATIC GROUPING & ROTATION
  // ============================================================================

  applyAutoGroup() {
    const strategy = document.querySelector('input[name="group-strategy"]:checked').value;
    this.autoGroup(strategy);
    this.closeModal('modal-auto-group');
  }

  autoGroup(strategy) {
    if (!this.state.classroom || this.state.seats.length === 0) {
      this.showToast('Please create a classroom first', 'error');
      return;
    }

    this.state.saveToHistory();

    // Get unassigned and non-locked students
    const assignedStudentIds = new Set(this.state.seatingArrangement.values());
    const unassignedStudents = this.state.students.filter(s => !assignedStudentIds.has(s.id));
    const availableSeats = this.state.seats.filter(
      s => !this.state.seatingArrangement.has(s.id) && !this.state.lockedSeats.has(s.id)
    );

    let sortedStudents = [...unassignedStudents];

    switch (strategy) {
      case 'random':
        sortedStudents.sort(() => Math.random() - 0.5);
        break;
      case 'name':
        sortedStudents.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'gender':
        sortedStudents.sort((a, b) => (a.group || '').localeCompare(b.group || ''));
        break;
      case 'performance':
        sortedStudents.sort((a, b) => (a.grade || '').localeCompare(b.grade || ''));
        break;
      case 'rotate':
        const arrangement = Array.from(this.state.seatingArrangement.entries());
        if (arrangement.length > 0) {
          // Rotate students by one position
          const rotatedSeats = [...availableSeats];
          let idx = 0;
          for (const [seatId, studentId] of arrangement) {
            if (idx < rotatedSeats.length) {
              this.assignStudentToSeat(studentId, rotatedSeats[idx].id);
              idx++;
            }
          }
        }
        break;
    }

    // Assign students to available seats
    for (let i = 0; i < sortedStudents.length && i < availableSeats.length; i++) {
      this.assignStudentToSeat(sortedStudents[i].id, availableSeats[i].id);
    }

    this.render();
    this.showToast(`Auto-grouped using "${strategy}" strategy!`, 'success');
  }

  applyRotation() {
    const strategy = document.querySelector('input[name="rotate-strategy"]:checked').value;
    this.state.saveToHistory();

    const arrangement = Array.from(this.state.seatingArrangement.entries());
    if (arrangement.length === 0) {
      this.showToast('No seats assigned yet', 'error');
      return;
    }

    if (strategy === 'rows') {
      this.rotateByRows();
    } else if (strategy === 'clusters') {
      this.rotateByClusters();
    } else if (strategy === 'shuffle') {
      this.shuffleAll();
    }

    this.state.rotationHistory.push({
      timestamp: new Date().toISOString(),
      strategy,
    });

    this.closeModal('modal-rotate');
    this.render();
    this.showToast(`Seats rotated using "${strategy}" strategy!`, 'success');
  }

  rotateByRows() {
    const arrangement = Array.from(this.state.seatingArrangement.entries());
    const rows = new Map();

    // Group by row
    arrangement.forEach(([seatId, studentId]) => {
      const seat = this.state.seats.find(s => s.id === seatId);
      if (seat) {
        if (!rows.has(seat.row)) rows.set(seat.row, []);
        rows.get(seat.row).push({ seatId, studentId });
      }
    });

    // Rotate: last row -> first row
    const rowKeys = Array.from(rows.keys()).sort();
    for (let i = 0; i < rowKeys.length; i++) {
      const currentRow = rowKeys[i];
      const nextRow = rowKeys[(i + 1) % rowKeys.length];
      const currentSeats = rows.get(currentRow);
      const nextSeats = rows.get(nextRow);

      for (let j = 0; j < Math.min(currentSeats.length, nextSeats.length); j++) {
        this.state.seatingArrangement.set(nextSeats[j].seatId, currentSeats[j].studentId);
      }
    }
  }

  rotateByClusters() {
    this.shuffleAll();
  }

  shuffleAll() {
    const arrangement = Array.from(this.state.seatingArrangement.entries());
    const studentIds = arrangement.map(([_, sid]) => sid);
    const seatIds = arrangement.map(([sid, _]) => sid);

    studentIds.sort(() => Math.random() - 0.5);

    this.state.seatingArrangement.clear();
    for (let i = 0; i < seatIds.length; i++) {
      this.state.seatingArrangement.set(seatIds[i], studentIds[i]);
    }
  }

  // ============================================================================
  // RENDERING
  // ============================================================================

  render() {
    if (!this.state.classroom) {
      this.renderEmptyState();
      return;
    }

    this.renderClassroomInfo();
    this.renderSeats();
    this.renderStudentsList();
    this.updateStatistics();
    this.updateUIForMode();
  }

  renderEmptyState() {
    const container = document.getElementById('seats-container');
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--color-text-light);">
        <p style="font-size: 1.2rem; margin-bottom: 20px;">No classroom created yet</p>
        <button class="btn btn-primary" id="btn-create-classroom-empty" aria-label="Create new classroom">
          <span class="btn-icon">📋</span> Create Classroom
        </button>
      </div>
    `;
    document.getElementById('btn-create-classroom-empty').addEventListener('click', () => this.showModal('modal-classroom-setup'));
  }

  renderClassroomInfo() {
    document.getElementById('classroom-title').textContent = this.state.classroom.name;
    document.getElementById('classroom-info').textContent = 
      `${this.state.classroom.rows} rows × ${this.state.classroom.cols} columns | ${this.state.seats.length} total seats`;
  }

  renderSeats() {
    const container = document.getElementById('seats-container');
    container.innerHTML = '';

    const { seatSize, spacing } = this.state.classroom;
    const gridWidth = (this.state.classroom.cols * seatSize) + ((this.state.classroom.cols - 1) * spacing);

    const grid = document.createElement('div');
    grid.className = 'seats-grid';
    grid.style.gridTemplateColumns = `repeat(${this.state.classroom.cols}, ${seatSize}px)`;
    grid.style.gap = `${spacing}px`;
    grid.style.width = `${gridWidth}px`;

    this.state.seats.forEach(seat => {
      const seatEl = document.createElement('div');
      seatEl.className = 'seat';
      seatEl.style.width = `${seatSize}px`;
      seatEl.style.height = `${seatSize}px`;
      seatEl.id = `seat-${seat.id}`;
      seatEl.draggable = true;
      seatEl.role = 'gridcell';
      seatEl.tabIndex = 0;

      const studentId = this.state.seatingArrangement.get(seat.id);
      if (studentId) {
        const student = this.state.students.find(s => s.id === studentId);
        if (student) {
          seatEl.classList.add('occupied');
          if (this.state.lockedSeats.has(seat.id)) {
            seatEl.classList.add('locked');
          }
          if (!this.state.showLabels) {
            seatEl.classList.add('hidden-labels');
          }

          seatEl.innerHTML = `
            <div class="seat-student">
              <div class="seat-student-name">${this.truncateName(student.name)}</div>
              <div class="seat-student-id">${student.student_id || student.id.substring(0, 5)}</div>
            </div>
          `;

          seatEl.addEventListener('dblclick', (e) => {
            e.preventDefault();
            this.openStudentModal(student.id);
          });
        }
      } else {
        seatEl.innerHTML = '<div class="seat-empty-indicator">🪑</div>';
      }

      // Drag and drop events
      seatEl.addEventListener('dragstart', (e) => this.handleSeatDragStart(e, seat.id));
      seatEl.addEventListener('dragover', (e) => this.handleDragOver(e));
      seatEl.addEventListener('drop', (e) => this.handleSeatDrop(e, seat.id));
      seatEl.addEventListener('dragleave', (e) => this.handleDragLeave(e));
      seatEl.addEventListener('click', (e) => this.handleSeatClick(e, seat.id));

      // Keyboard navigation
      seatEl.addEventListener('keydown', (e) => this.handleSeatKeydown(e, seat.id));

      grid.appendChild(seatEl);
    });

    container.appendChild(grid);
  }

  renderStudentsList() {
    const container = document.getElementById('unassigned-students');
    container.innerHTML = '';

    const assignedIds = new Set(this.state.seatingArrangement.values());
    const filter = document.getElementById('filter-students').value.toLowerCase();
    const filterGrade = document.getElementById('filter-grade').value;
    const filterGroup = document.getElementById('filter-group').value;

    let unassigned = this.state.students.filter(s => !assignedIds.has(s.id));

    unassigned = unassigned.filter(s => {
      const nameMatch = s.name.toLowerCase().includes(filter) || (s.student_id || '').toLowerCase().includes(filter);
      const gradeMatch = !filterGrade || s.grade === filterGrade;
      const groupMatch = !filterGroup || s.group === filterGroup;
      return nameMatch && gradeMatch && groupMatch;
    });

    if (unassigned.length === 0) {
      container.innerHTML = '<p class="info-text" style="padding: 10px;">All students assigned</p>';
      return;
    }

    unassigned.forEach(student => {
      const item = document.createElement('div');
      item.className = 'student-item';
      item.draggable = true;
      item.id = `student-${student.id}`;
      item.role = 'listitem';

      item.innerHTML = `
        <div class="student-info">
          <div class="student-name">${student.name}</div>
          <div class="student-meta">${student.student_id} | ${student.grade}</div>
        </div>
      `;

      item.addEventListener('dragstart', (e) => this.handleStudentDragStart(e, student.id));
      item.addEventListener('dblclick', (e) => {
        e.preventDefault();
        this.openStudentModal(student.id);
      });

      container.appendChild(item);
    });
  }

  updateFilterOptions() {
    const grades = new Set(this.state.students.map(s => s.grade).filter(Boolean));
    const groups = new Set(this.state.students.map(s => s.group).filter(Boolean));

    const gradeSelect = document.getElementById('filter-grade');
    const groupSelect = document.getElementById('filter-group');

    const currentGrade = gradeSelect.value;
    const currentGroup = groupSelect.value;

    gradeSelect.innerHTML = '<option value="">All Grades</option>';
    grades.forEach(grade => {
      const option = document.createElement('option');
      option.value = grade;
      option.textContent = grade;
      gradeSelect.appendChild(option);
    });
    gradeSelect.value = currentGrade;

    groupSelect.innerHTML = '<option value="">All Groups</option>';
    groups.forEach(group => {
      const option = document.createElement('option');
      option.value = group;
      option.textContent = group;
      groupSelect.appendChild(option);
    });
    groupSelect.value = currentGroup;
  }

  updateStatistics() {
    const assigned = this.state.seatingArrangement.size;
    const total = this.state.students.length;
    const unassigned = total - assigned;

    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-assigned').textContent = assigned;
    document.getElementById('stat-unassigned').textContent = unassigned;
  }

  // ============================================================================
  // DRAG AND DROP
  // ============================================================================

  handleStudentDragStart(e, studentId) {
    if (this.state.userMode !== 'teacher') {
      e.preventDefault();
      return;
    }
    this.draggedStudent = studentId;
    this.draggedStudentSource = 'students-list';
    e.dataTransfer.effectAllowed = 'move';
    e.target.classList.add('dragging');
  }

  handleSeatDragStart(e, seatId) {
    if (this.state.userMode !== 'teacher') {
      e.preventDefault();
      return;
    }
    const studentId = this.state.seatingArrangement.get(seatId);
    if (studentId) {
      this.draggedStudent = studentId;
      this.draggedStudentSource = `seat-${seatId}`;
      e.dataTransfer.effectAllowed = 'move';
      e.target.closest('.seat').classList.add('dragging');
    }
  }

  handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (e.target.closest('.seat')) {
      e.target.closest('.seat').classList.add('drag-over');
    }
  }

  handleDragLeave(e) {
    if (e.target.closest('.seat')) {
      e.target.closest('.seat').classList.remove('drag-over');
    }
  }

  handleSeatDrop(e, seatId) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    const seat = e.target.closest('.seat');
    if (seat) {
      seat.classList.remove('drag-over');
    }

    if (this.draggedStudent) {
      if (this.state.lockedSeats.has(seatId)) {
        this.showToast('This seat is locked', 'warning');
        return;
      }

      this.state.saveToHistory();
      this.assignStudentToSeat(this.draggedStudent, seatId);

      // Remove from source if it was a seat
      if (this.draggedStudentSource.startsWith('seat-')) {
        const sourceSeatId = this.draggedStudentSource.split('-')[1];
        this.state.seatingArrangement.delete(sourceSeatId);
      }

      this.render();
    }

    this.draggedStudent = null;
    this.draggedStudentSource = null;
  }

  // ============================================================================
  // KEYBOARD NAVIGATION & EVENTS
  // ============================================================================

  handleSeatClick(e, seatId) {
    if (e.shiftKey) {
      this.selectedSeats.add(seatId);
      document.getElementById(`seat-${seatId}`).classList.add('selected');
    } else {
      this.selectedSeats.clear();
      document.querySelectorAll('.seat.selected').forEach(el => el.classList.remove('selected'));
    }
  }

  handleSeatKeydown(e, seatId) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const studentId = this.state.seatingArrangement.get(seatId);
      if (studentId) {
        this.openStudentModal(studentId);
      }
    }
  }

  handleKeyboardShortcuts(e) {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'z') {
        e.preventDefault();
        this.handleUndo();
      } else if (e.key === 'y' || (e.shiftKey && e.key === 'Z')) {
        e.preventDefault();
        this.handleRedo();
      } else if (e.key === 's') {
        e.preventDefault();
        this.saveToLocalStorage();
      } else if (e.key === 'p') {
        e.preventDefault();
        window.print();
      }
    } else if (e.key === '?') {
      e.preventDefault();
      this.showModal('modal-help');
    }
  }

  handleUndo() {
    if (this.state.undo()) {
      this.render();
      this.showToast('Undo successful', 'success');
      document.getElementById('btn-undo').disabled = this.state.historyStack.length === 0;
      document.getElementById('btn-redo').disabled = this.state.redoStack.length === 0;
    }
  }

  handleRedo() {
    if (this.state.redo()) {
      this.render();
      this.showToast('Redo successful', 'success');
      document.getElementById('btn-undo').disabled = this.state.historyStack.length === 0;
      document.getElementById('btn-redo').disabled = this.state.redoStack.length === 0;
    }
  }

  // ============================================================================
  // MODAL MANAGEMENT
  // ============================================================================

  showModal(modalId) {
    document.getElementById(modalId).classList.add('active');
    if (modalId === 'modal-classroom-setup') {
      document.getElementById('classroom-name').focus();
    }
  }

  closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
  }

  openStudentModal(studentId) {
    if (this.state.userMode !== 'teacher') return;

    const student = this.state.students.find(s => s.id === studentId);
    if (!student) return;

    document.getElementById('student-id').value = student.id;
    document.getElementById('student-student-id').value = student.student_id;
    document.getElementById('student-name').value = student.name;
    document.getElementById('student-grade').value = student.grade;
    document.getElementById('student-group').value = student.group;
    document.getElementById('student-note').value = student.note;
    document.getElementById('student-locked').checked = this.state.lockedSeats.has(studentId);

    this.currentEditingStudentId = studentId;
    this.showModal('modal-student-details');
  }

  saveStudentDetails() {
    if (!this.currentEditingStudentId) return;

    const student = this.state.students.find(s => s.id === this.currentEditingStudentId);
    if (!student) return;

    this.state.saveToHistory();
    student.student_id = document.getElementById('student-student-id').value;
    student.name = document.getElementById('student-name').value;
    student.grade = document.getElementById('student-grade').value;
    student.group = document.getElementById('student-group').value;
    student.note = document.getElementById('student-note').value;

    const locked = document.getElementById('student-locked').checked;
    if (locked) {
      const seatId = Array.from(this.state.seatingArrangement.entries()).find(([_, sid]) => sid === student.id)?.[0];
      if (seatId) {
        this.state.lockedSeats.add(seatId);
      }
    } else {
      for (const [seatId, sid] of this.state.seatingArrangement.entries()) {
        if (sid === student.id) {
          this.state.lockedSeats.delete(seatId);
        }
      }
    }

    this.updateFilterOptions();
    this.closeModal('modal-student-details');
    this.render();
    this.showToast('Student updated successfully', 'success');
  }

  deleteStudent() {
    if (!this.currentEditingStudentId) return;
    if (!confirm('Are you sure you want to delete this student?')) return;

    this.state.saveToHistory();
    this.deleteStudentById(this.currentEditingStudentId);
    this.closeModal('modal-student-details');
    this.render();
    this.showToast('Student deleted', 'success');
  }

  // ============================================================================
  // UI STATE MANAGEMENT
  // ============================================================================

  updateUIForMode() {
    const isTeacher = this.state.userMode === 'teacher';
    const editButtons = [
      'btn-new-classroom',
      'btn-import',
      'btn-auto-group',
      'btn-rotate-seats',
      'btn-undo',
      'btn-redo',
    ];

    editButtons.forEach(id => {
      document.getElementById(id).disabled = !isTeacher;
    });

    document.querySelectorAll('.seat').forEach(seat => {
      seat.draggable = isTeacher;
    });
  }

  toggleLabels() {
    this.state.showLabels = !this.state.showLabels;
    document.querySelectorAll('.seat.occupied').forEach(seat => {
      if (this.state.showLabels) {
        seat.classList.remove('hidden-labels');
      } else {
        seat.classList.add('hidden-labels');
      }
    });
    this.showToast(this.state.showLabels ? 'Labels shown' : 'Labels hidden', 'success');
  }

  toggleHighContrast() {
    document.documentElement.classList.toggle('high-contrast');
    const enabled = document.documentElement.classList.contains('high-contrast');
    this.showToast(enabled ? 'High contrast enabled' : 'High contrast disabled', 'success');
  }

  enterPresentationMode() {
    const modal = document.getElementById('modal-presentation');
    const canvas = document.getElementById('presentation-canvas');
    
    // Clone seating layout
    canvas.innerHTML = document.getElementById('seats-container').innerHTML;
    
    this.showModal('modal-presentation');
  }

  exitPresentationMode() {
    this.closeModal('modal-presentation');
  }

  // ============================================================================
  // PERSISTENCE
  // ============================================================================

  saveToLocalStorage() {
    try {
      const data = {
        classroom: this.state.classroom,
        students: this.state.students,
        seatingArrangement: Array.from(this.state.seatingArrangement.entries()),
        lockedSeats: Array.from(this.state.lockedSeats),
        rotationHistory: this.state.rotationHistory,
      };
      localStorage.setItem('seatingChartData', JSON.stringify(data));
      this.showToast('Saved to local storage', 'success');
    } catch (e) {
      this.showToast('Save failed: storage full', 'error');
    }
  }

  loadFromLocalStorage() {
    try {
      const data = JSON.parse(localStorage.getItem('seatingChartData'));
      if (data) {
        this.state.classroom = data.classroom;
        this.state.students = data.students || [];
        this.state.seatingArrangement = new Map(data.seatingArrangement || []);
        this.state.lockedSeats = new Set(data.lockedSeats || []);
        this.state.rotationHistory = data.rotationHistory || [];
        this.updateFilterOptions();
      }
    } catch (e) {
      console.error('Failed to load from local storage', e);
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast active ${type}`;
    setTimeout(() => {
      toast.classList.remove('active');
    }, 3000);
  }

  generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  truncateName(name) {
    return name.length > 12 ? name.substring(0, 10) + '..' : name;
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  new SeatingChartApp();
});
