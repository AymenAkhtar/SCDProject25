const readline = require('readline');
const db = require('./db');
const fs = require('fs');
require('./events/logger');

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
      console.log(`\nFound ${results.length} matching record(s):`);
      results.forEach((r, index) => {
        console.log(`${index + 1}. ID: ${r.id} | Name: ${r.name} | Value: ${r.value}`);
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
      let sorted = [...records];
      
      if (field.trim() === '1') {
        sorted.sort((a, b) => {
          if (order.trim() === '1') {
            return a.name.localeCompare(b.name);
          } else {
            return b.name.localeCompare(a.name);
          }
        });
        console.log('\nSorted Records (by Name):');
      } else if (field.trim() === '2') {
        sorted.sort((a, b) => {
          if (order.trim() === '1') {
            return a.id - b.id;
          } else {
            return b.id - a.id;
          }
        });
        console.log('\nSorted Records (by Creation Date):');
      } else {
        console.log('Invalid choice.');
        menu();
        return;
      }
      
      sorted.forEach((r, index) => {
        console.log(`${index + 1}. ID: ${r.id} | Name: ${r.name} | Value: ${r.value}`);
      });
      
      menu();
    });
  });
}

// ===== FUNCTION: Export to Text File =====
function exportData() {
  const records = db.listRecords();
  const date = new Date();
  
  let content = `===========================================\n`;
  content += `        VAULT DATA EXPORT\n`;
  content += `===========================================\n`;
  content += `Export Date: ${date.toLocaleDateString()}\n`;
  content += `Export Time: ${date.toLocaleTimeString()}\n`;
  content += `Total Records: ${records.length}\n`;
  content += `File Name: export.txt\n`;
  content += `===========================================\n\n`;
  
  if (records.length === 0) {
    content += `No records to export.\n`;
  } else {
    content += `RECORDS:\n`;
    content += `-------------------------------------------\n\n`;
    
    records.forEach((record, index) => {
      content += `Record ${index + 1}:\n`;
      content += `  ID: ${record.id}\n`;
      content += `  Name: ${record.name}\n`;
      content += `  Value: ${record.value}\n`;
      content += `-------------------------------------------\n`;
    });
  }
  
  content += `\n===========================================\n`;
  content += `           END OF EXPORT\n`;
  content += `===========================================\n`;
  
  try {
    fs.writeFileSync('export.txt', content);
    console.log('✅ Data exported successfully to export.txt');
  } catch (error) {
    console.log('❌ Error exporting data:', error.message);
  }
  
  menu();
}

// ===== FUNCTION: Display Vault Statistics =====
function displayStatistics() {
  const records = db.listRecords();
  
  if (records.length === 0) {
    console.log('\n⚠️  No data available for statistics.\n');
    menu();
    return;
  }
  
  // Total records
  const totalRecords = records.length;
  
  // Last modified - vault.json file modification time
  let lastModified = 'N/A';
  try {
    const stats = fs.statSync('./data/vault.json');
    lastModified = new Date(stats.mtime).toLocaleString();
  } catch (err) {
    lastModified = new Date().toLocaleString();
  }
  
  // Find longest name
  let longestName = records[0].name;
  records.forEach(record => {
    if (record.name.length > longestName.length) {
      longestName = record.name;
    }
  });
  
  // Earliest and latest records (by ID which is timestamp)
  const ids = records.map(r => r.id);
  const earliestId = Math.min(...ids);
  const latestId = Math.max(...ids);
  
  const earliestDate = new Date(earliestId).toLocaleDateString();
  const latestDate = new Date(latestId).toLocaleDateString();
  
  // Display statistics
  console.log('\n========================================');
  console.log('           VAULT STATISTICS');
  console.log('========================================');
  console.log(`Total Records: ${totalRecords}`);
  console.log(`Last Modified: ${lastModified}`);
  console.log(`Longest Name: ${longestName} (${longestName.length} characters)`);
  console.log(`Earliest Record: ${earliestDate}`);
  console.log(`Latest Record: ${latestDate}`);
  console.log('========================================\n');
  
  menu();
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
7. Export Data
8. View Vault Statistics
9. Exit
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
        else records.forEach(r => console.log(`ID: ${r.id} | Name: ${r.name} | Value: ${r.value}`));
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
      case '5':  // Search
        searchRecords();
        break;
      case '6':  // Sort
        sortRecords();
        break;
      case '7':  // Export
        exportData();
        break;
      case '8':  // Statistics - NEW
        displayStatistics();
        break;
      case '9':  // Exit - CHANGED
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
