export type FieldType = 'string' | 'number' | 'integer' | 'boolean' | 'object' | 'array';
export type FieldFormat =
  | 'email'
  | 'password'
  | 'date'
  | 'time'
  | 'uri'
  | 'rich-text'
  | 'data-url'
  | string;

export interface JSONSchema {
  type: FieldType;
  title?: string;
  description?: string;
  format?: FieldFormat;
  properties?: Record<string, JSONSchema>;
  required?: string[];
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  pattern?: string;
  enum?: any[];
  items?: JSONSchema | JSONSchema[];
  default?: any;
  errorMessage?: string | Record<string, string>;
}

export interface FormClassNames {
  container?: string;
  title?: string;
  description?: string;
  form?: string;
  fieldGroup?: string;
  label?: string;
  input?: string;
  inputError?: string;
  errorText?: string;
  submitButton?: string;
  radioGroup?: string;
  radioLabel?: string;
  radioInput?: string;
  checkboxGroup?: string;
  checkboxLabel?: string;
  checkboxInput?: string;
  fileWrapper?: string;
  fileText?: string;
}

export interface UICondition {
  targetField: string;
  operator: 'is' | 'isNot' | 'contains' | 'doesNotContain' | 'isEmpty' | 'isNotEmpty' | 'gt' | 'lt';
  expectedValue?: any;
}

export interface UISchema {
  'ui:widget'?: 'radio' | 'checkboxes' | 'textarea' | 'color' | string;
  'ui:columnSpan'?: number;
  'ui:classNames'?: FormClassNames;
  'ui:condition'?: UICondition;
  [key: string]: any;
}
