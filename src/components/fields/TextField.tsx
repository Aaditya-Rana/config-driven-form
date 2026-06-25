import React from 'react';
import { useFormContext } from 'react-hook-form';
import { JSONSchema, UISchema } from '../../types/schema';
import { useClassNames, cx } from '../ClassNamesContext';
import { AlertCircle } from 'lucide-react';

interface TextFieldProps {
  name: string;
  schema: JSONSchema;
  uiSchema?: UISchema;
  isRequired?: boolean;
}

export const TextField: React.FC<TextFieldProps> = ({ name, schema, uiSchema, isRequired }) => {
  const globalClasses = useClassNames();
  const localClasses = uiSchema?.['ui:classNames'] || {};
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = errors[name];

  return (
    <div className={cx('cdf-field-group', globalClasses.fieldGroup, localClasses.fieldGroup)}>
      <label className={cx('cdf-label', globalClasses.label, localClasses.label)} htmlFor={name}>
        {schema.title || name}
        {isRequired && <span className="cdf-required-mark">*</span>}
      </label>
      {schema.description && (
        <p
          className={cx('cdf-description', globalClasses.description, localClasses.description)}
          style={{ fontSize: '0.875rem', color: '#6b7280', margin: '-0.25rem 0 0.5rem 0' }}
        >
          {schema.description}
        </p>
      )}
      <div className="cdf-input-wrapper">
        {uiSchema?.['ui:widget'] === 'textarea' ? (
          <textarea
            id={name}
            className={cx(
              'cdf-input',
              globalClasses.input,
              localClasses.input,
              error && 'cdf-input--error',
              error && globalClasses.inputError,
              error && localClasses.inputError,
            )}
            placeholder={`Enter ${schema.title || name}`}
            style={{ minHeight: '100px', resize: 'vertical' }}
            {...register(name)}
          />
        ) : (
          <input
            id={name}
            type={
              schema.format === 'email'
                ? 'email'
                : schema.format === 'date'
                  ? 'date'
                  : schema.format === 'date-time'
                    ? 'datetime-local'
                    : schema.format === 'time'
                      ? 'time'
                      : schema.format === 'password'
                        ? 'password'
                        : 'text'
            }
            className={cx(
              'cdf-input',
              globalClasses.input,
              localClasses.input,
              error && 'cdf-input--error',
              error && globalClasses.inputError,
              error && localClasses.inputError,
            )}
            placeholder={`Enter ${schema.title || name}`}
            {...register(name)}
          />
        )}
      </div>
      {error && (
        <span className={cx('cdf-error-message', globalClasses.errorText, localClasses.errorText)}>
          <AlertCircle size={14} />
          {error.message as string}
        </span>
      )}
    </div>
  );
};
