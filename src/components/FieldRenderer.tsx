import React from 'react';
import { useWatch } from 'react-hook-form';
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
  isBuilder?: boolean;
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({
  name,
  schema,
  uiSchema,
  isRequired,
  isBuilder,
}) => {
  const columnSpan = uiSchema?.['ui:columnSpan'] || 1;
  const widget = uiSchema?.['ui:widget'];
  const condition = uiSchema?.['ui:condition'];

  const targetValue = useWatch({
    name: condition?.targetField || '',
    disabled: !condition,
  });

  if (condition) {
    const { operator, expectedValue } = condition;
    let isMatch = false;

    switch (operator) {
      case 'is':
        isMatch = targetValue === expectedValue;
        break;
      case 'isNot':
        isMatch = targetValue !== expectedValue;
        break;
      case 'contains':
        isMatch = typeof targetValue === 'string' && targetValue.includes(String(expectedValue));
        break;
      case 'doesNotContain':
        isMatch = typeof targetValue === 'string' && !targetValue.includes(String(expectedValue));
        break;
      case 'isEmpty':
        isMatch = targetValue === '' || targetValue === null || targetValue === undefined;
        break;
      case 'isNotEmpty':
        isMatch = targetValue !== '' && targetValue !== null && targetValue !== undefined;
        break;
      case 'gt':
        isMatch = Number(targetValue) > Number(expectedValue);
        break;
      case 'lt':
        isMatch = Number(targetValue) < Number(expectedValue);
        break;
    }

    if (!isMatch && !isBuilder) {
      return null;
    }
  }

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

  return (
    <div
      style={{
        gridColumn: `span ${columnSpan}`,
        opacity: condition && isBuilder ? 0.6 : 1, // Visually indicate it has a condition in the builder
        position: 'relative',
      }}
    >
      {condition && isBuilder && (
        <div
          style={{
            position: 'absolute',
            top: '-8px',
            right: 0,
            fontSize: '0.65rem',
            background: '#e0e7ff',
            color: '#4338ca',
            padding: '2px 6px',
            borderRadius: '4px',
            fontWeight: 600,
          }}
        >
          Conditional
        </div>
      )}
      {renderField()}
    </div>
  );
};
