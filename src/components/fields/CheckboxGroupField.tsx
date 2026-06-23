import React from 'react';
import { useFormContext } from 'react-hook-form';
import { JSONSchema, UISchema } from '../../types/schema';
import { useClassNames, cx } from '../ClassNamesContext';

interface CheckboxGroupFieldProps {
  name: string;
  schema: JSONSchema;
  uiSchema?: UISchema;
  isRequired?: boolean;
}

export const CheckboxGroupField: React.FC<CheckboxGroupFieldProps> = ({
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

  // Extract enum options from items definition
  let options: any[] = [];
  if (schema.items && !Array.isArray(schema.items) && schema.items.enum) {
    options = schema.items.enum;
  }

  return (
    <div className={cx('cdf-field-group', globalClasses.fieldGroup, localClasses.fieldGroup)}>
      <label className={cx('cdf-label', globalClasses.label, localClasses.label)}>
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

      <div
        className={cx(
          'cdf-checkbox-group',
          globalClasses.checkboxGroup,
          localClasses.checkboxGroup,
        )}
      >
        {options.map((option) => (
          <label
            key={option}
            className={cx(
              'cdf-checkbox-label',
              globalClasses.checkboxLabel,
              localClasses.checkboxLabel,
            )}
          >
            <input
              type="checkbox"
              value={option}
              {...register(name)}
              className={cx(
                'cdf-checkbox-input',
                globalClasses.checkboxInput,
                localClasses.checkboxInput,
              )}
            />
            {option}
          </label>
        ))}
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
