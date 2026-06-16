import React from 'react';
import { JSONSchema } from '../types/schema';
import { TextField } from './fields/TextField';
import { PasswordField } from './fields/PasswordField';
import { NumberField } from './fields/NumberField';
import { RichTextField } from './fields/RichTextField';

interface FieldRendererProps {
  name: string;
  schema: JSONSchema;
  isRequired?: boolean;
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({ name, schema, isRequired }) => {
  if (schema.type === 'string') {
    if (schema.format === 'password') {
      return <PasswordField name={name} schema={schema} isRequired={isRequired} />;
    }
    if (schema.format === 'rich-text') {
      return <RichTextField name={name} schema={schema} isRequired={isRequired} />;
    }
    return <TextField name={name} schema={schema} isRequired={isRequired} />;
  }

  if (schema.type === 'number' || schema.type === 'integer') {
    return <NumberField name={name} schema={schema} isRequired={isRequired} />;
  }

  // Fallback for unsupported types
  return (
    <div className="cdf-field-group">
      <p className="cdf-error-message">Unsupported field type: {schema.type}</p>
    </div>
  );
};
