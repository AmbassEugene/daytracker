# DayTracker

A React Native task management app built with Expo that helps you track daily tasks with priorities and maintain productive habits.

## Features

### Current Features

- **Task Management**: Create, complete, and delete tasks
- **Priority Levels**: Organize tasks by priority (High, Medium, Low) with color coding
- **Daily Repeating Tasks**: Set tasks to automatically reset each day
- **Task Purpose**: Add context to understand why each task matters
- **Persistent Storage**: All tasks saved locally using AsyncStorage
- **Smart Sorting**: Tasks automatically sorted by priority and completion status
- **Clean UI**: Modern, intuitive interface with modal-based task creation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo Go app on your mobile device

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AmbassEugene/daytracker.git
cd daytracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Scan the QR code with:
   - **iOS**: Camera app
   - **Android**: Expo Go app

## Enhancement Features Roadmap

### Todo List

- [ ] **Task Editing**
  - [ ] Implement edit mode for existing tasks
  - [ ] Add long-press or swipe gesture to trigger edit
  - [ ] Preserve completion history when editing
  - [ ] Update modal to support both create and edit modes

- [ ] **Streak Tracking**
  - [ ] Add streak counter to task data model
  - [ ] Track consecutive days of task completion
  - [ ] Display current streak on task cards
  - [ ] Show longest streak achieved
  - [ ] Add visual indicators (fire icon, progress bar)
  - [ ] Create streak calendar view
  - [ ] Reset streak logic when tasks are skipped

- [ ] **Categories/Labels**
  - [ ] Design category data structure
  - [ ] Add category selection to task creation
  - [ ] Implement color-coded category badges
  - [ ] Create category filter functionality
  - [ ] Support multiple labels per task
  - [ ] Add category management screen

- [ ] **Due Dates & Times**
  - [ ] Add date/time picker to task creation
  - [ ] Implement due date storage in task model
  - [ ] Sort tasks by due date option
  - [ ] Visual indicators for overdue tasks
  - [ ] Create Today/Upcoming/Overdue sections
  - [ ] Add time-specific reminders

- [ ] **Statistics Dashboard**
  - [ ] Create new statistics screen
  - [ ] Calculate daily completion rate
  - [ ] Show weekly/monthly productivity trends
  - [ ] Display tasks completed by priority
  - [ ] Show tasks completed by category
  - [ ] Add streak statistics and achievements
  - [ ] Implement charts and graphs
  - [ ] Add navigation to dashboard

- [ ] **Search & Filtering**
  - [ ] Add search bar component
  - [ ] Implement search by description/purpose
  - [ ] Create filter by priority
  - [ ] Add filter by category
  - [ ] Filter by completion status
  - [ ] Add date range filtering
  - [ ] Create quick filter buttons (Today, This Week, High Priority)

- [ ] **Dark Mode**
  - [ ] Design dark theme color palette
  - [ ] Implement theme context/provider
  - [ ] Add system-based theme detection
  - [ ] Create manual theme toggle
  - [ ] Update all components for dark theme
  - [ ] Add smooth theme transitions
  - [ ] Persist theme preference

- [ ] **Notifications**
  - [ ] Set up push notification permissions
  - [ ] Implement task reminder notifications
  - [ ] Add daily summary notifications
  - [ ] Create streak milestone notifications
  - [ ] Build notification settings screen
  - [ ] Add notification scheduling logic
  - [ ] Handle notification interactions

- [ ] **Export/Import**
  - [ ] Implement export to JSON format
  - [ ] Add export to CSV functionality
  - [ ] Create import from file feature
  - [ ] Add cloud backup (iCloud/Google Drive)
  - [ ] Implement data sync across devices
  - [ ] Create share functionality
  - [ ] Add backup scheduling

## Tech Stack

- **Framework**: React Native
- **Platform**: Expo
- **Storage**: AsyncStorage
- **UI Components**: React Native core components
- **Navigation**: (To be added)
- **State Management**: React Hooks

## Project Structure

```
DayTracker/
├── App.js              # Main application component
├── package.json        # Dependencies and scripts
├── FEATURES.md         # Detailed feature descriptions
├── README.md           # Project documentation
└── .gitignore         # Git ignore rules
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Author

AmbassEugene

## Acknowledgments

Built with React Native and Expo
