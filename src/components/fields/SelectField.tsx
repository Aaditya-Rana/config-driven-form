import React from 'react';
import { useFormContext } from 'react-hook-form';
import { JSONSchema, UISchema } from '../../types/schema';
import { useClassNames, cx } from '../ClassNamesContext';

interface SelectFieldProps {
  name: string;
  schema: JSONSchema;
  uiSchema?: UISchema;
  isRequired?: boolean;
}

export const SelectField: React.FC<SelectFieldProps> = ({ name, schema, uiSchema, isRequired }) => {
  const globalClasses = useClassNames();
  const localClasses = uiSchema?.['ui:classNames'] || {};
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <div className={cx('cdf-field-group', globalClasses.fieldGroup, localClasses.fieldGroup)}>
      <label htmlFor={name} className={cx('cdf-label', globalClasses.label, localClasses.label)}>
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
        <select
          id={name}
          {...register(name)}
          className={cx(
            'cdf-input',
            'cdf-select',
            globalClasses.input,
            localClasses.input,
            error && 'cdf-input--error',
            error && globalClasses.inputError,
            error && localClasses.inputError,
          )}
        >
          <option value="">Select an option...</option>
          {schema.enum?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <span className={cx('cdf-error-message', globalClasses.errorText, localClasses.errorText)}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {error.message as string}
        </span>
      )}
    </div>
  );
};
