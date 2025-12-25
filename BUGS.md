# Known Bugs

This document tracks known bugs and issues that need to be addressed.

## Active Bugs

### Statistics Modal - Daily Goals Section Overlap
**Status:** Shelved
**Severity:** Medium
**Date Reported:** 2025-12-23

**Description:**
In the Statistics modal, the "Daily Goals" section title is overlapping with the stat cards in the Overview section. The text appears on top of the bottom-left card instead of appearing as a section header below the Overview cards.

**Location:**
- File: [src/components/Statistics.js](src/components/Statistics.js)
- Lines: 62-92 (Overview and Daily Goals sections)

**Attempted Fixes:**
1. Changed Daily Goals container from `statsRow` to `statsGrid` (line 83) - No effect
2. Added `marginBottom: 12` to `statsGrid` style (line 190) - No effect
3. Changed `statCard` from `flex: 1, minWidth: '47%'` to `flexBasis: '48%', flexGrow: 1` (lines 203-204) - No effect

**Current Styling:**
```javascript
statsGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 12,
  marginBottom: 12,
},
statCard: {
  backgroundColor: colors.white,
  borderRadius: 12,
  padding: 16,
  alignItems: 'center',
  justifyContent: 'center',
  flexBasis: '48%',
  flexGrow: 1,
  // ... shadow properties
}
```

**Visual Evidence:**
- Screenshot: assets/img/img3.jpeg
- Screenshot: assets/img/img4.jpeg
- Screenshot: assets/img/img5.jpeg

**Next Steps:**
- Investigate if there's an absolute positioning issue
- Check if section title needs different styling/positioning
- Consider using a different layout approach for the Overview grid
- May need to debug React Native layout engine behavior with flexWrap + gap

---

## Testing Period Bugs (Daily Usage)

### How to Report Bugs During Testing:

Copy this template for each new bug you find:

```markdown
### [Bug Title]
**Date Found:** YYYY-MM-DD
**Severity:** [Low | Medium | High | Critical]
**Status:** Active
**Device:** [Your device name]
**App Version:** 1.0.0

**Steps to Reproduce:**
1.
2.
3.

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Screenshots/Notes:**
[Any additional context]
```

### Daily Testing Bugs
<!-- Add new bugs here as you find them -->

---

## Bug Tracking

**Legend:**
- **Status:** Active | Shelved | In Progress | Fixed
- **Severity:**
  - **Low:** Minor visual issues, typos
  - **Medium:** Feature doesn't work as expected but has workaround
  - **High:** Feature broken, no workaround
  - **Critical:** App crashes or data loss
