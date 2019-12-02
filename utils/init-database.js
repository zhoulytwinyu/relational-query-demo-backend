#!/usr/bin/env node
const sqlite3 = require('sqlite-async');
const {FILE_NAME} = require('../config/database');

const PERSON_COLLECTION = [
  {ID:0,NAME:"Andre Mills"},
  {ID:1,NAME:"Ted Barber"},
  {ID:2,NAME:"Marcia Bailey"},
  {ID:3,NAME:"Malcolm Poole"},
  {ID:4,NAME:"Leland Jefferson"},
  {ID:5,NAME:"Fredrick Reese"},
  {ID:6,NAME:"Gail Terry"},
  {ID:7,NAME:"Claude Rivera"},
  {ID:8,NAME:"Preston Wheeler"},
  {ID:9,NAME:"Dominic Malone"},
  {ID:10,NAME:"Randolph Arnold"},
  {ID:11,NAME:"Emily Walters"},
  {ID:12,NAME:"Lynette Ruiz"},
  {ID:13,NAME:"Edgar Ray"},
  {ID:14,NAME:"Samuel Cannon"},
  {ID:15,NAME:"Lee Holloway"},
  {ID:16,NAME:"Rosemary Osborne"},
  {ID:17,NAME:"Faye Jefferson"},
  {ID:18,NAME:"Courtney Brock"},
  {ID:19,NAME:"Chelsea Murray"}
];

const BED_COLLECTION = [
  {ID:0,NAME:"A"},
  {ID:1,NAME:"B"},
  {ID:2,NAME:"C"},
  {ID:3,NAME:"D"},
  {ID:4,NAME:"E"},
];

const MAX_DAY = 99;

function getPatientBedAssignmentCollection(){
  let patientBedAssignmentCollection = [];
  let patient_many = PERSON_COLLECTION.slice(0,15);
  let ID = -1;
  for (let bed of BED_COLLECTION) {
    let END_DAY = -1;
    let BED_ID = bed.ID;
    while (END_DAY < MAX_DAY) {
      let START_DAY = END_DAY+1;
      ID += 1;
      let lengthOfStay = 1+Math.floor(Math.random()*30);
      END_DAY = Math.min(MAX_DAY,START_DAY+lengthOfStay-1);
      let personIdx = Math.floor(Math.random()*patient_many.length);
      let person = patient_many[personIdx];
      let PERSON_ID = person.ID;
      patientBedAssignmentCollection.push({
        ID,
        START_DAY,
        END_DAY,
        BED_ID,
        PERSON_ID
      });
      START_DAY = END_DAY;
    }
  }
  return patientBedAssignmentCollection;
}

function getPersonnelBedAssignmentCollection() {
  let personnelBedAssignmentCollection = [];
  let personnel_many = PERSON_COLLECTION.slice(15);
  let ID = -1;
  for (let bed of BED_COLLECTION) {
    let END_DAY = -1;
    let BED_ID = bed.ID;
    while (END_DAY < MAX_DAY) {
      let START_DAY = END_DAY+1;
      ID += 1;
      let lengthOfStay = 5;
      END_DAY = Math.min(MAX_DAY,START_DAY+lengthOfStay-1);
      let personIdx = Math.floor(Math.random()*personnel_many.length);
      let person = personnel_many[personIdx];
      let PERSON_ID = person.ID;
      personnelBedAssignmentCollection.push({
        ID,
        START_DAY,
        END_DAY,
        BED_ID,
        PERSON_ID
      });
    }
  }
  return personnelBedAssignmentCollection;
}

async function populatePersonTable(db){
  await db.run("DROP TABLE IF EXISTS PERSON");
  await db.run(
    "CREATE TABLE PERSON ("+
    "  ID          INTEGER PRIMARY KEY,"+
    "  NAME        TEXT"+
    ")"
  );
  let binds = [].concat(
    ...PERSON_COLLECTION.map( obj=>[obj.ID,obj.NAME] )
  );
  let bindString = PERSON_COLLECTION.map( obj=>"(?,?)" )
    .join(',');
  await db.run(
    "INSERT INTO PERSON (ID,NAME)"+
    "VALUES"+bindString,
    binds
  );
}

async function populateBedTable(db){
  await db.run("DROP TABLE IF EXISTS BED");
  await db.run(
    "CREATE TABLE BED ("+
    "  ID          INTEGER PRIMARY KEY,"+
    "  NAME        TEXT"+
    ")"
  );
  let binds = [].concat(
    ...BED_COLLECTION.map( obj=>[obj.ID,obj.NAME] )
  );
  let bindString = BED_COLLECTION.map( obj=>"(?,?)" )
    .join(',');
  await db.run(
    "INSERT INTO BED (ID,NAME)"+
    "VALUES"+bindString,
    binds
  );
}

async function populatePatientBedAssignmentTable(db){
  let patientBedAssignmentCollection = getPatientBedAssignmentCollection();
  await db.run("DROP TABLE IF EXISTS PATIENT_BED_ASSIGNMENT");
  await db.run(
    "CREATE TABLE PATIENT_BED_ASSIGNMENT ("+
    "  ID          INTEGER PRIMARY KEY,"+
    "  START_DAY   INTEGER,"+
    "  END_DAY     INTEGER,"+
    "  BED_ID      INTEGER,"+
    "  PERSON_ID   INTEGER,"+
    "  FOREIGN KEY(BED_ID) REFERENCES BED(ID),"+
    "  FOREIGN KEY(PERSON_ID) REFERENCES PERSON(ID)"+
    ")"
  );
  let binds = [].concat(
    ...patientBedAssignmentCollection.map( obj=>[obj.ID,obj.START_DAY,obj.END_DAY,obj.BED_ID,obj.PERSON_ID] )
  );
  let bindString = patientBedAssignmentCollection.map( obj=>"(?,?,?,?,?)" )
    .join(',');
  await db.run(
    "INSERT INTO PATIENT_BED_ASSIGNMENT (ID,START_DAY,END_DAY,BED_ID,PERSON_ID)"+
    "VALUES "+bindString,
    binds
  );
}

async function populatePersonnelBedAssignmentTable(db){
  let personnelBedAssignmentCollection = getPersonnelBedAssignmentCollection();
  await db.run("DROP TABLE IF EXISTS PERSONNEL_BED_ASSIGNMENT");
  await db.run(
    "CREATE TABLE PERSONNEL_BED_ASSIGNMENT ("+
    "  ID          INTEGER PRIMARY KEY,"+
    "  START_DAY   INTEGER,"+
    "  END_DAY     INTEGER,"+
    "  BED_ID      INTEGER,"+
    "  PERSON_ID   INTEGER,"+
    "  FOREIGN KEY(BED_ID) REFERENCES BED(ID),"+
    "  FOREIGN KEY(PERSON_ID) REFERENCES PERSON(ID)"+
    ")"
  );
  let binds = [].concat(
    ...personnelBedAssignmentCollection.map( obj=>[obj.ID,obj.START_DAY,obj.END_DAY,obj.BED_ID,obj.PERSON_ID] )
  );
  let bindString = personnelBedAssignmentCollection.map( obj=>"(?,?,?,?,?)" )
    .join(',');
  await db.run(
    "INSERT INTO PERSONNEL_BED_ASSIGNMENT (ID,START_DAY,END_DAY,BED_ID,PERSON_ID)"+
    "VALUES "+bindString,
    binds
  );
}

async function initDatabase() {
  let db = await sqlite3.open(FILE_NAME);
  await populatePersonTable(db);
  await populateBedTable(db);
  await populatePatientBedAssignmentTable(db);
  await populatePersonnelBedAssignmentTable(db);
}

initDatabase();
