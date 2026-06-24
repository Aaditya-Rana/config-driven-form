import React from 'react';
import { JSONSchema, UISchema } from '../types/schema';
import { TextField } from './fields/TextField';
import { PasswordField } from './fields/PasswordField';
import { NumberField } from './fields/NumberField';
import { RichTextField } from './fields/RichTextField';
import { SelectField } from './fields/SelectField';
import { RadioField } from './fields/RadioField';
import { CheckboxField } from './fields/CheckboxField';
import { CheckboxGroupField } from './fields/CheckboxGroupField';
import { FileField } from './fields/FileField';

interface FieldRendererProps {
  name: string;
  schema: JSONSchema;
  uiSchema?: UISchema;
  isRequired?: boolean;
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({
  name,
  schema,
  uiSchema,
  isRequired,
}) => {
  const columnSpan = uiSchema?.['ui:columnSpan'] || 1;
  const widget = uiSchema?.['ui:widget'];

  const renderField = () => {
    // Arrays (Checkbox Groups)
    if (schema.type === 'array') {
      return (
        <CheckboxGroupField
          name={name}
          schema={schema}
          uiSchema={uiSchema}
          isRequired={isRequired}
        />
      );
    }

    // Booleans (Single Checkbox)
    if (schema.type === 'boolean') {
      return (
        <CheckboxField name={name} schema={schema} uiSchema={uiSchema} isRequired={isRequired} />
      );
    }

    // Enums (Select vs Radio)
    if (schema.enum) {
      if (widget === 'radio') {
        return (
          <RadioField name={name} schema={schema} uiSchema={uiSchema} isRequired={isRequired} />
        );
      }
      return (
        <SelectField name={name} schema={schema} uiSchema={uiSchema} isRequired={isRequired} />
      );
    }

    // Strings
    if (schema.type === 'string') {
      if (schema.format === 'data-url') {
        return (
          <FileField name={name} schema={schema} uiSchema={uiSchema} isRequired={isRequired} />
        );
      }
      if (schema.format === 'password') {
        return (
          <PasswordField name={name} schema={schema} uiSchema={uiSchema} isRequired={isRequired} />
        );
      }
      if (schema.format === 'rich-text') {
        return (
          <RichTextField name={name} schema={schema} uiSchema={uiSchema} isRequired={isRequired} />
        );
      }
      return <TextField name={name} schema={schema} uiSchema={uiSchema} isRequired={isRequired} />;
    }

    // Numbers
    if (schema.type === 'number' || schema.type === 'integer') {
      return (
        <NumberField name={name} schema={schema} uiSchema={uiSchema} isRequired={isRequired} />
      );
    }

    // Fallback
    return (
      <div className="cdf-field-group">
        <p className="cdf-error-message">Unsupported field type: {schema.type}</p>
      </div>
    );
  };

  return <div className={`cdf-builder-field-span-${columnSpan}`}>{renderField()}</div>;
};
