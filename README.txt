CAMPUS CONNECT - Placement Website (HTML + CSS + JavaScript)

HOW TO RUN
1. Unzip the folder. Keep all files together.
2. Double-click index.html (opens in Chrome).
3. Register a College, a Company and a Student (different emails), then test.

TEST FLOW
Company posts job -> Student applies -> Company clicks Select -> College sees "Total students placed".

FILES
index.html   - login + register
student.html - jobs list, apply, my applications
company.html - post job, my jobs, applicants
college.html - all students, companies, jobs, applications, placed count
script.js    - all logic (with comments)
style.css    - design

VIVA QUESTIONS AND ANSWERS
1. Where is the data stored?  In the browser's localStorage, as JSON text.
2. Why JSON.stringify / JSON.parse?  localStorage stores only text. stringify turns a list into text, parse turns it back into a list.
3. How does login work?  login() loops through saved users, matches email and password, saves that user as currentUser, then redirects to role.html.
4. How is each page protected?  checkAccess(role) compares currentUser's role; if it doesn't match, it redirects to index.html.
5. What is Date.now() used for?  To create a unique id for each user, job and application.
6. How does a student apply?  applyJob() finds the job by id and pushes a new application with status "Applied" into the applications list.
7. How does the company change status?  updateStatus() finds the application by id, changes its status, saves, and refreshes the table.
8. How is the placed count calculated?  Unique students having at least one application with status "Selected".
9. What are the limitations?  Data is only in one browser, passwords are not encrypted, no real server.
10. How can it be improved?  Add a backend (Flask/Node) and a database (MySQL/SQLite), password hashing, and email notifications.
