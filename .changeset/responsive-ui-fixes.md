---
'config-driven-form': patch
---

### 🌟 Massive Visual Form Builder Update (v1.4.1)

This release ships major UI/UX improvements, mobile responsiveness, and bug fixes to the Drag-and-Drop Visual Form Builder, allowing users to build complex forms natively on smartphones and tablets.

**Mobile & Responsive Features**

- **Mobile-First Builder UI**: The builder canvas now fluidly adapts to small screens. The field Toolbox is now a horizontal scrolling carousel on mobile, preventing screen real-estate collision.
- **Touch Drag-and-Drop**: Fixed a major bug where `dnd-kit` pointer sensors intercepted touch events. Added precise distance constraints (8px tolerance) so users can seamlessly drag fields from the toolbox and rearrange them on touchscreens without accidentally triggering clicks.
- **Collapsible Layout**: Topbar settings text now intelligently hides on small devices to prevent overlapping buttons.

**Advanced Layout Grid Engine**

- **1-to-4 Column Grids**: Added native support for 1, 2, 3, or 4 column dynamic layouts via Global Settings.
- **Visual Column Spanning**: Fixed CSS specificity bugs preventing the Toggle Column Span button from working. You can now reliably click the span button or visually drag a field's edge to expand it across multiple columns.
- **Automatic Mobile Wrapping**: Regardless of your desktop column span (e.g., span 4), the grid engine will smartly collapse into a single-column stacked layout on mobile devices (`< 640px`) to preserve legibility.

**Live Typography & Sizing Engine**

- **Live Preview Classes**: The `PropertiesPanel` Design Settings (Width, Height, Font Size, Border Radius, Alignments) now instantly reflect on the builder canvas!
- **Zero-Config Preflight**: Injected essential CSS utility classes (`w-1/2`, `h-12`, `text-lg`, etc.) directly into the library's `form.css` artifact. Host applications no longer require a local TailwindCSS installation just to render basic field sizes in the builder preview.

**Fixes & Refactoring**

- Fixed `.cdf-builder-field-span` CSS loading order where baseline rules were inadvertently overriding desktop media queries.
- Prevented inline layout styles from forcing horizontal scrollbars by migrating `FieldRenderer` inline layouts to robust responsive class names.
