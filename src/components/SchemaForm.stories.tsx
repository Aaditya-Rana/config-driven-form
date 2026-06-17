import type { Meta, StoryObj } from '@storybook/react-vite';
import { SchemaForm } from './SchemaForm';
import { JSONSchema } from '../types/schema';

const meta = {
  title: 'Form/SchemaForm',
  component: SchemaForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SchemaForm>;

export default meta;
type Story = StoryObj<typeof meta>;

const registrationSchema: JSONSchema = {
  title: 'Registration Form',
  description: 'Please fill out the form to register an account.',
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: 'Full Name',
      minLength: 1,
    },
    email: {
      type: 'string',
      format: 'email',
      title: 'Email Address',
    },
    password: {
      type: 'string',
      format: 'password',
      title: 'Password',
      minLength: 8,
    },
    age: {
      type: 'integer',
      title: 'Age',
      minimum: 18,
    },
    bio: {
      type: 'string',
      title: 'Biography',
      format: 'rich-text',
    },
  },
  required: ['name', 'email', 'password'],
};

export const RegistrationForm: Story = {
  args: {
    schema: registrationSchema,
    onSubmit: (data) => alert(JSON.stringify(data, null, 2)),
  },
};

const complexSchema: JSONSchema = {
  title: 'Advanced Employee Profile',
  description: 'A deeply customized multi-column form with all field types.',
  type: 'object',
  properties: {
    avatar: {
      type: 'string',
      title: 'Profile Picture',
      format: 'data-url',
    },
    firstName: { type: 'string', title: 'First Name' },
    lastName: { type: 'string', title: 'Last Name' },
    department: {
      type: 'string',
      title: 'Department',
      enum: ['Engineering', 'Design', 'Marketing', 'Sales'],
    },
    roleLevel: {
      type: 'string',
      title: 'Role Level',
      enum: ['Junior', 'Mid', 'Senior', 'Lead'],
    },
    skills: {
      type: 'array',
      title: 'Technical Skills',
      items: {
        type: 'string',
        enum: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker'],
      },
    },
    remoteWorking: {
      type: 'boolean',
      title: 'I want to work remotely',
      description: 'Check this if you require a remote setup.',
    },
    biography: {
      type: 'string',
      title: 'Biography',
      format: 'rich-text',
    },
  },
  required: ['firstName', 'lastName', 'department'],
};

export const ComplexLayoutForm: Story = {
  args: {
    schema: complexSchema,
    columns: 2,
    uiSchema: {
      avatar: { 'ui:columnSpan': 2 },
      roleLevel: { 'ui:widget': 'radio' },
      skills: { 'ui:columnSpan': 2 },
      remoteWorking: { 'ui:columnSpan': 2 },
      biography: { 'ui:columnSpan': 2 },
    },
    theme: {
      primary: '#10b981', // Emerald green
      background: '#f0fdf4', // Light emerald tint
    },
    onSubmit: (data) => alert(JSON.stringify(data, null, 2)),
  },
};
