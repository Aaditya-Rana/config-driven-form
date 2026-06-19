import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { JSONSchema, UISchema } from '../../types/schema';
import { useClassNames, cx } from '../ClassNamesContext';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

interface PasswordFieldProps {
  name: string;
  schema: JSONSchema;
  uiSchema?: UISchema;
  isRequired?: boolean;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
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
  const [showPassword, setShowPassword] = useState(false);
  const error = errors[name];

  return (
    <div className={cx('cdf-field-group', globalClasses.fieldGroup, localClasses.fieldGroup)}>
      <label className={cx('cdf-label', globalClasses.label, localClasses.label)} htmlFor={name}>
        {schema.title || name}
        {isRequired && <span className="cdf-required-mark">*</span>}
      </label>
      <div className="cdf-input-wrapper">
        <input
          id={name}
          type={showPassword ? 'text' : 'password'}
          className={cx(
            'cdf-input',
            globalClasses.input,
            localClasses.input,
            error && 'cdf-input--error',
            error && globalClasses.inputError,
            error && localClasses.inputError,
          )}
          style={{ paddingRight: '2.5rem' }}
          placeholder={`Enter ${schema.title || name}`}
          {...register(name)}
        />
        <button
          type="button"
          className="cdf-toolbar-btn"
          style={{ position: 'absolute', right: '0.5rem' }}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
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
