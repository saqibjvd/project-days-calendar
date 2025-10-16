

 import { getDaysInMonth } from "./common.mjs";
//  import daysData from "./days.json" with { type: "json" };

import commemorativeDays from "./commemorative-days.json" with { type: "json" };

let activeMonth;
let activeYear;

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const daysContainer = document.getElementById("days-container");
const selectMonth = document.getElementById("select-month");
const selectYear = document.getElementById("select-year");
const nextButton = document.getElementById("next-button");
const prevButton = document.getElementById("prev-button");
const titleCalendar = document.getElementById("calendar-title");

window.onload = function () {
  // event listeners, select and buttons
  selectMonth.addEventListener("change", function () {
    activeMonth = parseInt(selectMonth.value, 10);
    renderCalendar(activeYear, activeMonth);
  });

  selectYear.addEventListener("change", function () {
    activeYear = parseInt(selectYear.value, 10);
    renderCalendar(activeYear, activeMonth);
  });

  nextButton.addEventListener("click", nextMonthBtn);
  prevButton.addEventListener("click", prevMonthBtn);
  // fill selectors
  fillMonthSelector();
  fillYearSelector();

  // rendering
  const today = new Date();
  activeMonth = today.getMonth();
  activeYear = today.getFullYear();

  renderCalendar(activeYear, activeMonth);
};

console.log("Loaded commemorativeDays:", commemorativeDays);


function renderCalendar(year, month) {
  // Title (assumes months[] array exists and titleCalendar is a DOM node)
  const textMonth = months[month];
  titleCalendar.textContent = `${textMonth} - ${year}`;

  // Clear old days
  daysContainer.innerHTML = "";
  // Ensure daysContainer is role=rowgroup (outer wrapper should be role=grid)
  daysContainer.setAttribute("role", "rowgroup");

  // Get first day of month (0 = Sunday, 1 = Monday, ... 6 = Saturday)
  const jsFirstDay = new Date(year, month, 1).getDay();
  // Convert to Monday-first index: 0 = Monday, ... 6 = Sunday
  const firstDay = (jsFirstDay + 6) % 7;

  // Total days in month
  const daysOfMonth = getDaysInMonth(year,month);

  // Create the first week row
  let weekRow = document.createElement("div");
  weekRow.setAttribute("role", "row");

  // 1) Fill empty slots before the 1st (firstDay blanks)
  for (let j = 0; j < firstDay; j++) {
    const emptyDay = document.createElement("div");
    emptyDay.textContent = ""; // visually empty
    emptyDay.setAttribute("role", "gridcell");
    emptyDay.setAttribute("aria-label", "Empty day");
    // optional: mark as other-month for styling
    emptyDay.classList.add("other-month");
    weekRow.appendChild(emptyDay);
  }

  // 2) Fill real days
  for (let i = 1; i <= daysOfMonth; i++) {
    const day = document.createElement("div");
    day.textContent = i;
    day.value = i;
    day.setAttribute("role", "gridcell");
    day.setAttribute("aria-label", `Day ${i} ${months[month]} ${year}`);
    day.tabIndex = 0; // keyboard focusable

    // Attach event marker if any commemorative day matches YYYY-MM-DD
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
    const event = commemorativeDays.find((e) => e.start && e.start.startsWith(dateStr));
    if (event) {
      day.classList.add("commemorative-day");
      day.title = `${event.summary}\n${event.description || ""}`;
    }

    weekRow.appendChild(day);

    // Determine weekday for the current date, in Monday-first indexing
    const jsDay = new Date(year, month, i).getDay();
    const isoDay = (jsDay + 6) % 7; // 0=Mon ... 6=Sun

    // If this is the end of the week (Sunday in Monday-first scheme) OR the last day of month,
    // close the row and append it to daysContainer.
    if (isoDay === 6 || i === daysOfMonth) {
      daysContainer.appendChild(weekRow);
      // start a fresh week row for the next iteration
      weekRow = document.createElement("div");
      weekRow.setAttribute("role", "row");
    }
  }

  // 3) After rendering all days, update the event list (once)
  renderEventList(year, month);
}

function renderEventList(year, month) {
    const eventList = document.getElementById("event-items");
    eventList.innerHTML = ""; // Clear previous
  
    // Filter events that are in this month/year
    const filteredEvents = commemorativeDays.filter(e => {
      if (!e.start) return false;
      const eventDate = new Date(e.start);
      return eventDate.getFullYear() === year && eventDate.getMonth() === month;
    });
  
    if (filteredEvents.length === 0) {
      const li = document.createElement("li");
      li.textContent = "No commemorative events this month.";
      eventList.appendChild(li);
      return;
    }
  
    // Display each event
    filteredEvents.forEach(event => {
      const li = document.createElement("li");
      const date = new Date(event.start.split("T")[0])
      const formattedDate = date.toDateString(); // e.g., "Tue Oct 14 2025"
  
      li.innerHTML = `<strong>${formattedDate}</strong>: ${event.summary}`;
      if (event.description) {
        li.innerHTML += `<br><em>${event.description}</em>`;
      }
  
      eventList.appendChild(li);
    });
  }
  
function fillMonthSelector() {
  selectMonth.innerHTML = "";

  months.forEach((month, index) => {
    const option = document.createElement("option");
    option.textContent = month;
    option.value = index;
    selectMonth.appendChild(option);
  });
  const currentMonth = new Date().getMonth();
  selectMonth.value = currentMonth;
}

function fillYearSelector() {
  selectYear.innerHTML = "";

  for (let i = 1900; i <= 2050; i++) {
    const option = document.createElement("option");
    option.textContent = i;
    option.value = i;
    selectYear.appendChild(option);
  }
  const currentYear = new Date().getFullYear();
  selectYear.value = currentYear;
}

function nextMonthBtn() {
  if (activeMonth === 11 && activeYear === 2050) {
    alert("Limit reached!");
    return;
  }
  if (activeMonth === 11) {
    activeMonth = 0;
    activeYear++;
    selectYear.value = activeYear;
  } else {
    activeMonth++;
  }
  selectMonth.value = activeMonth; // add after december
  renderCalendar(activeYear, activeMonth);
}

function prevMonthBtn() {
  if (activeMonth === 0 && activeYear === 1900) {
    alert("Limit reached!");
    return;
  }
  if (activeMonth === 0) {
    activeMonth = 11;
    activeYear--;
    selectYear.value = activeYear;
  } else {
    activeMonth--;
  }
  selectMonth.value = activeMonth; // add after december
  renderCalendar(activeYear, activeMonth);
}
