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

export const CustomTailwindClasses: Story = {
  args: {
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email', title: 'Email Address' },
      },
    },
    classNames: {
      container: 'max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md',
      label: 'block text-sm font-medium text-gray-700 mb-1',
      input:
        'w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500',
      submitButton: 'w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition',
    },
    uiSchema: {
      email: {
        'ui:classNames': {
          input: 'border-red-500 bg-red-50',
        },
      },
    },
    onSubmit: (data) => alert(JSON.stringify(data, null, 2)),
  },
};

export const MultiStepForm: Story = {
  args: {
    schema: {
      title: 'Checkout Process',
      type: 'object',
      properties: {
        firstName: { type: 'string', title: 'First Name' },
        lastName: { type: 'string', title: 'Last Name' },
        address: { type: 'string', title: 'Shipping Address' },
        creditCard: { type: 'string', title: 'Credit Card Number' },
      },
      required: ['firstName', 'address'],
    },
    uiSchema: {
      firstName: { 'ui:step': 0 },
      lastName: { 'ui:step': 0 },
      address: { 'ui:step': 1 },
      creditCard: { 'ui:step': 2 },
    },
    onSubmit: (data) => alert(JSON.stringify(data, null, 2)),
  },
};

export const ConditionalLogicForm: Story = {
  args: {
    schema: {
      title: 'Feedback Form',
      type: 'object',
      properties: {
        likeProduct: {
          type: 'boolean',
          title: 'Do you like our product?',
        },
        whyNot: {
          type: 'string',
          title: 'Please tell us why',
        },
      },
    },
    uiSchema: {
      whyNot: {
        'ui:condition': {
          targetField: 'likeProduct',
          operator: 'is',
          expectedValue: false,
        },
      },
    },
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

export const TailwindForm: Story = {
  args: {
    schema: {
      title: 'Tailwind SaaS Signup',
      description:
        'This form uses the classNames API to completely override styles with Tailwind CSS.',
      type: 'object',
      properties: {
        firstName: { type: 'string', title: 'First Name' },
        lastName: { type: 'string', title: 'Last Name' },
        email: { type: 'string', format: 'email', title: 'Email Address' },
        terms: {
          type: 'boolean',
          title: 'I accept the terms and conditions',
          description: 'You must read and agree to our terms before proceeding.',
        },
      },
      required: ['firstName', 'lastName', 'email', 'terms'],
    },
    columns: 2,
    uiSchema: {
      email: { 'ui:columnSpan': 2 },
      terms: { 'ui:columnSpan': 2 },
    },
    classNames: {
      container: 'max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-100',
      title: 'text-3xl font-extrabold text-gray-900 tracking-tight mb-2',
      description: 'text-gray-500 mb-8',
      form: 'space-y-6',
      fieldGroup: 'flex flex-col gap-1.5',
      label: 'text-sm font-semibold text-gray-700',
      input:
        'w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 outline-none',
      inputError: 'border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50',
      errorText: 'text-sm text-red-500 font-medium flex items-center gap-1 mt-1',
      submitButton:
        'w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5',
      checkboxLabel: 'flex items-center gap-3 text-gray-700 font-medium cursor-pointer',
      checkboxInput: 'w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500',
    },
    onSubmit: (data) => alert(JSON.stringify(data, null, 2)),
  },
};

const validationSchema: JSONSchema = {
  title: 'Advanced Validation Form',
  description: 'Demonstrates custom error messages per validation rule using ajv-errors.',
  type: 'object',
  properties: {
    username: {
      type: 'string',
      title: 'Username',
      minLength: 4,
      maxLength: 15,
      pattern: '^[a-z0-9_]+$',
      errorMessage: {
        minLength: 'Username must be at least 4 characters long.',
        maxLength: 'Username cannot exceed 15 characters.',
        pattern: 'Username can only contain lowercase letters, numbers, and underscores.',
        required: 'Please provide a unique username.',
      },
    },
    age: {
      type: 'integer',
      title: 'Age',
      minimum: 18,
      maximum: 120,
      errorMessage: {
        minimum: 'You must be at least 18 years old to register.',
        maximum: 'Please enter a valid age under 120.',
        required: 'Age is required to verify your eligibility.',
      },
    },
    password: {
      type: 'string',
      format: 'password',
      title: 'Password',
      minLength: 8,
      errorMessage: {
        minLength: 'Password must be extremely secure (at least 8 characters).',
        required: 'A password is absolutely mandatory.',
      },
    },
  },
  required: ['username', 'age', 'password'],
};

export const AdvancedValidationForm: Story = {
  args: {
    schema: validationSchema,
    onSubmit: (data) => alert(JSON.stringify(data, null, 2)),
  },
};
