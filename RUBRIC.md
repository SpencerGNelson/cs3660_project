# Project Part 5 - React Front End Rubric

## Overall Application (0 points - precondition)
Application is a single-page front end application in React with client-side routing that connects to an API back-end in Flask (Project Part 5 receives zero if these preconditions are not met).

## React Application Structure

### BrowserRouter in main.jsx (1 point)
BrowserRouter component is in main.jsx, wrapping around App component.

### App.jsx Routes (11 points)
App.jsx does client side routing for entire application using React Routes and Route components.

### Page Titles (2 points)
Page titles (displayed on browser tab) are distinct on all pages, set via React. This could be done in App.jsx, Layout.jsx, or individual page components

### Application Settings (2 points)
Nav link JSON is kept in a separate file on the front end (setup.jsx) along with any other whole-application settings.

## React Whole-Page Layout Components

### Page Components (11 points)
Page components are in separate files in src/pages subdirectory: Home, Contact, Professionals, Services, Register, Login, Pay, Admin, AddProfessional, AddService, and AddCategory.

### Repeated data (6 points)
JSON props and map functions are used to display Professionals, Services, AddProfessional, AddCategory, AddService, and Nav components.

### Layout Components (7 points)
App.jsx wraps all routes in Layout component, including Nav and Footer components, link information passed with a prop. Admin pages display a different Nav than other pages, linking to admin pages for adding professionals, services, and categories. Nested routes and Outlet component are used to make this happen.

## React Widget Components
React components exist in the reactapp/src/widgets directory with names and functions as specified below:

### Form Components (6 points)
Form, TextInput, TextArea, File, and Submit Components replace all form, input, and button tags used in forms. TextInput has a prop called password that makes it a password input if present. If code uses select, DropDown component has replaced it.

### Nav Components (3 points)
HamburgerButton and NavLinks components replace the button, ul, and li tags in the nav. Nav component takes a JSON prop for nav links.

### Professional and Service Components (4 points)
Individual Professional and Category components each display a single professional or category. These components accept JSON as a prop. Category component has a serviceList prop which displays the list of services only if present.

### Image Component (2 points)
All images are replaced with Image component, which uses a prop to determine whether to load from front end or back end.

### Link Components (3 points)
All a href tags, including both Nav links and other links, are replaced with Link components.

## Connection to Back End
The back end code is located in flaskapp directory, though it may be deployed to any URL. The back end connection works as specified:

### axiosInstance.jsx (1 point)
The link to the back end project root is stored in axiosInstance.jsx and used in all AJAX calls.

### flaskapp/static/images (1 point)
Database-managed images such as professionals and services are stored on the back end.

### Routes to get data (2 points)
Back end routes /get_professionals and /get_services return JSON professionals and services data using jsonify.

### Cleanup Unused Routes (1 point)
Unused back end routes that once rendered HTML templates are cleaned up.

### Back End Actions (3 points)
Back end actions still work as in project part 4 (database, file, and email actions).

### Axios Calls (4 points)
Axios calls to back end work. Props are passed to the Form component that specify where axios calls are made on form submission. Error messages are displayed the same way as in Project Part 4.

### Front End Success Actions (5 points)
Professionals, Categories, and Services update after any back end actions change them.

---

## Total Points: 70
