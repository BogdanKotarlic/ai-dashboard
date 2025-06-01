# AI-Enhanced Intelligence Dashboard

An interactive dashboard for creating, managing, and analyzing intelligence reports with AI assistance. This application allows users to create, edit, view, and organize reports with role-based access control and drag-and-drop functionality.

## Features

- **Report Management**
  - Create, edit, view, and delete reports
  - Search and filter reports by title
  - Rich text editing with TinyMCE
  - Drag and drop reordering of reports

- **AI Assistant Integration**
  - Generate draft reports based on user prompts
  - Summarize existing report content
  - AI-powered content suggestions

- **Role-Based Access Control**
  - Admin role: Full access to create, edit, delete, and reorder reports
  - Viewer role: Read-only access with restricted UI controls

- **Modern UI/UX**
  - Responsive Material UI design
  - Intuitive card-based interface
  - Visual feedback for user actions
  - Drag and drop functionality with visual cues

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/BogdanKotarlic/ai-dashboard.git
   cd ai-dashboard
   ```

2. Install dependencies
   ```
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```
   npm start
   # or
   yarn start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the application

## AI Integration Explanation

This dashboard integrates with OpenAI's API to provide AI-powered features:

### 1. Report Generation

The "Generate Draft" feature uses OpenAI's GPT model to create initial report drafts based on user prompts. The system sends a structured prompt to the API and formats the response as a draft report.

### 2. Content Summarization

The "Summarize Content" feature analyzes existing report content and generates concise summaries. This is particularly useful for long reports or when preparing executive summaries.

### 3. Implementation Details

- Requests are debounced to prevent excessive API calls
- Error handling includes fallbacks for API failures
- Mock implementations are available for development without API keys

## Known Limitations and Assumptions

### Authentication & Security

- The application uses a simplified mock authentication system
- User roles (Admin/Viewer) are stored in localStorage for demonstration purposes
- In a production environment, proper authentication with JWT or similar should be implemented

### Data Persistence

- Reports are stored in localStorage and will be lost if browser data is cleared
- No backend database integration is currently implemented

### AI Integration

- The OpenAI integration is mocked in the demo version
- Rate limits and token usage are not actively managed
