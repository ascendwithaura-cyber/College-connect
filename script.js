// ================= HELPER FUNCTIONS =================

// Read a list from localStorage. If nothing is saved yet, return an empty list.
function getData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

// Save a list into localStorage (it only stores text, so we use JSON.stringify).
function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Get the user who is logged in right now (null if nobody).
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

// Protect a page: if the wrong person (or nobody) is logged in, send them to the login page.
function checkAccess(role) {
  var user = getCurrentUser();
  if (user == null || user.role != role) {
    window.location.href = "index.html";
  } else {
    document.getElementById("welcome").innerText = "Welcome, " + user.name + " (" + user.role + ")";
  }
}

// Logout: forget the current user and go back to the login page.
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

// ================= REGISTER AND LOGIN =================

function register() {
  // Read what the user typed in the form
  var name = document.getElementById("regName").value;
  var email = document.getElementById("regEmail").value;
  var password = document.getElementById("regPassword").value;
  var role = document.getElementById("regRole").value;

  // Make sure nothing is empty
  if (name == "" || email == "" || password == "") {
    alert("Please fill all fields");
    return;
  }

  var users = getData("users");

  // Check that this email is not already used
  for (var i = 0; i < users.length; i++) {
    if (users[i].email == email) {
      alert("This email is already registered");
      return;
    }
  }

  // Add the new user to the list and save it
  users.push({ id: Date.now(), name: name, email: email, password: password, role: role });
  saveData("users", users);
  alert("Registered successfully! Now login.");
}

function login() {
  var email = document.getElementById("loginEmail").value;
  var password = document.getElementById("loginPassword").value;
  var users = getData("users");

  // Look for a user whose email and password both match
  for (var i = 0; i < users.length; i++) {
    if (users[i].email == email && users[i].password == password) {
      // Remember who logged in
      localStorage.setItem("currentUser", JSON.stringify(users[i]));
      // Go to the correct page for their role
      window.location.href = users[i].role + ".html";
      return;
    }
  }
  alert("Wrong email or password");
}

// ================= STUDENT FUNCTIONS =================

// Show all jobs as cards, with an Apply button
function showJobs() {
  var jobs = getData("jobs");
  var apps = getData("applications");
  var me = getCurrentUser();
  var html = "";

  if (jobs.length == 0) {
    html = "<p>No placements posted yet.</p>";
  }

  for (var i = 0; i < jobs.length; i++) {
    // Check if this student already applied to this job
    var alreadyApplied = false;
    for (var j = 0; j < apps.length; j++) {
      if (apps[j].jobId == jobs[i].id && apps[j].studentId == me.id) {
        alreadyApplied = true;
      }
    }

    // Build the card text for this job
    html += "<div class='card'>";
    html += "<h3>" + jobs[i].title + "</h3>";
    html += "<p>Company: " + jobs[i].companyName + "</p>";
    html += "<p>Salary: " + jobs[i].salary + "</p>";
    html += "<p>Eligibility: " + jobs[i].eligibility + "</p>";
    html += "<p>Last date: " + jobs[i].lastDate + "</p>";
    if (alreadyApplied) {
      html += "<button disabled>Applied</button>";
    } else {
      html += "<button onclick='applyJob(" + jobs[i].id + ")'>Apply</button>";
    }
    html += "</div>";
  }

  // Put the built text into the page
  document.getElementById("jobList").innerHTML = html;
}

// Called when a student clicks Apply
function applyJob(jobId) {
  var jobs = getData("jobs");
  var apps = getData("applications");
  var me = getCurrentUser();

  // Find the job the student clicked
  for (var i = 0; i < jobs.length; i++) {
    if (jobs[i].id == jobId) {
      // Create a new application with status "Applied"
      apps.push({
        id: Date.now(),
        jobId: jobs[i].id,
        jobTitle: jobs[i].title,
        companyId: jobs[i].companyId,
        companyName: jobs[i].companyName,
        studentId: me.id,
        studentName: me.name,
        status: "Applied"
      });
    }
  }

  saveData("applications", apps);
  showJobs();            // refresh the job cards
  showMyApplications();  // refresh the table
}

// Show only this student's applications in a table
function showMyApplications() {
  var apps = getData("applications");
  var me = getCurrentUser();
  var html = "<table><tr><th>Job</th><th>Company</th><th>Status</th></tr>";

  for (var i = 0; i < apps.length; i++) {
    if (apps[i].studentId == me.id) {
      html += "<tr><td>" + apps[i].jobTitle + "</td><td>" + apps[i].companyName + "</td><td>" + apps[i].status + "</td></tr>";
    }
  }

  html += "</table>";
  document.getElementById("myApps").innerHTML = html;
}

// ================= COMPANY FUNCTIONS =================

// Save a new job from the form
function postJob() {
  var title = document.getElementById("jobTitle").value;
  var salary = document.getElementById("jobSalary").value;
  var eligibility = document.getElementById("jobEligibility").value;
  var lastDate = document.getElementById("jobDate").value;
  var me = getCurrentUser();

  if (title == "" || salary == "" || eligibility == "" || lastDate == "") {
    alert("Please fill all fields");
    return;
  }

  var jobs = getData("jobs");
  jobs.push({
    id: Date.now(),
    title: title,
    salary: salary,
    eligibility: eligibility,
    lastDate: lastDate,
    companyId: me.id,
    companyName: me.name
  });
  saveData("jobs", jobs);

  alert("Job posted!");
  showMyJobs();
}

// Show only the jobs posted by this company
function showMyJobs() {
  var jobs = getData("jobs");
  var me = getCurrentUser();
  var html = "<table><tr><th>Title</th><th>Salary</th><th>Eligibility</th><th>Last Date</th></tr>";

  for (var i = 0; i < jobs.length; i++) {
    if (jobs[i].companyId == me.id) {
      html += "<tr><td>" + jobs[i].title + "</td><td>" + jobs[i].salary + "</td><td>" + jobs[i].eligibility + "</td><td>" + jobs[i].lastDate + "</td></tr>";
    }
  }

  html += "</table>";
  document.getElementById("myJobs").innerHTML = html;
}

// Show students who applied to this company's jobs, with action buttons
function showApplicants() {
  var apps = getData("applications");
  var me = getCurrentUser();
  var html = "<table><tr><th>Student</th><th>Job</th><th>Status</th><th>Action</th></tr>";

  for (var i = 0; i < apps.length; i++) {
    if (apps[i].companyId == me.id) {
      html += "<tr><td>" + apps[i].studentName + "</td><td>" + apps[i].jobTitle + "</td><td>" + apps[i].status + "</td><td>";
      html += "<button onclick='updateStatus(" + apps[i].id + ", \"Shortlisted\")'>Shortlist</button> ";
      html += "<button onclick='updateStatus(" + apps[i].id + ", \"Selected\")'>Select</button> ";
      html += "<button onclick='updateStatus(" + apps[i].id + ", \"Rejected\")'>Reject</button>";
      html += "</td></tr>";
    }
  }

  html += "</table>";
  document.getElementById("applicants").innerHTML = html;
}

// Change the status of one application
function updateStatus(appId, newStatus) {
  var apps = getData("applications");

  for (var i = 0; i < apps.length; i++) {
    if (apps[i].id == appId) {
      apps[i].status = newStatus;
    }
  }

  saveData("applications", apps);
  showApplicants();  // refresh the table
}

// ================= COLLEGE FUNCTIONS =================

// Show everything: students, companies, jobs, applications and placed count
function showCollege() {
  var users = getData("users");
  var jobs = getData("jobs");
  var apps = getData("applications");

  // --- Students table ---
  var s = "<table><tr><th>Name</th><th>Email</th></tr>";
  // --- Companies table ---
  var c = "<table><tr><th>Name</th><th>Email</th></tr>";
  for (var i = 0; i < users.length; i++) {
    if (users[i].role == "student") {
      s += "<tr><td>" + users[i].name + "</td><td>" + users[i].email + "</td></tr>";
    }
    if (users[i].role == "company") {
      c += "<tr><td>" + users[i].name + "</td><td>" + users[i].email + "</td></tr>";
    }
  }
  document.getElementById("allStudents").innerHTML = s + "</table>";
  document.getElementById("allCompanies").innerHTML = c + "</table>";

  // --- Jobs table ---
  var j = "<table><tr><th>Title</th><th>Company</th><th>Salary</th></tr>";
  for (var i = 0; i < jobs.length; i++) {
    j += "<tr><td>" + jobs[i].title + "</td><td>" + jobs[i].companyName + "</td><td>" + jobs[i].salary + "</td></tr>";
  }
  document.getElementById("allJobs").innerHTML = j + "</table>";

  // --- Applications table + count of placed students ---
  var a = "<table><tr><th>Student</th><th>Job</th><th>Company</th><th>Status</th></tr>";
  var placed = [];  // names of students with status Selected (no repeats)
  for (var i = 0; i < apps.length; i++) {
    a += "<tr><td>" + apps[i].studentName + "</td><td>" + apps[i].jobTitle + "</td><td>" + apps[i].companyName + "</td><td>" + apps[i].status + "</td></tr>";
    if (apps[i].status == "Selected" && placed.indexOf(apps[i].studentId) == -1) {
      placed.push(apps[i].studentId);
    }
  }
  document.getElementById("allApps").innerHTML = a + "</table>";
  document.getElementById("placedCount").innerText = "Total students placed: " + placed.length;
}
