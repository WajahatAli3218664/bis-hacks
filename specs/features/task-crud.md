# Feature: Task CRUD Operations

## User Stories
- As a user, I can create a new task with title and description
- As a user, I can view all my tasks in a beautiful purple-themed interface
- As a user, I can update task details
- As a user, I can delete tasks
- As a user, I can mark tasks as complete/incomplete

## Acceptance Criteria

### Create Task
- Title is required (1-200 characters)
- Description is optional (max 1000 characters)
- Task is associated with logged-in user
- Purple button with hover effects

### View Tasks
- Only show tasks for current user
- Display in card format with purple accents
- Show title, description, status, created date
- Smooth animations on load

### Update Task
- Inline editing or modal
- Validate same as create
- Show success feedback

### Delete Task
- Confirmation dialog with purple theme
- Smooth removal animation

### Mark Complete
- Toggle checkbox with purple check
- Strike-through completed tasks
- Visual feedback
