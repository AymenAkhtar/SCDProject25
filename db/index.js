const fileDB = require('./file');
const recordUtils = require('./record');
const vaultEvents = require('../events');
const fs = require('fs');  // ADD THIS
const path = require('path');  // ADD THIS

// ===== AUTOMATIC BACKUP FUNCTION =====
function createBackup() {
  const backupsDir = './backups';
  
  // Create backups folder if doesn't exist
  if (!fs.existsSync(backupsDir)) {
    fs.mkdirSync(backupsDir);
  }
  
  // Get current date-time
  const date = new Date();
  const timestamp = date.toISOString()
    .replace(/:/g, '-')
    .replace(/\..+/, '')
    .replace('T', '_');
  
  const filename = `backup_${timestamp}.json`;
  const filepath = path.join(backupsDir, filename);
  
  // Get current vault data
  const vaultData = fileDB.readDB();
  
  // Write backup
  fs.writeFileSync(filepath, JSON.stringify(vaultData, null, 2));
  console.log(`📦 Backup created: ${filename}`);
}

function addRecord({ name, value }) {
  recordUtils.validateRecord({ name, value });
  const data = fileDB.readDB();
  const newRecord = { id: recordUtils.generateId(), name, value };
  data.push(newRecord);
  fileDB.writeDB(data);
  vaultEvents.emit('recordAdded', newRecord);
  
  createBackup();  // ADD THIS LINE
  
  return newRecord;
}

function listRecords() {
  return fileDB.readDB();
}

function updateRecord(id, newName, newValue) {
  const data = fileDB.readDB();
  const record = data.find(r => r.id === id);
  if (!record) return null;
  record.name = newName;
  record.value = newValue;
  fileDB.writeDB(data);
  vaultEvents.emit('recordUpdated', record);
  return record;
}

function deleteRecord(id) {
  let data = fileDB.readDB();
  const record = data.find(r => r.id === id);
  if (!record) return null;
  data = data.filter(r => r.id !== id);
  fileDB.writeDB(data);
  vaultEvents.emit('recordDeleted', record);
  
  createBackup();  // ADD THIS LINE
  
  return record;
}

module.exports = { addRecord, listRecords, updateRecord, deleteRecord };
