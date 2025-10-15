const ical = require('ical');
const fs = require('fs');

// Parse the .ics file
const data = ical.parseFile('commemorative-days.ics');

const events = [];

for (let k in data) {
  if (data.hasOwnProperty(k)) {
    const ev = data[k];
    if (ev.type === 'VEVENT') {
      events.push({
        summary: ev.summary || '',
        description: ev.description || '',
        start: ev.start ? ev.start.toISOString() : null,
        end: ev.end ? ev.end.toISOString() : null
      });
    }
  }
}

// Write JSON to file
fs.writeFileSync('commemorative-days.json', JSON.stringify(events, null, 2));

console.log('ICS file converted to JSON successfully.');
