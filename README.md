Holidaze - Accommodation Booking Front-End
Welcome to Holidaze, an accommodation booking platform. This repository contains the front-end application built as part of the Project Exam 2. The goal of this project is to deliver a modern and user-friendly platform for booking and managing venues using the Holidaze API. The platform caters to both customers and venue managers, with dedicated functionality for each user type.

📖 Table of Contents
Project Goal
Features
Technical Specifications
User Stories
Requirements
Setup and Installation
Links
Acknowledgments
🎯 Project Goal
To demonstrate the skills learned over two years by planning, designing, and building a robust and visually appealing front-end application that meets technical and functional requirements. The application showcases proficiency in JavaScript, React, CSS frameworks, API integration, and deployment.

✨ Features
🏠 Customer-Facing Functionality
View a list of venues with detailed descriptions.
Search for venues by title.
View specific venue details, including a calendar of available dates.
Register as a customer using a valid @stud.noroff.no email.
Book venues and view upcoming bookings.
🛠️ Admin-Facing Functionality (Venue Manager)
Register as a venue manager using a valid @stud.noroff.no email.
Create, update, and delete venues.
View bookings for venues managed by the user.
👥 General User Functionality
User authentication: login, logout, and session persistence.
Update user avatar.
Responsive design for seamless experience on all devices.
🛠 Technical Specifications
Frameworks and Libraries
JavaScript Framework: React (v18+)
CSS Framework: Styled Components
Hosting Service: Netlify
Design Application: Figma
Planning Application: Trello
API Integration
All data for the application is managed via the Holidaze API. The API provides functionality for venues, bookings, and user management. Documentation is available in the Noroff API Documentation.

📜 User Stories
Customers
Browse Venues: View a list of all available venues.
Search Venues: Search for venues by title.
View Venue Details: View a venue's detailed description, facilities, and availability calendar.
Make Bookings: Book venues and manage upcoming bookings.
Account Management: Register, log in, log out, and update avatar.
Venue Managers
Create Venues: Add new venues to the platform.
Manage Venues: Update or delete venues they own.
View Bookings: View and manage bookings for their venues.
✅ Requirements
Use React for the front end.
Use Styled Components for styling.
Application hosted on Netlify.
All functionality must use the Holidaze API.
🚀 Setup and Installation
Follow these steps to run the application locally:

Clone the repository:

bash
Kopier
Rediger
git clone https://github.com/yourusername/holidaze.git
cd holidaze
Install dependencies:

bash
Kopier
Rediger
npm install
Create a .env file and add the API key:

makefile
Kopier
Rediger
REACT_APP_API_URL=https://api.noroff.dev
REACT_APP_API_KEY=your-api-key
Start the development server:

bash
Kopier
Rediger
npm start
Open your browser and navigate to http://localhost:3000.

🔗 Links
Gantt Chart: View Project Timeline
Design Prototype: Figma Design
Style Guide: Style Guide
Kanban Board: Trello Board
Repository: GitHub Repository
Hosted Application: Live Demo on Netlify
🙌 Acknowledgments
Special thanks to Noroff School of Technology and Digital Media for providing the API and the project brief.
