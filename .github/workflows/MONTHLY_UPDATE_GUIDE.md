# Monthly Data Update Guide

## Overview

The dashboard pulls from CSV files in the `/data/` folder. To add a new month's
data, you edit **two CSV files** and optionally add new old-case-register files.
No code changes are needed. The dashboard rebuilds automatically when you push
to GitHub.

---

## Step 1 — Update `monthly_inflow_outflow.csv`

Open `data/monthly_inflow_outflow.csv` and add one row per court for the new
month. The month format is `YYYY-MM` (e.g. `2026-03` for March 2026).

```
court_code,court_name,month,pending_start,filed,resolved,pending_end
NOS,Nari O Shishu Nirjatan Daman Tribunal,2026-03,679,0,18,661
CMM,Chief Metropolitan Magistrate Court,2026-03,340,0,15,325
ACMM,Additional Chief Metropolitan Magistrate Court,2026-03,381,35,28,388
```

**Where to get the numbers:**
- Take them directly from Sheet 1 of the monthly Excel report
- `pending_start` = "# of Cases Pending at the Beginning"
- `filed`         = "# of Cases Filed"
- `resolved`      = "# of Cases Resolved"
- `pending_end`   = "# of Cases Pending at the End"

---

## Step 2 — Update `monthly_5plus_summary.csv`

Open `data/monthly_5plus_summary.csv` and add one row per court.

```
court_code,court_name,month,pending_5plus_sep25,disposal_cumulative_sep25,disposal_this_month,total_disposal_from_sep25,pending_5plus_end
NOS,Nari O Shishu Nirjatan Daman Tribunal,2026-03,10,0,1,2,9
CMM,Chief Metropolitan Magistrate Court,2026-03,31,0,3,12,26
ACMM,Additional Chief Metropolitan Magistrate Court,2026-03,5,0,0,1,5
```

**Note:** `pending_5plus_sep25` stays the same every month (it's the September
2025 baseline). Only `disposal_this_month`, `total_disposal_from_sep25`, and
`pending_5plus_end` change.

---

## Step 3 — Add individual case disposals (if any)

If cases from the 5+ year list were disposed this month, add rows to
`data/monthly_5plus_disposals.csv`:

```
month,sl,case_no,court_code,sections,date_disposal,mode_of_disposal,paralegal_support
2026-03,4,Gr-123/18 Sadar,CMM,406/420 PC,2026-03-15,Convicted — sentenced,Y
```

If no disposals this month, skip this step.

---

## Step 4 — Commit and push

```bash
git add data/
git commit -m "Add March 2026 monthly data"
git push
```

GitHub Actions will automatically run `npm run build` and deploy the updated
dashboard to GitHub Pages within ~2 minutes.

---

## Adding a new court to the monthly tracking

If a new court starts appearing in the monthly Excel reports, add it to the
`monthly_inflow_outflow.csv` rows going forward. You'll also want to add a
baseline entry to `monthly_5plus_summary.csv` using the first month it appears.

---

## Adding old-case-register data for a new court

1. Put the Excel file in the project root temporarily
2. Run the extraction script: `python3 scripts/extract_register.py <filename.xlsx>`
3. The script appends new rows to `data/cases_raw.csv` and updates
   `data/pending_by_age.csv`, `data/pending_by_type.csv`, and `data/court_metrics.csv`
4. Commit and push

---

## Checking your data before pushing

Run locally:
```bash
npm run generate-data
```

This validates all CSV files and prints warnings for any missing columns or
files. Fix any issues before pushing.

---

## File reference

| File | Updated | Frequency |
|------|---------|-----------|
| `monthly_inflow_outflow.csv`  | Monthly — append new rows | Each month |
| `monthly_5plus_summary.csv`   | Monthly — append new rows | Each month |
| `monthly_5plus_disposals.csv` | Monthly — append if needed | When cases disposed |
| `district_pending_overview.csv` | When quarterly report arrives | Quarterly |
| `cases_raw.csv`               | When new register data collected | As available |
| `court_metrics.csv`           | Auto-generated from cases_raw | Don't edit manually |
| `nos_offence_types.csv`       | When NOS analysis updated | As available |
| `nos_barriers.csv`            | When NOS analysis updated | As available |
| `nos_notable_cases.csv`       | When NOS analysis updated | As available |
