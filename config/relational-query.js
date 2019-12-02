module.exports = {
  SCHEMA: {
    PATIENT: {
      cte:
        '"__PATIENT" AS ( \n'+
        '  SELECT \n'+
        '    ID AS "__ID__", \n'+
        '    NAME \n'+
        '  FROM PERSON\n'+
        ')',
      id: ["__ID__"],
      attributes: {
        __ID__:null,
        NAME:null
      }
    },
    PERSONNEL: {
      cte:
        '"__PERSONNEL" AS ( \n'+
        '  SELECT \n'+
        '    ID AS "__ID__", \n'+
        '    NAME \n'+
        '  FROM PERSON\n'+
        ')',
      id: ["__ID__"],
      attributes: {
        __ID__:null,
        NAME:null
      }
    },
    BED: {
      cte:
        '"__BED" AS ( \n'+
        '  SELECT \n'+
        '    ID AS "__ID__", \n'+
        '    NAME \n'+
        '  FROM BED\n'+
        ')',
      id: ["__ID__"],
      attributes: {
        __ID__:null,
        NAME:null
      }
    },
    PATIENT_BED_ASSIGNMENT: {
      cte:
        '"__PATIENT_BED_ASSIGNMENT" AS ( \n'+
        '  SELECT \n'+
        '    ID AS "__ID__", \n'+
        '    BED_ID AS "__REF__BED", \n'+
        '    PERSON_ID AS "__REF__PATIENT", \n'+
        '    START_DAY, \n'+
        '    END_DAY \n'+
        '  FROM PATIENT_BED_ASSIGNMENT\n'+
        ')',
      id: ["__ID__"],
      references: {
        BED: [['__REF__BED'],['__ID__']],
        PATIENT: [['__REF__PATIENT'],['__ID__']]
      },
      attributes: {
        __ID__:null,
        START_DAY:null,
        END_DAY:null,
        __REF__BED:null,
        __REF__PATIENT:null
      }
    },
    PERSONNEL_BED_ASSIGNMENT: {
      cte:
        '"__PERSONNEL_BED_ASSIGNMENT" AS ( \n'+
        '  SELECT \n'+
        '    ID AS "__ID__", \n'+
        '    BED_ID AS "__REF__BED", \n'+
        '    PERSON_ID AS "__REF__PERSONNEL", \n'+
        '    START_DAY, \n'+
        '    END_DAY \n'+
        '  FROM PERSONNEL_BED_ASSIGNMENT\n'+
        ')',
      id: ["__ID__"],
      references: {
        BED: [['__REF__BED'],['__ID__']],
        PERSONNEL: [['__REF__PERSONNEL'],['__ID__']]
      },
      attributes: {
        __ID__:null,
        START_DAY:null,
        END_DAY:null,
        __REF__BED:null,
        __REF__PERSONNEL:null
      }
    }
  }
};
