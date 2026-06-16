export type FieldType = 'string' | 'number' | 'integer' | 'boolean' | 'object' | 'array';
export type FieldFormat = 'email' | 'password' | 'date' | 'time' | 'uri' | 'rich-text' | string;

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
}
