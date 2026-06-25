import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { ajvResolver } from '@hookform/resolvers/ajv';
import { JSONSchema, UISchema, FormClassNames } from '../types/schema';
import { FieldRenderer } from './FieldRenderer';
import { ClassNamesProvider, cx } from './ClassNamesContext';
import '../styles/form.css';

interface StepData {
  fields: string[];
}

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
    light?: any;
    dark?: any;
  };
  classNames?: FormClassNames;
  submitButtonText?: string;
  submitButtonAlign?: 'left' | 'center' | 'right' | 'full';
  themeMode?: 'light' | 'dark' | 'system';
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
  themeMode = 'system',
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

  const [isSystemDark, setIsSystemDark] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setIsSystemDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const [currentStep, setCurrentStep] = React.useState(0);

  const steps = React.useMemo(() => {
    if (schema.type !== 'object' || !schema.properties) return [];

    const parsedSteps: StepData[] = [];

    Object.keys(schema.properties).forEach((key) => {
      const stepIndex = uiSchema?.[key]?.['ui:step'] || 0;

      while (parsedSteps.length <= stepIndex) {
        parsedSteps.push({ fields: [] });
      }

      parsedSteps[stepIndex].fields.push(key);
    });

    // Clean up empty steps (if someone deleted all fields in a step)
    // Actually, we should keep them if we want to maintain step numbers,
    // but maybe we can just return it as is.
    if (parsedSteps.length === 0) {
      parsedSteps.push({ fields: [] });
    }

    return parsedSteps;
  }, [schema, uiSchema]);

  const isMultiStep = steps.length > 1;

  const handleNext = async () => {
    // Validate current step fields
    const currentFields = steps[currentStep].fields;
    const isValid = await methods.trigger(currentFields as any);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  if (schema.type !== 'object' || !schema.properties) {
    return <div className="cdf-error-message">Root schema must be an object with properties.</div>;
  }

  const effectiveMode = themeMode === 'system' ? (isSystemDark ? 'dark' : 'light') : themeMode;

  const activeTheme = theme
    ? {
        ...theme,
        ...(effectiveMode === 'dark' ? theme.dark : theme.light),
      }
    : undefined;

  const themeStyles = activeTheme
    ? ({
        '--cdf-primary': activeTheme.primary,
        '--cdf-bg': activeTheme.background,
        '--cdf-text': activeTheme.text,
        '--cdf-error': activeTheme.error,
        '--cdf-surface': activeTheme.surface,
        '--cdf-border': activeTheme.border,
        '--cdf-radius': activeTheme.radius,
      } as React.CSSProperties)
    : {};

  return (
    <ClassNamesProvider value={classNames}>
      <div
        className={cx('cdf-form-container', classNames.container)}
        style={themeStyles}
        data-theme={themeMode !== 'system' ? themeMode : undefined}
      >
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
            {isMultiStep && (
              <div style={{ marginBottom: '2rem' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem',
                  }}
                >
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--cdf-text)' }}>
                    Step {currentStep + 1} of {steps.length}
                  </span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--cdf-text-muted)' }}>
                    {Math.round(((currentStep + 1) / steps.length) * 100)}%
                  </span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: 'var(--cdf-border)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      backgroundColor: 'var(--cdf-primary)',
                      width: `${((currentStep + 1) / steps.length) * 100}%`,
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>
            )}

            <div className={`cdf-form-grid-${columns}`}>
              {steps[currentStep]?.fields.map((key) => {
                const propSchema = schema.properties![key];
                return (
                  <FieldRenderer
                    key={key}
                    name={key}
                    schema={propSchema}
                    uiSchema={uiSchema[key]}
                    isRequired={schema.required?.includes(key)}
                  />
                );
              })}
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
              {isMultiStep && currentStep > 0 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className={cx('cdf-submit-btn', classNames.submitButton)}
                  style={{
                    width: submitButtonAlign !== 'full' ? 'auto' : undefined,
                    minWidth: submitButtonAlign !== 'full' ? '150px' : undefined,
                    backgroundColor: 'transparent',
                    border: '1px solid var(--cdf-border)',
                    color: 'var(--cdf-text)',
                  }}
                >
                  Previous
                </button>
              )}

              {!isMultiStep || currentStep === steps.length - 1 ? (
                <button
                  type="submit"
                  className={cx('cdf-submit-btn', classNames.submitButton)}
                  style={
                    submitButtonAlign !== 'full' ? { width: 'auto', minWidth: '150px' } : undefined
                  }
                >
                  {submitButtonText}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className={cx('cdf-submit-btn', classNames.submitButton)}
                  style={
                    submitButtonAlign !== 'full' ? { width: 'auto', minWidth: '150px' } : undefined
                  }
                >
                  Next
                </button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </ClassNamesProvider>
  );
};
