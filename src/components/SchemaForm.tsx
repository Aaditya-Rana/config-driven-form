import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { ajvResolver } from '@hookform/resolvers/ajv';
import { JSONSchema } from '../types/schema';
import { FieldRenderer } from './FieldRenderer';
import '../styles/form.css';

interface SchemaFormProps {
  schema: JSONSchema;
  onSubmit: (data: any) => void;
  defaultValues?: any;
}

export const SchemaForm: React.FC<SchemaFormProps> = ({ schema, onSubmit, defaultValues }) => {
  const methods = useForm({
    resolver: ajvResolver(schema as any, {
      formats: {
        'rich-text': true,
        password: true,
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      },
    }),
    defaultValues,
  });

  if (schema.type !== 'object' || !schema.properties) {
    return <div className="cdf-error-message">Root schema must be an object with properties.</div>;
  }

  return (
    <div className="cdf-form-container">
      {schema.title && <h2 className="cdf-form-title">{schema.title}</h2>}
      {schema.description && (
        <p style={{ color: 'var(--cdf-text-muted)', marginBottom: '1.5rem' }}>
          {schema.description}
        </p>
      )}

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
          {Object.entries(schema.properties).map(([key, propSchema]) => (
            <FieldRenderer
              key={key}
              name={key}
              schema={propSchema}
              isRequired={schema.required?.includes(key)}
            />
          ))}
          <button type="submit" className="cdf-submit-btn">
            Submit
          </button>
        </form>
      </FormProvider>
    </div>
  );
};
