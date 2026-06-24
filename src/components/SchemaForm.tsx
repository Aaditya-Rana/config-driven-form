import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { ajvResolver } from '@hookform/resolvers/ajv';
import { JSONSchema, UISchema, FormClassNames } from '../types/schema';
import { FieldRenderer } from './FieldRenderer';
import { ClassNamesProvider, cx } from './ClassNamesContext';
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
    radius?: string;
  };
  classNames?: FormClassNames;
  submitButtonText?: string;
  submitButtonAlign?: 'left' | 'center' | 'right' | 'full';
}

export const SchemaForm: React.FC<SchemaFormProps> = ({
  schema,
  uiSchema = {},
  onSubmit,
  defaultValues,
  columns = 1,
  theme,
  classNames = {},
  submitButtonText = 'Submit',
  submitButtonAlign = 'full',
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
        '--cdf-radius': theme.radius,
      } as React.CSSProperties)
    : {};

  return (
    <ClassNamesProvider value={classNames}>
      <div className={cx('cdf-form-container', classNames.container)} style={themeStyles}>
        {schema.title && <h2 className={cx('cdf-form-title', classNames.title)}>{schema.title}</h2>}
        {schema.description && (
          <p
            className={classNames.description}
            style={{ color: 'var(--cdf-text-muted)', marginBottom: '1.5rem' }}
          >
            {schema.description}
          </p>
        )}

        <FormProvider {...methods}>
          <form className={classNames.form} onSubmit={methods.handleSubmit(onSubmit)} noValidate>
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
            <div
              style={{
                display: 'flex',
                justifyContent:
                  submitButtonAlign === 'left'
                    ? 'flex-start'
                    : submitButtonAlign === 'right'
                      ? 'flex-end'
                      : submitButtonAlign === 'center'
                        ? 'center'
                        : 'stretch',
                width: '100%',
              }}
            >
              <button
                type="submit"
                className={cx('cdf-submit-btn', classNames.submitButton)}
                style={
                  submitButtonAlign !== 'full' ? { width: 'auto', minWidth: '150px' } : undefined
                }
              >
                {submitButtonText}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </ClassNamesProvider>
  );
};
