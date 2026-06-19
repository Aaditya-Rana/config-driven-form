import React from 'react';
import { useFormContext } from 'react-hook-form';
import { JSONSchema, UISchema } from '../../types/schema';
import { useClassNames, cx } from '../ClassNamesContext';

interface CheckboxFieldProps {
  name: string;
  schema: JSONSchema;
  uiSchema?: UISchema;
  isRequired?: boolean;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  name,
  schema,
  uiSchema,
  isRequired,
}) => {
  const globalClasses = useClassNames();
  const localClasses = uiSchema?.['ui:classNames'] || {};
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <div className={cx('cdf-field-group', globalClasses.fieldGroup, localClasses.fieldGroup)}>
      <div
        className={cx(
          'cdf-checkbox-group',
          globalClasses.checkboxGroup,
          localClasses.checkboxGroup,
        )}
      >
        <label
          className={cx(
            'cdf-checkbox-label',
            globalClasses.checkboxLabel,
            localClasses.checkboxLabel,
          )}
        >
          <input
            type="checkbox"
            {...register(name)}
            className={cx(
              'cdf-checkbox-input',
              globalClasses.checkboxInput,
              localClasses.checkboxInput,
            )}
          />
          {schema.title || name}
          {isRequired && <span className="cdf-required-mark">*</span>}
        </label>
      </div>

      {schema.description && (
        <p style={{ fontSize: '0.875rem', color: 'var(--cdf-text-muted)', marginTop: '0.25rem' }}>
          {schema.description}
        </p>
      )}

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
