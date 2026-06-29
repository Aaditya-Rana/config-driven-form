import { JSONSchema, UISchema } from '../types/schema';

export type BuilderFieldType =
  | 'text'
  | 'number'
  | 'email'
  | 'password'
  | 'rich-text'
  | 'file'
  | 'checkbox'
  | 'checkboxes'
  | 'select'
  | 'radio'
  | 'textarea'
  | 'date'
  | 'datetime'
  | 'time';

export interface FieldDef {
  id: string; // Internal UUID for drag and drop
  key: string; // The object property key in JSONSchema
  type: BuilderFieldType; // The primitive builder type
  schema: JSONSchema;
  uiSchema?: UISchema;
  isRequired?: boolean;
}

export interface CustomFieldDef {
  id: string; // Unique identifier for the custom field
  title: string; // Display name in the toolbox
  type: BuilderFieldType; // The base builder type it uses
  schema: JSONSchema;
  uiSchema?: UISchema;
  icon?: string; // Optional lucide-react icon name
}

// Initial templates for dropping new fields
export const FIELD_TEMPLATES: Record<BuilderFieldType, Omit<FieldDef, 'id' | 'key'>> = {
  text: {
    type: 'text',
    schema: { type: 'string', title: 'New Text Field' },
  },
  number: {
    type: 'number',
    schema: { type: 'number', title: 'New Number Field' },
  },
  email: {
    type: 'email',
    schema: { type: 'string', format: 'email', title: 'Email Address' },
  },
  password: {
    type: 'password',
    schema: { type: 'string', format: 'password', title: 'Password' },
  },
  'rich-text': {
    type: 'rich-text',
    schema: { type: 'string', format: 'rich-text', title: 'Rich Text' },
  },
  file: {
    type: 'file',
    schema: { type: 'string', format: 'data-url', title: 'File Upload' },
  },
  checkbox: {
    type: 'checkbox',
    schema: { type: 'boolean', title: 'Checkbox' },
  },
  checkboxes: {
    type: 'checkboxes',
    schema: {
      type: 'array',
      title: 'Multiple Checkboxes',
      items: { type: 'string', enum: ['Option 1', 'Option 2'] },
    },
  },
  select: {
    type: 'select',
    schema: { type: 'string', title: 'Dropdown Select', enum: ['Option 1', 'Option 2'] },
  },
  radio: {
    type: 'radio',
    schema: { type: 'string', title: 'Radio Buttons', enum: ['Option 1', 'Option 2'] },
    uiSchema: { 'ui:widget': 'radio' },
  },
  textarea: {
    type: 'textarea',
    schema: { type: 'string', title: 'Long Text' },
    uiSchema: { 'ui:widget': 'textarea' },
  },
  date: {
    type: 'date',
    schema: { type: 'string', format: 'date', title: 'Date' },
  },
  datetime: {
    type: 'datetime',
    schema: { type: 'string', format: 'date-time', title: 'Date & Time' },
  },
  time: {
    type: 'time',
    schema: { type: 'string', format: 'time', title: 'Time' },
  },
};
