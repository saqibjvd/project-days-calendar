// This is a placeholder file which shows how you can access functions and data defined in other files.
// It can be loaded into index.html.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.

import { getGreeting } from "./common.mjs";
import daysData from "./days.json" with { type: "json" };

const months = [ "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

window.onload = function() {
 //   document.querySelector("body").innerText = `${getGreeting()} - there are ${daysData.length} known days`;
const daysContainer = document.getElementById("days-container");

function renderCalendar(year,month){
    daysContainer.innerHTML = "";
 // call function that switch days from months
    for (let i = 1; i <= 30 ; i ++){
        const day = document.createElement("div");
        day.textContent = i;
        daysContainer.appendChild(day);
    }
}
 fillMonthSelector()
//fillYearSelector()
const today = new Date();
renderCalendar(today.getFullYear(),today.getMonth());
}

function fillMonthSelector() {
    const selectMonth = document.getElementById("select-month");
    selectMonth.innerHTML = "";

  months.forEach((month, index) => {
    const option = document.createElement("option");
    option.textContent = month;
    option.value = index;
    selectMonth.appendChild(option);
  });
}
