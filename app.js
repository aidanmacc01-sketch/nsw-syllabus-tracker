// ===== Data Model & State =====
let appState = {
    subjects: [],
    highlightMode: false
};

const CONFIDENCE_LEVELS = ['Unseen', 'Learning', 'Memorised', 'Exam-ready'];
const STORAGE_KEY = 'nsw-syllabus-tracker-data';

// ===== Utility Functions =====
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function saveToLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            appState = JSON.parse(saved);
        } catch (e) {
            console.error('Error loading data:', e);
            initializeDefaultState();
        }
    } else {
        initializeDefaultState();
    }
}

function initializeDefaultState() {
    appState = {
        subjects: Array.from({ length: 6 }, (_, i) => ({
            id: generateId(),
            name: `Subject ${i + 1}`,
            dotPoints: []
        })),
        highlightMode: false
    };
    saveToLocalStorage();
}

// ===== Progress Calculation =====
function calculateProgress(subject) {
    if (subject.dotPoints.length === 0) return 0;
    
    const masteredCount = subject.dotPoints.filter(dp => 
        dp.confidence === 'Memorised' || dp.confidence === 'Exam-ready'
    ).length;
    
    return Math.round((masteredCount / subject.dotPoints.length) * 100);
}

// ===== DOM Manipulation =====
function renderSubjects() {
    const grid = document.getElementById('subjects-grid');
    grid.innerHTML = '';
    
    appState.subjects.forEach(subject => {
        const column = createSubjectColumn(subject);
        grid.appendChild(column);
    });
}

function createSubjectColumn(subject) {
    const column = document.createElement('div');
    column.className = 'subject-column';
    column.dataset.subjectId = subject.id;
    
    const progress = calculateProgress(subject);
    
    column.innerHTML = `
        <div class="subject-header">
            <input 
                type="text" 
                class="subject-name-input" 
                value="${subject.name}"
                data-subject-id="${subject.id}"
            >
        </div>
        
        <div class="progress-container">
            <div class="progress-label">
                <span>Progress</span>
                <span class="progress-percentage">${progress}%</span>
            </div>
            <div class="progress-bar-track">
                <div class="progress-bar-fill" style="width: ${progress}%"></div>
            </div>
        </div>
        
        <div class="add-dotpoint">
            <input 
                type="text" 
                class="dotpoint-input" 
                placeholder="Enter a syllabus dot point..."
                data-subject-id="${subject.id}"
            >
            <button class="add-btn" data-subject-id="${subject.id}">
                Add dot point
            </button>
        </div>
        
        <div class="dotpoints-list" data-subject-id="${subject.id}">
            ${renderDotPoints(subject)}
        </div>
    `;
    
    return column;
}

function renderDotPoints(subject) {
    if (subject.dotPoints.length === 0) {
        return '<div class="empty-state">No dot points yet. Add one above!</div>';
    }
    
    return subject.dotPoints.map(dp => createDotPointHTML(dp, subject.id)).join('');
}

function createDotPointHTML(dotPoint, subjectId) {
    const highlightClass = appState.highlightMode ? getHighlightClass(dotPoint.confidence) : '';
    const confClass = `conf-${dotPoint.confidence.toLowerCase().replace(' ', '-')}`;
    
    return `
        <div class="dotpoint-item ${highlightClass}" data-dotpoint-id="${dotPoint.id}">
            <div class="dotpoint-text">${dotPoint.text}</div>
            <div class="dotpoint-controls">
                <select 
                    class="confidence-select ${confClass}" 
                    data-dotpoint-id="${dotPoint.id}"
                    data-subject-id="${subjectId}"
                >
                    ${CONFIDENCE_LEVELS.map(level => 
                        `<option value="${level}" ${dotPoint.confidence === level ? 'selected' : ''}>
                            ${level}
                        </option>`
                    ).join('')}
                </select>
                <button 
                    class="delete-btn" 
                    data-dotpoint-id="${dotPoint.id}"
                    data-subject-id="${subjectId}"
                >
                    🗑️
                </button>
            </div>
        </div>
    `;
}

function getHighlightClass(confidence) {
    if (confidence === 'Unseen' || confidence === 'Learning') {
        return 'weak-highlight';
    } else {
        return 'de-emphasize';
    }
}

// ===== Event Handlers =====
function handleAddDotPoint(subjectId) {
    const input = document.querySelector(`.dotpoint-input[data-subject-id="${subjectId}"]`);
    const text = input.value.trim();
    
    if (!text) return;
    
    const subject = appState.subjects.find(s => s.id === subjectId);
    if (!subject) return;
    
    const newDotPoint = {
        id: generateId(),
        text: text,
        confidence: 'Unseen'
    };
    
    subject.dotPoints.push(newDotPoint);
    input.value = '';
    
    saveToLocalStorage();
    renderSubjectColumn(subjectId);
}

function handleDeleteDotPoint(subjectId, dotPointId) {
    const subject = appState.subjects.find(s => s.id === subjectId);
    if (!subject) return;
    
    subject.dotPoints = subject.dotPoints.filter(dp => dp.id !== dotPointId);
    
    saveToLocalStorage();
    renderSubjectColumn(subjectId);
}

function handleConfidenceChange(subjectId, dotPointId, newConfidence) {
    const subject = appState.subjects.find(s => s.id === subjectId);
    if (!subject) return;
    
    const dotPoint = subject.dotPoints.find(dp => dp.id === dotPointId);
    if (!dotPoint) return;
    
    dotPoint.confidence = newConfidence;
    
    saveToLocalStorage();
    renderSubjectColumn(subjectId);
}

function handleSubjectNameChange(subjectId, newName) {
    const subject = appState.subjects.find(s => s.id === subjectId);
    if (!subject) return;
    
    subject.name = newName || `Subject`;
    saveToLocalStorage();
}

function renderSubjectColumn(subjectId) {
    const subject = appState.subjects.find(s => s.id === subjectId);
    if (!subject) return;
    
    const column = document.querySelector(`.subject-column[data-subject-id="${subjectId}"]`);
    if (!column) return;
    
    const newColumn = createSubjectColumn(subject);
    column.replaceWith(newColumn);
}

// ===== Highlight Weak Dot Points =====
function toggleHighlightMode() {
    appState.highlightMode = !appState.highlightMode;
    
    const btn = document.getElementById('highlight-btn');
    if (appState.highlightMode) {
        btn.innerHTML = '<span class="icon">✓</span> Clear highlights';
    } else {
        btn.innerHTML = '<span class="icon">🔍</span> Highlight weak dot points';
    }
    
    renderSubjects();
}

// ===== Suggest 3 Dot Points =====
function suggestDotPoints() {
    const weakDotPoints = [];
    
    appState.subjects.forEach(subject => {
        subject.dotPoints.forEach(dp => {
            if (dp.confidence === 'Unseen' || dp.confidence === 'Learning') {
                weakDotPoints.push({
                    subject: subject.name,
                    dotPoint: dp,
                    weight: dp.confidence === 'Unseen' ? 2 : 1 // Prioritize Unseen
                });
            }
        });
    });
    
    if (weakDotPoints.length === 0) {
        showTodaysFocus([]);
        return;
    }
    
    // Weighted random selection
    const selected = [];
    const pool = [...weakDotPoints];
    
    for (let i = 0; i < Math.min(3, weakDotPoints.length); i++) {
        // Create weighted array
        const weighted = [];
        pool.forEach(item => {
            for (let w = 0; w < item.weight; w++) {
                weighted.push(item);
            }
        });
        
        // Pick random
        const randomIndex = Math.floor(Math.random() * weighted.length);
        const chosen = weighted[randomIndex];
        
        selected.push(chosen);
        
        // Remove from pool
        const poolIndex = pool.findIndex(item => 
            item.subject === chosen.subject && item.dotPoint.id === chosen.dotPoint.id
        );
        if (poolIndex > -1) {
            pool.splice(poolIndex, 1);
        }
    }
    
    showTodaysFocus(selected);
}

function showTodaysFocus(suggestions) {
    const panel = document.getElementById('today-focus');
    const list = document.getElementById('focus-list');
    
    if (suggestions.length === 0) {
        list.innerHTML = '<div class="focus-item"><div class="focus-item-text">🎉 Great work! You have no weak dot points to revise!</div></div>';
    } else {
        list.innerHTML = suggestions.map(s => `
            <div class="focus-item">
                <div class="focus-item-subject">${s.subject}</div>
                <div class="focus-item-text">${s.dotPoint.text}</div>
            </div>
        `).join('');
    }
    
    panel.classList.remove('hidden');
}

// ===== Event Delegation =====
document.addEventListener('click', (e) => {
    // Add dot point button
    if (e.target.classList.contains('add-btn')) {
        const subjectId = e.target.dataset.subjectId;
        handleAddDotPoint(subjectId);
    }
    
    // Delete dot point button
    if (e.target.classList.contains('delete-btn')) {
        const subjectId = e.target.dataset.subjectId;
        const dotPointId = e.target.dataset.dotpointId;
        handleDeleteDotPoint(subjectId, dotPointId);
    }
    
    // Highlight button
    if (e.target.closest('#highlight-btn')) {
        toggleHighlightMode();
    }
    
    // Suggest button
    if (e.target.closest('#suggest-btn')) {
        suggestDotPoints();
    }
});

document.addEventListener('change', (e) => {
    // Confidence select
    if (e.target.classList.contains('confidence-select')) {
        const subjectId = e.target.dataset.subjectId;
        const dotPointId = e.target.dataset.dotpointId;
        const newConfidence = e.target.value;
        handleConfidenceChange(subjectId, dotPointId, newConfidence);
    }
});

document.addEventListener('input', (e) => {
    // Subject name input
    if (e.target.classList.contains('subject-name-input')) {
        const subjectId = e.target.dataset.subjectId;
        const newName = e.target.value;
        handleSubjectNameChange(subjectId, newName);
    }
});

// Handle Enter key in dot point input
document.addEventListener('keypress', (e) => {
    if (e.target.classList.contains('dotpoint-input') && e.key === 'Enter') {
        const subjectId = e.target.dataset.subjectId;
        handleAddDotPoint(subjectId);
    }
});

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    renderSubjects();
});
