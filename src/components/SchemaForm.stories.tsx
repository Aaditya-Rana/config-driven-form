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
