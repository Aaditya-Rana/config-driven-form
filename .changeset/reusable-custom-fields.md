---
'config-driven-form': minor
---

### ✨ Reusable Custom Fields

The Drag-and-Drop Form Builder now fully supports saving, creating, and managing Reusable Custom Fields. This allows users to build a repository of shared fields (like country dropdowns, standardized address blocks, etc.) that can be reused across different forms without reconfiguring them every time.

- **Create Custom Fields:** Added a `+` icon in the Toolbox to create entirely new custom fields from scratch.
- **Save as Reusable:** Added a "Save as Reusable" button in the field Properties Panel to save a configured field to the toolbox.
- **Edit & Delete:** Manage your custom fields directly from the Toolbox with inline Edit and Delete actions.
- **Controlled Integration:** New `customFields` and `onCustomFieldsChange` props allow host applications to sync custom field data directly with their database.
- **Cleaner Keys:** Newly dropped fields now generate clean, Strapi-like alphanumeric keys (e.g. `text_a7b2`) instead of long timestamps.
