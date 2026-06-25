---
'config-driven-form': minor
---

### New Features

- **Tabbed Multi-Step Forms**: Added ability to split large forms into multiple sequential pages. Users can add steps dynamically in the visual form builder, and end-users can navigate between steps seamlessly in the generated forms.
- **Strapi-style Conditional Logic**: Introduced an advanced logical rule engine. Fields can now be conditionally shown or hidden based on the real-time values of other fields (e.g., `is`, `isNot`, `contains`, `greater than`).
- **Advanced Theme Engine & Mode Isolation**: Added dedicated configuration panels for Light Mode and Dark Mode styling. Form Builder now correctly isolates preview themes from the host system environment to ensure accurate visual debugging.
- **New Field Types**: Added support for standard Text Areas, Date Pickers, Time Pickers, and DateTime Pickers.

### Bug Fixes

- **Visual Builder Drag-and-Drop Reliability**: Fixed issues with element positioning and mobile touch drop handling.
- **Preview Engine UI Bleeding**: Fixed CSS cascading bugs that caused unwanted dark backgrounds in the preview pane when resizing the viewport.
- **Modal Modularity**: Fixed an issue where the global properties modal would not open when the builder was switched into preview mode.
