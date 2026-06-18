# Config-Driven Form

A highly scalable, config-driven React form library that dynamically generates beautiful, fully validated forms directly from JSON Schema.

## Features

- **Performant**: Built on top of `react-hook-form` and `ajv` to minimize re-renders and handle complex schemas efficiently.
- **Extensible**: Easily add custom field types (like rich-text editors, maps, or file uploaders) using our custom `FieldRenderer` engine.
- **Rich Text Support**: Built-in integration with `Tiptap` for rich text editing.
- **Beautiful by Default**: Features a modern, glassmorphic design system out of the box using pure CSS.

## Installation

```bash
npm install config-driven-form
```

## Quick Start

```tsx
import React from 'react';
import { SchemaForm, JSONSchema } from 'config-driven-form';
import 'config-driven-form/dist/index.css';

const mySchema: JSONSchema = {
  type: 'object',
  title: 'Contact Us',
  properties: {
    email: { type: 'string', format: 'email', title: 'Email Address' },
    message: { type: 'string', format: 'rich-text', title: 'Your Message' },
  },
  required: ['email'],
};

export default function App() {
  return (
    <div style={{ padding: '2rem' }}>
      <SchemaForm schema={mySchema} onSubmit={(data) => console.log(data)} />
    </div>
  );
}
```

## Contributing

We welcome contributions! If you want to fix a bug, add a new field type, or improve the documentation, please read our [Developer's Guide (CONTRIBUTING.md)](./CONTRIBUTING.md) to get started with your local development environment.
