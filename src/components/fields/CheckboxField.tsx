import React from 'react';
import { useFormContext } from 'react-hook-form';
import { JSONSchema } from '../../types/schema';

interface CheckboxFieldProps {
  name: string;
  schema: JSONSchema;
  isRequired?: boolean;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({ name, schema, isRequired }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <div className="cdf-field-group">
      <div className="cdf-checkbox-group">
        <label className="cdf-checkbox-label">
          <input type="checkbox" {...register(name)} className="cdf-checkbox-input" />
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
        <span className="cdf-error-message">
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
