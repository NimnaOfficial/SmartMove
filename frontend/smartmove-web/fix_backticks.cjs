const fs = require('fs');
const file = 'src/pages/passenger/bookings/MyBookings.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace escaped backticks
content = content.replace(/\\`/g, '`');
// Replace escaped dollars
content = content.replace(/\\\$/g, '$');

fs.writeFileSync(file, content);
console.log("Fixed escaped backticks");
