import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormBuilder } from './FormBuilder';
import { JSONSchema, UISchema } from '../types/schema';

const meta = {
  title: 'Builder/FormBuilder',
  component: FormBuilder,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FormBuilder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EmptyBuilder: Story = {
  args: {
    onSave: (schema: JSONSchema, uiSchema: Record<string, UISchema>) => {
      alert(JSON.stringify({ schema, uiSchema }, null, 2));
    },
  },
};

const existingSchema: JSONSchema = {
  title: 'Contact Form',
  type: 'object',
  properties: {
    name: { type: 'string', title: 'Full Name' },
    email: { type: 'string', format: 'email', title: 'Email Address' },
    message: { type: 'string', title: 'Message', format: 'rich-text' },
  },
  required: ['name', 'email'],
};

const existingUiSchema: Record<string, UISchema> = {
  name: { 'ui:columnSpan': 2 },
  email: { 'ui:columnSpan': 2 },
  message: { 'ui:columnSpan': 4 },
};

export const WithExistingSchema: Story = {
  args: {
    initialSchema: existingSchema,
    initialUiSchema: existingUiSchema,
    onSave: (schema: JSONSchema, uiSchema: Record<string, UISchema>) => {
      alert('Saved! Check console for output.');
      console.log('Schema:', schema);
      console.log('UISchema:', uiSchema);
    },
  },
};

const enterpriseSchema: JSONSchema = {
  title: 'Enterprise CRM Lead Entry',
  description: 'A massive internal form for capturing sales leads.',
  type: 'object',
  properties: {
    leadAvatar: { type: 'string', format: 'data-url', title: 'Lead Profile Image' },
    firstName: { type: 'string', title: 'First Name', minLength: 2 },
    lastName: { type: 'string', title: 'Last Name', minLength: 2 },
    workEmail: { type: 'string', format: 'email', title: 'Work Email' },
    companyName: { type: 'string', title: 'Company Name' },
    companySize: {
      type: 'string',
      title: 'Company Size',
      enum: ['1-10', '11-50', '51-200', '201-500', '500+'],
    },
    budget: { type: 'number', title: 'Estimated Budget ($)', minimum: 1000 },
    isEnterprise: { type: 'boolean', title: 'Mark as Enterprise Lead' },
    leadSource: {
      type: 'string',
      title: 'Lead Source',
      enum: ['Inbound', 'Outbound', 'Referral', 'Event'],
    },
    technologies: {
      type: 'array',
      title: 'Current Tech Stack',
      items: { enum: ['React', 'Angular', 'Vue', 'Node.js', 'Python', 'AWS', 'GCP'] },
    },
    notes: { type: 'string', format: 'rich-text', title: 'Sales Notes' },
  },
  required: ['firstName', 'lastName', 'workEmail', 'companyName'],
};

const enterpriseUiSchema: Record<string, UISchema> = {
  leadAvatar: { 'ui:columnSpan': 4 },
  firstName: { 'ui:columnSpan': 2 },
  lastName: { 'ui:columnSpan': 2 },
  workEmail: { 'ui:columnSpan': 2 },
  companyName: { 'ui:columnSpan': 2 },
  companySize: { 'ui:columnSpan': 2, 'ui:widget': 'radio' },
  budget: { 'ui:columnSpan': 2 },
  isEnterprise: {
    'ui:columnSpan': 4,
    'ui:classNames': { checkboxLabel: 'text-indigo-600 font-bold text-lg' },
  },
  leadSource: { 'ui:columnSpan': 2 },
  technologies: { 'ui:columnSpan': 2 },
  notes: { 'ui:columnSpan': 4 },
};

export const EnterpriseComplexLayout: Story = {
  args: {
    initialSchema: enterpriseSchema,
    initialUiSchema: enterpriseUiSchema,
    onSave: () => {
      alert('Enterprise Form Saved!');
    },
  },
};
