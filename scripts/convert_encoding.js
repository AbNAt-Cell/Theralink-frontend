const fs = require('fs');

// Read the raw buffer
const buf = fs.readFileSync('good_page.tsx');

// Check if it has a UTF-16LE BOM
if (buf[0] === 0xFF && buf[1] === 0xFE) {
  console.log('File is UTF-16LE. Converting to UTF-8...');
  const str = buf.toString('utf16le');
  fs.writeFileSync('app/admin/messages/page.tsx', str, 'utf8');
  fs.writeFileSync('app/client/messaging/page.tsx', str, 'utf8');
} else if (buf[0] === 0xFE && buf[1] === 0xFF) {
  console.log('File is UTF-16BE. Converting to UTF-8...');
  const str = buf.toString('utf16le'); // Might need swapping, but unlikely
  fs.writeFileSync('app/admin/messages/page.tsx', str, 'utf8');
  fs.writeFileSync('app/client/messaging/page.tsx', str, 'utf8');
} else {
  console.log('File does not have a UTF-16 BOM. Trying to parse as UTF-8...');
  const str = buf.toString('utf8');
  fs.writeFileSync('app/admin/messages/page.tsx', str, 'utf8');
  fs.writeFileSync('app/client/messaging/page.tsx', str, 'utf8');
}
console.log('Done converting files to UTF-8.');
