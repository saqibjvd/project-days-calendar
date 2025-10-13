import fs from 'fs';

// Function to get the weekday index (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
const getWeekdayIndex = (weekday) => {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return daysOfWeek.indexOf(weekday);
};

// Function to calculate the nth occurrence of a specific weekday in a given month
const calculateOccurrenceDate = (month, weekday, occurrence, year) => {
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday
  const weekdayIndex = getWeekdayIndex(weekday);

  let firstOccurrenceDay = 1 + ((7 + weekdayIndex - firstDayOfMonth) % 7);

  let offset = {
    "first": 0,
    "second": 7,
    "third": 14,
    "fourth": 21
  };

  if (occurrence in offset) {
    return new Date(year, month, firstOccurrenceDay + offset[occurrence]);
  }

  if (occurrence === "last") {
    let lastDay = new Date(year, month + 1, 0).getDate();
    for (let i = lastDay; i > 0; i--) {
      let day = new Date(year, month, i).getDay();
      if (day === weekdayIndex) {
        return new Date(year, month, i);
      }
    }
  }

  return null;
};

// Load the JSON file
const rawData = fs.readFileSync('days.json', 'utf8');
const days = JSON.parse(rawData); 

// Function to generate iCal format
function generateIcal(events) {
  let ical = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//YourCompany//NONSGML v1.0//EN\r\n';

  for (let year = 2020; year <= 2030; year++) {
    events.forEach(event => {
      const { name, monthName, dayName, occurence, descriptionURL } = event;  // Note: 'occurence' spelling from your JSON
      
      const monthIndex = new Date(`${monthName} 1, 2000`).getMonth();
      const date = calculateOccurrenceDate(monthIndex, dayName, occurence.toLowerCase(), year);

      if (!date || isNaN(date.getTime())) {
        console.error(`Invalid date for ${name}: ${monthName} ${occurence} ${dayName} ${year}`);
        return;
      }

      const startDate = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;

      const uid = `${name.replace(/\s+/g, '')}-${year}@yourdomain.com`;
      const dtstamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

      ical += `BEGIN:VEVENT\r\n`;
      ical += `UID:${uid}\r\n`;
      ical += `DTSTAMP:${dtstamp}\r\n`;
      ical += `DTSTART;VALUE=DATE:${startDate}\r\n`;
      ical += `SUMMARY:${name} (${year})\r\n`;
      ical += `DESCRIPTION:${descriptionURL}\r\n`;
      ical += `END:VEVENT\r\n`;
    });
  }

  ical += 'END:VCALENDAR\r\n';
  return ical;
}

const icalContent = generateIcal(days);

fs.writeFileSync('commemorative-days.ics', icalContent, 'utf8');
console.log('iCal file generated: commemorative-days.ics');
