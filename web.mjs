// This is a placeholder file which shows how you can access functions and data defined in other files.
// It can be loaded into index.html.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.

import { getGreeting } from "./common.mjs";
import daysData from "./days.json" with { type: "json" };

const months = [ "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

const daysContainer = document.getElementById("days-container");
const selectMonth = document.getElementById("select-month");
const selectYear = document.getElementById("select-year");

window.onload = function() {
 //   document.querySelector("body").innerText = `${getGreeting()} - there are ${daysData.length} known days`;

function renderCalendar(year,month){
    daysContainer.innerHTML = "";
    // fill empties days
    const firstDay = new Date(year,month,1).getDay();
    for (let j = 1; j < firstDay ; j ++){
        const emptyDay = document.createElement("div");
        emptyDay.textContent = "  ";
        console.log(emptyDay.textContent)
        daysContainer.appendChild(emptyDay);
    }
    
    const daysOfMonth = new Date(year,month + 1, 0).getDate();
    // fill the day container
    for (let i = 1; i <= daysOfMonth ; i ++){
        const day = document.createElement("div");
        day.textContent = i;
        daysContainer.appendChild(day);
    }
}
 fillMonthSelector()
 fillYearSelector()
const today = new Date();
renderCalendar(today.getFullYear(),today.getMonth());
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
