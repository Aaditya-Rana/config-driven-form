import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { ajvResolver } from '@hookform/resolvers/ajv';
import { JSONSchema, UISchema } from '../types/schema';
import { FieldRenderer } from './FieldRenderer';
import '../styles/form.css';

interface SchemaFormProps {
  schema: JSONSchema;
  uiSchema?: Record<string, UISchema>;
  onSubmit: (data: any) => void;
  defaultValues?: any;
  columns?: 1 | 2 | 3 | 4;
  theme?: {
    primary?: string;
    background?: string;
    text?: string;
    error?: string;
    surface?: string;
    border?: string;
  };
}

export const SchemaForm: React.FC<SchemaFormProps> = ({
  schema,
  uiSchema = {},
  onSubmit,
  defaultValues,
  columns = 1,
  theme,
}) => {
  const methods = useForm({
    resolver: ajvResolver(schema as any, {
      formats: {
        'rich-text': true,
        password: true,
        'data-url': true,
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      },
    }),
    defaultValues,
  });

  if (schema.type !== 'object' || !schema.properties) {
    return <div className="cdf-error-message">Root schema must be an object with properties.</div>;
  }

  const themeStyles = theme
    ? ({
        '--cdf-primary': theme.primary,
        '--cdf-bg': theme.background,
        '--cdf-text': theme.text,
        '--cdf-error': theme.error,
        '--cdf-surface': theme.surface,
        '--cdf-border': theme.border,
      } as React.CSSProperties)
    : {};

  return (
    <div className="cdf-form-container" style={themeStyles}>
      {schema.title && <h2 className="cdf-form-title">{schema.title}</h2>}
      {schema.description && (
        <p style={{ color: 'var(--cdf-text-muted)', marginBottom: '1.5rem' }}>
          {schema.description}
        </p>
      )}

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
          <div className={`cdf-form-grid-${columns}`}>
            {Object.entries(schema.properties).map(([key, propSchema]) => (
              <FieldRenderer
                key={key}
                name={key}
                schema={propSchema}
                uiSchema={uiSchema[key]}
                isRequired={schema.required?.includes(key)}
              />
            ))}
          </div>
          <button type="submit" className="cdf-submit-btn">
            Submit
          </button>
        </form>
      </FormProvider>
    </div>
  );
};
