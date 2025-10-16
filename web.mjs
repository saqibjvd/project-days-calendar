

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
  // Title
  const textMonth = months[month];
  titleCalendar.textContent = `${textMonth} - ${year}`;
  // Adding days
  daysContainer.innerHTML = "";
  // fill empties days
  const firstDay = new Date(year, month, 1).getDay();

//   const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;

  for (let j = 1; j < firstDay; j++) {
    const emptyDay = document.createElement("div");
    emptyDay.textContent = "  ";
    daysContainer.appendChild(emptyDay);
  }

  const daysOfMonth = getDaysInMonth(year,month);
  // fill the day container
  for (let i = 1; i <= daysOfMonth; i++) {
    const day = document.createElement("div");
    day.textContent = i;
    day.value = i;

    // Create YYYY-MM-DD string for comparison *
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      i
    ).padStart(2, "0")}`;

    // Check if this day matches any commemorative event
    const event = commemorativeDays.find((e) => {
      if (!e.start) return false;
      return e.start.startsWith(dateStr);
    });

    if (event) {
      day.classList.add("commemorative-day");
      day.title = `${event.summary}\n${event.description || ""}`; //*
    }
    daysContainer.appendChild(day);
    renderEventList(year, month);

  }
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
      const date = new Date(event.start);
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
