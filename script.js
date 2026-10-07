/* ============================
   DZIVARASEKWA 2 HIGH SCHOOL
   Sports Events Management System
   ============================ */

   const STORAGE_KEY = "d2hs_fixtures_v1";
   const ADMIN_PASSWORD = "d2hs2026"; // front-end prototype only, not secure
   
   const SPORT_ICONS = {
     Soccer: "⚽",
     Volleyball: "🏐",
     Basketball: "🏀",
     Netball: "🏐",
     Handball: "🤾"
   };
   
   const SPORT_IMAGES = {
     Soccer: "images/3193a89b0b061f68b6f60ac1d353ef6c.jpg",
     Volleyball: "images/312194a00efd21995220186be30881c7.jpg",
     Basketball: "images/cc6cfa5f52b466699e183feec1f7e10b.jpg",
     Netball: "images/117de40de94086e5fdc6a3e99ac0a1f1.jpg",
     Handball: "images/1ac044695d69655009bb64f20d88b73f.jpg"
   };
   
   // Default demo fixtures — replace/edit via the Management panel.
   const defaultFixtures = [
     { id: 1, sport: "Soccer", homeTeam: "Dzivarasekwa 2 High School", awayTeam: "Warren Park 1 High School (Demo)", date: "25 September 2026", time: "09:00", venue: "Warren Park 1 Sports Ground (Demo)", status: "Upcoming", result: null },
     { id: 2, sport: "Soccer", homeTeam: "Dzivarasekwa 2 High School", awayTeam: "Mabelreign High School (Demo)", date: "25 September 2026", time: "14:00", venue: "D2HS Grounds", status: "Upcoming", result: null },
     { id: 3, sport: "Netball", homeTeam: "Dzivarasekwa 2 High School", awayTeam: "Warren Park 2 High School (Demo)", date: "25 September 2026", time: "09:30", venue: "D2HS Netball Court", status: "Upcoming", result: null },
     { id: 4, sport: "Netball", homeTeam: "Dzivarasekwa 2 High School B", awayTeam: "Mabelreign High School (Demo)", date: "25 September 2026", time: "11:30", venue: "Marlborough High School (Demo)", status: "Upcoming", result: null },
     { id: 5, sport: "Basketball", homeTeam: "Dzivarasekwa 2 High School", awayTeam: "Mabelreign High School (Demo)", date: "25 September 2026", time: "11:00", venue: "Mabelreign High School Court (Demo)", status: "Upcoming", result: null },
     { id: 6, sport: "Basketball", homeTeam: "Dzivarasekwa 2 High School", awayTeam: "Warren Park 1 High School (Demo)", date: "25 September 2026", time: "13:30", venue: "Warren Park 1 Sports Ground (Demo)", status: "Upcoming", result: null },
     { id: 7, sport: "Volleyball", homeTeam: "Dzivarasekwa 2 High School", awayTeam: "Kambuzuma High School (Demo)", date: "25 September 2026", time: "10:30", venue: "Kambuzuma High School Court (Demo)", status: "Upcoming", result: null },
     { id: 8, sport: "Volleyball", homeTeam: "Dzivarasekwa 2 High School", awayTeam: "Mabelreign High School (Demo)", date: "25 September 2026", time: "15:00", venue: "D2HS Grounds", status: "Upcoming", result: null },
     { id: 9, sport: "Handball", homeTeam: "Dzivarasekwa 2 High School", awayTeam: "Kambuzuma High School (Demo)", date: "25 September 2026", time: "13:00", venue: "D2HS Grounds", status: "Upcoming", result: null },
     { id: 10, sport: "Handball", homeTeam: "Dzivarasekwa 2 High School", awayTeam: "Mabelreign High School (Demo)", date: "25 September 2026", time: "15:30", venue: "D2HS Grounds", status: "Upcoming", result: null }
   ];
   
   const demoVenues = [
     { name: "D2HS Grounds", location: "Dzivarasekwa 2 High School (host venue)", sports: ["Soccer", "Netball", "Handball", "Volleyball"] },
     { name: "Warren Park 1 Sports Ground (Demo)", location: "Warren Park 1, Harare", sports: ["Soccer", "Basketball"] },
     { name: "Marlborough High School (Demo)", location: "Marlborough, Harare", sports: ["Netball", "Volleyball"] },
     { name: "Kambuzuma High School (Demo)", location: "Kambuzuma, Harare", sports: ["Volleyball", "Handball"] },
     { name: "Mabelreign High School (Demo)", location: "Mabelreign, Harare", sports: ["Basketball", "Handball"] }
   ];
   
   let fixtures = [];
   let currentFilter = "All";
   let currentSearch = "";
   let editingId = null;
   
   /* ---------- Storage ---------- */
   function loadFixtures() {
     const saved = localStorage.getItem(STORAGE_KEY);
     if (saved) {
       try { fixtures = JSON.parse(saved); return; } catch (e) { /* fall through */ }
     }
     fixtures = JSON.parse(JSON.stringify(defaultFixtures));
     saveFixtures();
   }
   function saveFixtures() {
     localStorage.setItem(STORAGE_KEY, JSON.stringify(fixtures));
   }
   
   /* ---------- Rendering: Dashboard ---------- */
   function renderStats() {
     const total = fixtures.length;
     const upcoming = fixtures.filter(f => f.status === "Upcoming").length;
     const completed = fixtures.filter(f => f.status === "Completed").length;
     const withResults = fixtures.filter(f => f.result && f.result.trim() !== "").length;
   
     const stats = [
       { label: "Total Sports", value: 5 },
       { label: "Total Fixtures", value: total },
       { label: "Upcoming", value: upcoming },
       { label: "Completed", value: completed },
       { label: "Results", value: withResults }
     ];
   
     document.getElementById("statsGrid").innerHTML = stats.map(s => `
       <div class="stat-card">
         <span class="stat-num">${s.value}</span>
         <span class="stat-label">${s.label}</span>
       </div>
     `).join("");
   }
   
   /* ---------- Rendering: Sport cards ---------- */
   function renderSportCards() {
     const sports = ["Soccer", "Volleyball", "Basketball", "Netball", "Handball"];
     const grid = document.getElementById("sportsGrid");
   
     grid.innerHTML = sports.map(sport => {
       const count = fixtures.filter(f => f.sport === sport).length;
       return `
         <div class="sport-card" data-sport="${sport}">
           <div class="sport-bg" style="background-image:url('${SPORT_IMAGES[sport]}');"></div>
           <div class="sport-overlay"></div>
           <div class="sport-content">
             <div class="sport-icon">${SPORT_ICONS[sport]}</div>
             <div class="sport-name">${sport}</div>
             <div class="sport-count">${count} fixture${count === 1 ? "" : "s"}</div>
             <button class="btn btn-primary btn-small" type="button">View Fixtures</button>
           </div>
         </div>
       `;
     }).join("");
   
     grid.querySelectorAll(".sport-card").forEach(card => {
       card.addEventListener("click", () => {
         const sport = card.dataset.sport;
         currentFilter = sport;
         updateFilterButtons();
         renderFixtures();
         document.getElementById("fixtures").scrollIntoView({ behavior: "smooth" });
       });
     });
   }
   
   /* ---------- Rendering: Fixtures ---------- */
   function statusClass(status) {
     if (status === "Completed") return "completed";
     if (status === "In Progress") return "in-progress";
     return "";
   }
   
   function renderFixtures() {
     const grid = document.getElementById("fixturesGrid");
     const emptyState = document.getElementById("fixturesEmpty");
   
     let list = fixtures.filter(f => currentFilter === "All" || f.sport === currentFilter);
   
     if (currentSearch.trim() !== "") {
       const q = currentSearch.toLowerCase();
       list = list.filter(f =>
         f.homeTeam.toLowerCase().includes(q) ||
         f.awayTeam.toLowerCase().includes(q) ||
         f.sport.toLowerCase().includes(q) ||
         f.venue.toLowerCase().includes(q)
       );
     }
   
     if (list.length === 0) {
       grid.innerHTML = "";
       emptyState.hidden = false;
       return;
     }
     emptyState.hidden = true;
   
     grid.innerHTML = list.map(f => `
       <div class="fixture-card status-${statusClass(f.status)}">
         <div class="fixture-sport">${SPORT_ICONS[f.sport] || ""} ${f.sport}</div>
         <div class="fixture-teams">
           <span class="team-name">${f.homeTeam}</span>
           <span class="vs">VS</span>
           <span class="team-name" style="text-align:right;">${f.awayTeam}</span>
         </div>
         <div class="fixture-meta">
           <div><strong>${f.date}</strong>Date</div>
           <div><strong>${formatTime(f.time)}</strong>Time</div>
           <div><strong>${f.venue}</strong>Venue</div>
           <div><strong>${f.result && f.result.trim() !== "" ? f.result : "No Result Yet"}</strong>Result</div>
         </div>
         <div class="fixture-footer">
           <span class="status-badge ${statusClass(f.status)}">${f.status}</span>
         </div>
       </div>
     `).join("");
   }
   
   function formatTime(t) {
     if (!t) return "TBC";
     const [h, m] = t.split(":").map(Number);
     const period = h >= 12 ? "PM" : "AM";
     const hour12 = h % 12 === 0 ? 12 : h % 12;
     return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
   }
   
   /* ---------- Rendering: Results ---------- */
   function renderResults() {
     const container = document.getElementById("resultsList");
     const withResults = fixtures.filter(f => f.result && f.result.trim() !== "");
   
     if (withResults.length === 0) {
       container.innerHTML = `
         <div class="results-empty">
           <h3>No results available yet.</h3>
           <p>Results will be published after the matches are played.</p>
         </div>
       `;
       return;
     }
   
     container.innerHTML = withResults.map(f => `
       <div class="result-row">
         <div>
           <div class="r-sport">${f.sport}</div>
           <div>${f.homeTeam} vs ${f.awayTeam}</div>
         </div>
         <div class="r-score">${f.result}</div>
       </div>
     `).join("");
   }
   
   /* ---------- Rendering: Venues ---------- */
   function renderVenues() {
     const grid = document.getElementById("venuesGrid");
     grid.innerHTML = demoVenues.map(v => `
       <div class="venue-card">
         <span class="venue-tag">Demo Venue</span>
         <h3>${v.name}</h3>
         <p class="venue-location">${v.location}</p>
         <div class="venue-sports">
           ${v.sports.map(s => `<span class="venue-sport-chip">${SPORT_ICONS[s] || ""} ${s}</span>`).join("")}
         </div>
       </div>
     `).join("");
   }
   
   /* ---------- Filters & Search ---------- */
   function updateFilterButtons() {
     document.querySelectorAll(".filter-btn").forEach(btn => {
       btn.classList.toggle("active", btn.dataset.filter === currentFilter);
     });
   }
   
   function setupFilters() {
     document.getElementById("filterBar").addEventListener("click", e => {
       const btn = e.target.closest(".filter-btn");
       if (!btn) return;
       currentFilter = btn.dataset.filter;
       updateFilterButtons();
       renderFixtures();
     });
   
     document.getElementById("searchInput").addEventListener("input", e => {
       currentSearch = e.target.value;
       renderFixtures();
     });
   }
   
   /* ---------- Countdown ---------- */
   function setupCountdown() {
     // First soccer/general kickoff — 25 September 2026, 09:00
     const target = new Date("2026-09-25T09:00:00");
   
     function tick() {
       const now = new Date();
       let diff = target - now;
       if (diff < 0) diff = 0;
   
       const days = Math.floor(diff / (1000 * 60 * 60 * 24));
       const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
       const mins = Math.floor((diff / (1000 * 60)) % 60);
       const secs = Math.floor((diff / 1000) % 60);
   
       document.getElementById("cdDays").textContent = String(days).padStart(2, "0");
       document.getElementById("cdHours").textContent = String(hours).padStart(2, "0");
       document.getElementById("cdMins").textContent = String(mins).padStart(2, "0");
       document.getElementById("cdSecs").textContent = String(secs).padStart(2, "0");
     }
   
     tick();
     setInterval(tick, 1000);
   }
   
   /* ---------- Mobile nav ---------- */
   function setupNav() {
     const btn = document.getElementById("hamburgerBtn");
     const nav = document.getElementById("mainNav");
   
     btn.addEventListener("click", () => {
       const isOpen = nav.classList.toggle("open");
       btn.setAttribute("aria-expanded", isOpen);
     });
   
     nav.querySelectorAll("a").forEach(link => {
       link.addEventListener("click", () => {
         nav.classList.remove("open");
         btn.setAttribute("aria-expanded", "false");
       });
     });
   }
   
   /* ---------- Management: Login ---------- */
   function setupLogin() {
     document.getElementById("loginBtn").addEventListener("click", () => {
       const input = prompt("Enter staff password:");
       if (input === ADMIN_PASSWORD) {
         document.getElementById("loginGate").hidden = true;
         document.getElementById("managementPanel").hidden = false;
         renderAdminTable();
       } else if (input !== null) {
         alert("Incorrect password.");
       }
     });
   
     document.getElementById("logoutBtn").addEventListener("click", () => {
       document.getElementById("loginGate").hidden = false;
       document.getElementById("managementPanel").hidden = true;
       resetForm();
     });
   }
   
   /* ---------- Management: Form ---------- */
   function resetForm() {
     editingId = null;
     document.getElementById("fixtureForm").reset();
     document.getElementById("fixtureId").value = "";
     document.getElementById("formSubmitBtn").textContent = "Add Fixture";
     document.getElementById("formCancelBtn").hidden = true;
   }
   
   function showToast(message) {
     const toast = document.getElementById("toast");
     toast.textContent = message;
     toast.hidden = false;
     clearTimeout(showToast._t);
     showToast._t = setTimeout(() => { toast.hidden = true; }, 3000);
   }
   
   function setupForm() {
     document.getElementById("fixtureForm").addEventListener("submit", e => {
       e.preventDefault();
   
       const data = {
         sport: document.getElementById("fSport").value,
         homeTeam: document.getElementById("fHome").value.trim(),
         awayTeam: document.getElementById("fAway").value.trim(),
         date: document.getElementById("fDate").value.trim(),
         time: document.getElementById("fTime").value,
         venue: document.getElementById("fVenue").value.trim(),
         status: document.getElementById("fStatus").value,
         result: document.getElementById("fResult").value.trim() || null
       };
   
       if (editingId) {
         const idx = fixtures.findIndex(f => f.id === editingId);
         if (idx > -1) fixtures[idx] = { ...fixtures[idx], ...data };
         showToast("Fixture updated successfully.");
       } else {
         const newId = fixtures.length ? Math.max(...fixtures.map(f => f.id)) + 1 : 1;
         fixtures.push({ id: newId, ...data });
         showToast("Fixture added successfully.");
       }
   
       saveFixtures();
       resetForm();
       renderAll();
     });
   
     document.getElementById("formCancelBtn").addEventListener("click", resetForm);
   }
   
   function editFixture(id) {
     const f = fixtures.find(f => f.id === id);
     if (!f) return;
     editingId = id;
     document.getElementById("fixtureId").value = f.id;
     document.getElementById("fSport").value = f.sport;
     document.getElementById("fStatus").value = f.status;
     document.getElementById("fHome").value = f.homeTeam;
     document.getElementById("fAway").value = f.awayTeam;
     document.getElementById("fDate").value = f.date;
     document.getElementById("fTime").value = f.time;
     document.getElementById("fVenue").value = f.venue;
     document.getElementById("fResult").value = f.result || "";
     document.getElementById("formSubmitBtn").textContent = "Save Changes";
     document.getElementById("formCancelBtn").hidden = false;
     document.getElementById("fixtureForm").scrollIntoView({ behavior: "smooth", block: "center" });
   }
   
   function deleteFixture(id) {
     const f = fixtures.find(f => f.id === id);
     if (!f) return;
     const confirmed = confirm(`Delete this fixture?\n\n${f.sport}: ${f.homeTeam} vs ${f.awayTeam}`);
     if (!confirmed) return;
     fixtures = fixtures.filter(f => f.id !== id);
     saveFixtures();
     showToast("Fixture deleted.");
     renderAll();
   }
   
   /* ---------- Management: Admin table ---------- */
   function renderAdminTable() {
     const body = document.getElementById("adminTableBody");
     body.innerHTML = fixtures.map(f => `
       <tr>
         <td>${SPORT_ICONS[f.sport] || ""} ${f.sport}</td>
         <td>${f.homeTeam} vs ${f.awayTeam}</td>
         <td>${f.date}<br>${formatTime(f.time)}</td>
         <td>${f.venue}</td>
         <td>${f.status}</td>
         <td>${f.result || "No Result Yet"}</td>
         <td>
           <div class="admin-actions">
             <button class="btn btn-ghost btn-small" onclick="editFixture(${f.id})">Edit</button>
             <button class="btn btn-danger btn-small" onclick="deleteFixture(${f.id})">Delete</button>
           </div>
         </td>
       </tr>
     `).join("");
   }
   
   /* ---------- Master render ---------- */
   function renderAll() {
     renderStats();
     renderSportCards();
     renderFixtures();
     renderResults();
     if (!document.getElementById("managementPanel").hidden) renderAdminTable();
   }
   
   /* ---------- Init ---------- */
   document.addEventListener("DOMContentLoaded", () => {
     loadFixtures();
     renderStats();
     renderSportCards();
     renderFixtures();
     renderResults();
     renderVenues();
     setupFilters();
     setupCountdown();
     setupNav();
     setupLogin();
     setupForm();
   });