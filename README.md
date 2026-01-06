# NSW Syllabus Dot-Point Tracker

A simple browser-based dashboard for HSC students to track syllabus dot points across up to 6 subjects, set confidence levels, and identify areas that need more revision.

## Features

- **6 Subject Columns**: Track dot points for up to 6 subjects (customizable names)
- **Confidence Levels**: Rate each dot point as Unseen, Learning, Memorised, or Exam-ready
- **Progress Tracking**: Visual progress bar for each subject showing mastery percentage
- **Highlight Weak Points**: One-click highlighting of all dot points needing revision
- **Smart Suggestions**: Get 3 randomly selected weak dot points to focus on today
- **Data Persistence**: All data saved in browser localStorage (survives page refresh)
- **Clean Design**: Minimal, student-friendly interface with color-coded confidence levels
- **Responsive**: Works on desktop, tablet, and mobile devices

## How to Run

1. **Open the app**: Simply double-click `index.html` or open it in your web browser
   - No installation required
   - No build steps needed
   - Works completely offline

2. **Alternative method**: 
   - Right-click `index.html` → Open with → Choose your preferred browser

## How to Use

### Setting Up Subjects

1. Click on any "Subject 1", "Subject 2", etc. heading to rename it (e.g., "English", "Maths Advanced", "Chemistry")
2. Your subject names are automatically saved

### Adding Dot Points

1. Type a syllabus dot point in the text input under any subject
2. Click "Add dot point" or press Enter
3. The dot point appears in the list below with "Unseen" as the default confidence level

### Setting Confidence Levels

For each dot point, select your confidence level from the dropdown:
- **Unseen** (Red): Haven't studied this yet
- **Learning** (Orange): Currently learning/revising
- **Memorised** (Blue): Have memorised the content
- **Exam-ready** (Green): Fully prepared and exam-ready

Progress bars update automatically as you change confidence levels.

### Using Global Controls

**Highlight weak dot points**:
- Click this button to visually highlight all "Unseen" and "Learning" dot points
- Mastered dot points (Memorised/Exam-ready) are greyed out
- Click again to clear highlights

**Suggest 3 dot points to revise today**:
- Click this button to get 3 random weak dot points to focus on
- "Unseen" dot points are prioritized over "Learning" ones
- Suggestions appear in the "Today's Focus" panel
- Great for daily study planning!

### Deleting Dot Points

- Click the 🗑️ button next to any dot point to remove it

## Data Storage

- All data is stored in your browser's localStorage
- Data persists when you close and reopen the browser
- Data is stored locally on your device (not synced across devices)
- To reset all data: Clear your browser's localStorage or delete all dot points manually

## Browser Compatibility

Works in all modern browsers:
- Google Chrome
- Mozilla Firefox
- Microsoft Edge
- Safari
- Opera

## File Structure

```
nsw-syllabus-tracker/
├── index.html      # Main HTML structure
├── styles.css      # All styling
├── app.js          # Application logic
└── README.md       # This file
```

## Customization Ideas

- **Change colors**: Edit CSS variables in `styles.css` (lines 2-20)
- **Add more subjects**: Modify the initialization in `app.js` (line 28)
- **Change confidence levels**: Edit the `CONFIDENCE_LEVELS` array in `app.js`
- **Adjust layout**: Modify grid breakpoints in `styles.css` (lines 200-218)

## Tips for HSC Students

1. **Be honest with confidence levels**: Accurate self-assessment helps identify true weak points
2. **Use "Today's Focus" daily**: Start each study session by clicking the suggest button
3. **Update regularly**: Mark dot points as you progress through your revision
4. **Track all subjects**: Even if you're strong in a subject, tracking helps maintain consistency
5. **Review weekly**: Use the highlight feature to see overall progress across all subjects

## Future Enhancement Ideas

- Export data to CSV/JSON
- Import syllabus from file
- Study timer integration
- Statistics and graphs
- Dark mode toggle
- Print-friendly view
- Share progress with study groups

## License

Free to use and modify for personal and educational purposes.

---

**Good luck with your HSC studies! 📚✨**
