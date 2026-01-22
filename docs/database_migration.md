# Database Migration: Update CS and CI Persona Codes

This document contains SQL queries to update existing assessment sessions that have `CS` or `CI` persona codes to their canonical forms (`SC` and `IC` respectively).

## Background

The PersonaResolver now normalizes equivalent persona codes to canonical forms:
- `CS` → `SC` (Steady Technician)
- `CI` → `IC` (Imaginative Planner)
- `DC` → `CD` (Attacking Analyst)

Existing database records with `CS` or `CI` codes need to be updated to match the canonical forms.

## Persona Details

### SC (Steady Technician)
- **Name:** Steady Technician
- **Example Pro (Male):** Jim Furyk
- **Example Pro (Female):** Inbee Park

### IC (Imaginative Planner)
- **Name:** Imaginative Planner
- **Example Pro (Male):** Phil Mickelson
- **Example Pro (Female):** Lydia Ko

## SQL Queries

### Update CS to SC

```sql
UPDATE assessment_sessions
SET 
  persona_code = 'SC',
  persona_name = 'Steady Technician',
  example_pro_male = 'Jim Furyk',
  example_pro_female = 'Inbee Park',
  display_example_pro = CASE 
    WHEN gender = 'male' THEN 'Jim Furyk'
    WHEN gender = 'female' THEN 'Inbee Park'
    ELSE 'Jim Furyk'
  END
WHERE persona_code = 'CS';
```

### Update CI to IC

```sql
UPDATE assessment_sessions
SET 
  persona_code = 'IC',
  persona_name = 'Imaginative Planner',
  example_pro_male = 'Phil Mickelson',
  example_pro_female = 'Lydia Ko',
  display_example_pro = CASE 
    WHEN gender = 'male' THEN 'Phil Mickelson'
    WHEN gender = 'female' THEN 'Lydia Ko'
    ELSE 'Phil Mickelson'
  END
WHERE persona_code = 'CI';
```

### Optional: Update DC to CD (if any exist)

```sql
UPDATE assessment_sessions
SET 
  persona_code = 'CD',
  persona_name = 'Attacking Analyst',
  example_pro_male = 'Jon Rahm',
  example_pro_female = 'Lorena Ochoa',
  display_example_pro = CASE 
    WHEN gender = 'male' THEN 'Jon Rahm'
    WHEN gender = 'female' THEN 'Lorena Ochoa'
    ELSE 'Jon Rahm'
  END
WHERE persona_code = 'DC';
```

## Verification Queries

### Check for CS records
```sql
SELECT id, persona_code, persona_name, gender, display_example_pro
FROM assessment_sessions
WHERE persona_code = 'CS';
```

### Check for CI records
```sql
SELECT id, persona_code, persona_name, gender, display_example_pro
FROM assessment_sessions
WHERE persona_code = 'CI';
```

### Check for DC records
```sql
SELECT id, persona_code, persona_name, gender, display_example_pro
FROM assessment_sessions
WHERE persona_code = 'DC';
```

### Verify all records use canonical forms
```sql
SELECT persona_code, COUNT(*) as count
FROM assessment_sessions
WHERE persona_code IN ('CS', 'CI', 'DC')
GROUP BY persona_code;
```

This query should return 0 rows after the migration is complete.

## Notes

- Only 4 records are expected to need updating
- The `display_example_pro` field is set based on the `gender` field
- All updates preserve the original assessment data, only the persona-related fields are changed
