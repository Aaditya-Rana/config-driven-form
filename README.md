# Config-Driven Form 🚀

[![npm version](https://badge.fury.io/js/config-driven-form.svg)](https://badge.fury.io/js/config-driven-form)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A highly scalable, production-ready React form library that dynamically generates beautiful, fully validated forms directly from standard **JSON Schema**.

Stop writing thousands of lines of boilerplate form code. Define your data structure in JSON, and let `config-driven-form` handle the UI, complex nested state, and validation instantly.

---

## ✨ Features

- ⚡️ **Extreme Performance:** Built on `react-hook-form` to prevent unnecessary re-renders. Handles massive forms with ease.
- 🛡️ **Bulletproof Validation:** Uses `ajv` (the fastest JSON Schema validator) to enforce strict validation rules.
- 🎨 **Beautiful by Default:** Includes a stunning, modern glassmorphic design system out of the box.
- 🏗️ **Multi-Column Layouts:** Easily build complex 2, 3, or 4-column grid layouts using the `uiSchema`.
- 🧩 **Rich Field Types:** Natively supports Text, Numbers, Passwords, Dropdowns, Radios, Checkboxes, File Uploads, and a Tiptap Rich Text Editor!

---

## 📦 Installation

```bash
npm install config-driven-form
```

_(Note: `react-hook-form` and `ajv` are included internally, so you don't need to install them separately!)_

---

## 🚀 Quick Start (Basic Example)

The easiest way to generate a form is to pass a standard JSON Schema to the `<SchemaForm />` component.

```tsx
import React from 'react';
import { SchemaForm, JSONSchema } from 'config-driven-form';
import 'config-driven-form/dist/index.css'; // Import the default CSS theme

const basicSchema: JSONSchema = {
  type: 'object',
  title: 'Contact Us',
  description: 'We would love to hear from you.',
  properties: {
    fullName: {
      type: 'string',
      title: 'Full Name',
    },
    email: {
      type: 'string',
      format: 'email',
      title: 'Email Address',
    },
  },
  required: ['fullName', 'email'],
};

export default function App() {
  return (
    <div style={{ padding: '2rem' }}>
      <SchemaForm schema={basicSchema} onSubmit={(data) => console.log('Submitted Data:', data)} />
    </div>
  );
}
```

---

## 🛠️ Advanced Usage (Layouts, Theming & UI Schema)

For complex enterprise applications, you often need to decouple your **data structure** from your **UI design**. You can achieve this by passing a `uiSchema` to control layouts and widgets, alongside the `theme` and `columns` props.

### Example: A 2-Column Employee Profile Form

```tsx
import React from 'react';
import { SchemaForm, JSONSchema, UISchema } from 'config-driven-form';
import 'config-driven-form/dist/index.css';

const complexSchema: JSONSchema = {
  type: 'object',
  title: 'Employee Profile',
  properties: {
    avatar: {
      type: 'string',
      title: 'Profile Picture',
      format: 'data-url', // Automatically renders a File Uploader!
    },
    firstName: { type: 'string', title: 'First Name' },
    lastName: { type: 'string', title: 'Last Name' },
    department: {
      type: 'string',
      title: 'Department',
      enum: ['Engineering', 'Design', 'Marketing', 'Sales'], // Renders a Dropdown by default
    },
    roleLevel: {
      type: 'string',
      title: 'Role Level',
      enum: ['Junior', 'Mid', 'Senior', 'Lead'],
    },
    remoteWorking: {
      type: 'boolean', // Renders a Checkbox
      title: 'I want to work remotely',
    },
    biography: {
      type: 'string',
      title: 'Biography',
      format: 'rich-text', // Renders a full WYSIWYG Tiptap Editor!
    },
  },
  required: ['firstName', 'lastName'],
};

// 🎨 Control the layout independently of the data!
const myUiSchema: Record<string, UISchema> = {
  avatar: { 'ui:columnSpan': 2 }, // Make the file uploader span across both columns
  roleLevel: { 'ui:widget': 'radio' }, // Force the dropdown to render as Radio buttons instead
  biography: { 'ui:columnSpan': 2 },
};

export default function AdvancedForm() {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <SchemaForm
        schema={complexSchema}
        uiSchema={myUiSchema}
        columns={2} // Sets the master grid to 2 columns
        theme={{
          primary: '#10b981', // Customize the primary brand color (Emerald Green)
          background: '#f0fdf4', // Customize the form background
        }}
        onSubmit={(data) => console.log('Profile Saved:', data)}
      />
    </div>
  );
}
```

---

## 📚 Supported Field Types

The library automatically inspects the `type`, `format`, and `enum` properties of your JSON Schema to render the correct UI component:

| JSON Schema Definition                  | Rendered React Component                       |
| :-------------------------------------- | :--------------------------------------------- |
| `type: "string"`                        | Text Input (`<input type="text">`)             |
| `type: "number"` / `"integer"`          | Number Input (`<input type="number">`)         |
| `type: "string", format: "email"`       | Email Input (Validated by AJV)                 |
| `type: "string", format: "password"`    | Password Input (`<input type="password">`)     |
| `type: "string", format: "rich-text"`   | Tiptap WYSIWYG Rich Text Editor                |
| `type: "string", format: "data-url"`    | File Upload Dropzone (Auto-converts to Base64) |
| `type: "boolean"`                       | Single Checkbox                                |
| `enum: ["A", "B"]`                      | Dropdown Select (`<select>`)                   |
| `enum: [...]` + `ui:widget: "radio"`    | Radio Button Group                             |
| `type: "array", items: { enum: [...] }` | Checkbox Group (Multiple Selections)           |

---

## ⚙️ API Reference

### `<SchemaForm />` Props

| Prop            | Type                       | Required | Description                                                                             |
| :-------------- | :------------------------- | :------: | :-------------------------------------------------------------------------------------- |
| `schema`        | `JSONSchema`               |   Yes    | The standard JSON Schema defining your data.                                            |
| `onSubmit`      | `(data: any) => void`      |   Yes    | Callback function triggered when the form is valid and submitted.                       |
| `uiSchema`      | `Record<string, UISchema>` |    No    | Controls UI-specific rendering (widgets, column spans) without altering data structure. |
| `columns`       | `1 \| 2 \| 3 \| 4`         |    No    | Defines the global CSS Grid columns for the form layout. Default: `1`.                  |
| `theme`         | `Object`                   |    No    | An object to override CSS variables (`primary`, `background`, `text`, `error`, etc.).   |
| `defaultValues` | `Object`                   |    No    | Initial data to populate the form fields before rendering.                              |

---

## 🤝 Contributing

We welcome contributions! If you want to fix a bug, add a new field type, or improve the documentation, please read our [Developer's Guide (CONTRIBUTING.md)](./CONTRIBUTING.md) to get started with your local development environment.
