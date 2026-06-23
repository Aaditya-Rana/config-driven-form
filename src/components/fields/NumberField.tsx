import React from 'react';
import { useFormContext } from 'react-hook-form';
import { JSONSchema, UISchema } from '../../types/schema';
import { useClassNames, cx } from '../ClassNamesContext';
import { AlertCircle } from 'lucide-react';

interface NumberFieldProps {
  name: string;
  schema: JSONSchema;
  uiSchema?: UISchema;
  isRequired?: boolean;
}

export const NumberField: React.FC<NumberFieldProps> = ({ name, schema, uiSchema, isRequired }) => {
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
        <input
          id={name}
          type="number"
          className={cx(
            'cdf-input',
            globalClasses.input,
            localClasses.input,
            error && 'cdf-input--error',
            error && globalClasses.inputError,
            error && localClasses.inputError,
          )}
          placeholder={`Enter ${schema.title || name}`}
          {...register(name, {
            valueAsNumber: true,
          })}
        />
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
