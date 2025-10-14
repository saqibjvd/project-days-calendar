// This is a placeholder file which shows how you can access functions and data defined in other files.
// It can be loaded into index.html.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.

import { getGreeting } from "./common.mjs";
import daysData from "./days.json" with { type: "json" };

let activeMonth;
let activeYear;

const months = [ "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

const daysContainer = document.getElementById("days-container");
const selectMonth = document.getElementById("select-month");
const selectYear = document.getElementById("select-year");
const nextButton = document.getElementById("next-button");
const prevButton = document.getElementById("prev-button");
const titleCalendar = document.getElementById("calendar-title")

window.onload = function() {
    // event listeners, select and buttons
    selectMonth.addEventListener ("change", function(){
        activeMonth = parseInt(selectMonth.value,10);
        renderCalendar(activeYear,activeMonth);
    });
    selectYear.addEventListener ("change", function(){
        activeYear = parseInt(selectYear.value,10);
        renderCalendar(activeYear,activeMonth);
    });
    nextButton.addEventListener("click",nextMonthBtn);
    prevButton.addEventListener("click",prevMonthBtn);
    // fill selectors
    fillMonthSelector()
    fillYearSelector()
    // rendering
    const today = new Date();
    activeMonth = today.getMonth();
    activeYear = today.getFullYear();
    renderCalendar(activeYear,activeMonth);
}
function renderCalendar(year,month){
    // Title
    const textMonth = months[month]
    titleCalendar.textContent = `${textMonth} - ${year}`
    // Adding days
    daysContainer.innerHTML = "";
    // fill empties days
    const firstDay = new Date(year,month,1).getDay();
    for (let j = 1; j < firstDay ; j ++){
        const emptyDay = document.createElement("div");
        emptyDay.textContent = "  ";
        daysContainer.appendChild(emptyDay);
    }
    
    const daysOfMonth = new Date(year,month + 1, 0).getDate();
    // fill the day container
    for (let i = 1; i <= daysOfMonth ; i ++){
        const day = document.createElement("div");
        day.textContent = i;
        day.value = i
        daysContainer.appendChild(day);
    }
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
function fillYearSelector(){
    selectYear.innerHTML = "";

    for ( let i = 1900 ; i <= 2050 ; i++){
        const option = document.createElement("option");
        option.textContent = i;
        option.value = i;
        selectYear.appendChild(option);
    }
    const currentYear = new Date().getFullYear();
    selectYear.value = currentYear;
}

function nextMonthBtn (){
    if (activeMonth === 11){
        activeMonth = 0;
        activeYear++;
        selectYear.value = activeYear;
    }else{
        activeMonth++;
    }
    selectMonth.value = activeMonth; // add after december
    renderCalendar(activeYear,activeMonth); 
}

function prevMonthBtn (){
    if (activeMonth===0){
        activeMonth = 11;
        activeYear--;
        selectYear.value = activeYear;
    } else {
        activeMonth--;
    }
    selectMonth.value = activeMonth; // add after december
    renderCalendar(activeYear,activeMonth);
}