const fs = require('fs');

function fixFile(file) {
  try {
    const buf = fs.readFileSync(file);
    let str;
    
    // Check if there is a UTF-16 BOM
    if (buf[0] === 0xFF && buf[1] === 0xFE) {
      str = buf.toString('utf16le');
    } else {
      // Just read as UTF-8. Node will automatically replace invalid bytes with the replacement char 
      str = buf.toString('utf8');
      
      // But maybe it's completely UTF-16LE without BOM? Let's check for lots of null bytes
      const nullCount = buf.filter(b => b === 0).length;
      if (nullCount > buf.length / 3) {
        str = buf.toString('utf16le');
      }
    }
    
    // Write it back out as valid UTF-8
    fs.writeFileSync(file, str, 'utf8');
    console.log(`Fixed ${file}`);
  } catch(e) {
    console.error(`Error fixing ${file}:`, e);
  }
}

fixFile('app/client/messaging/page.tsx');
fixFile('app/admin/messages/page.tsx');
