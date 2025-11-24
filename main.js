const readline = require('readline');
const db = require('./db');
require('./events/logger'); // Initialize event logger

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ===== FUNCTION: Search Functionality =====
function searchRecords() {
  rl.question('Enter search keyword: ', keyword => {
    const records = db.listRecords();
    const results = records.filter(r => 
      r.name.toLowerCase().includes(keyword.toLowerCase()) ||
      r.id.toString().includes(keyword)
    );
    
    if (results.length === 0) {
      console.log('No records found.');
    } else {
      console.log(`\nFound ${results.length} matching record(s):`);  // FIXED
      results.forEach((r, index) => {
        console.log(`${index + 1}. ID: ${r.id} | Name: ${r.name} | Value: ${r.value}`);  // FIXED
      });
    }
    menu();
  });
}

// ===== FUNCTION: Sorting Capability =====
function sortRecords() {
  const records = db.listRecords();
  
  if (records.length === 0) {
    console.log('No records to sort.');
    menu();
    return;
  }
  
  console.log('\nSort by:');
  console.log('1. Name');
  console.log('2. Creation Date (ID)');
  
  rl.question('Choose field: ', field => {
    console.log('\nOrder:');
    console.log('1. Ascending');
    console.log('2. Descending');
    
    rl.question('Choose order: ', order => {
      let sorted = [...records]; // Copy array
      
      if (field.trim() === '1') {
        // Sort by name
        sorted.sort((a, b) => {
          if (order.trim() === '1') {
            return a.name.localeCompare(b.name); // Ascending
          } else {
            return b.name.localeCompare(a.name); // Descending
          }
        });
        console.log('\nSorted Records (by Name):');
      } else if (field.trim() === '2') {
        // Sort by ID (represents creation date)
        sorted.sort((a, b) => {
          if (order.trim() === '1') {
            return a.id - b.id; // Ascending (oldest first)
          } else {
            return b.id - a.id; // Descending (newest first)
          }
        });
        console.log('\nSorted Records (by Creation Date):');
      } else {
        console.log('Invalid choice.');
        menu();
        return;
      }
      
      // Display sorted records
      sorted.forEach((r, index) => {
        console.log(`${index + 1}. ID: ${r.id} | Name: ${r.name} | Value: ${r.value}`);
      });
      
      menu();
    });
  });
}

function menu() {
  console.log(`
===== NodeVault =====
1. Add Record
2. List Records
3. Update Record
4. Delete Record
5. Search Records
6. Sort Records
7. Exit
=====================
  `);
  rl.question('Choose option: ', ans => {
    switch (ans.trim()) {
      case '1':
        rl.question('Enter name: ', name => {
          rl.question('Enter value: ', value => {
            db.addRecord({ name, value });
            console.log('✅ Record added successfully!');
            menu();
          });
        });
        break;
      case '2':
        const records = db.listRecords();
        if (records.length === 0) console.log('No records found.');
        else records.forEach(r => console.log(`ID: ${r.id} | Name: ${r.name} | Value: ${r.value}`));  // FIXED
        menu();
        break;
      case '3':
        rl.question('Enter record ID to update: ', id => {
          rl.question('New name: ', name => {
            rl.question('New value: ', value => {
              const updated = db.updateRecord(Number(id), name, value);
              console.log(updated ? '✅ Record updated!' : '❌ Record not found.');
              menu();
            });
          });
        });
        break;
      case '4':
        rl.question('Enter record ID to delete: ', id => {
          const deleted = db.deleteRecord(Number(id));
          console.log(deleted ? '🗑️ Record deleted!' : '❌ Record not found.');
          menu();
        });
        break;
      case '5':  // Search functionality
        searchRecords();
        break;
      case '6':  // Sort functionality - NEW
        sortRecords();
        break;
      case '7':  // Exit - CHANGED from 6 to 7
        console.log('👋 Exiting NodeVault...');
        rl.close();
        break;
      default:
        console.log('Invalid option.');
        menu();
    }
  });
}

menu();
