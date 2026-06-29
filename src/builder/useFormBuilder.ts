import { useState, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { arrayMove } from '@dnd-kit/sortable';
import { FieldDef, BuilderFieldType, FIELD_TEMPLATES, CustomFieldDef } from './types';
import { JSONSchema, UISchema } from '../types/schema';

export interface FormSettings {
  columns: 1 | 2 | 3 | 4;
  theme: {
    primary?: string;
    background?: string;
    text?: string;
    error?: string;
    radius?: string;
    surface?: string;
    border?: string;
    light?: {
      primary?: string;
      background?: string;
      text?: string;
      error?: string;
      surface?: string;
      border?: string;
    };
    dark?: {
      primary?: string;
      background?: string;
      text?: string;
      error?: string;
      surface?: string;
      border?: string;
    };
  };
  submitButtonText?: string;
  submitButtonAlign?: 'left' | 'center' | 'right' | 'full';
  maxWidth?: string;
  classNames?: {
    title?: string;
    description?: string;
  };
  title?: string;
  description?: string;
  themeMode?: 'light' | 'dark' | 'system';
}

export const useFormBuilder = (
  initialSchema?: JSONSchema,
  initialUiSchema?: Record<string, UISchema>,
  initialColumns?: 1 | 2 | 3 | 4,
  initialTheme?: FormSettings['theme'],
) => {
  // Try to parse existing schema into FieldDef[], or start empty
  const [fields, setFields] = useState<FieldDef[]>(() => {
    if (!initialSchema || !initialSchema.properties) return [];

    return Object.entries(initialSchema.properties).map(([key, propSchema]) => {
      // Very basic type inference for reverse mapping
      let type: BuilderFieldType = 'text';
      if (propSchema.type === 'string') {
        if (propSchema.format === 'email') type = 'email';
        else if (propSchema.format === 'password') type = 'password';
        else if (propSchema.format === 'data-url') type = 'file';
        else if (propSchema.format === 'rich-text') type = 'rich-text';
        else if (propSchema.format === 'date') type = 'date';
        else if (propSchema.format === 'date-time') type = 'datetime';
        else if (propSchema.format === 'time') type = 'time';
        else if (propSchema.enum) type = 'select'; // or radio, we'll refine below
      } else if (propSchema.type === 'number' || propSchema.type === 'integer') {
        type = 'number';
      } else if (propSchema.type === 'boolean') {
        type = 'checkbox';
      } else if (propSchema.type === 'array') {
        type = 'checkboxes';
      }

      const uiSchema = initialUiSchema?.[key];
      if (propSchema.enum && uiSchema?.['ui:widget'] === 'radio') {
        type = 'radio';
      } else if (uiSchema?.['ui:widget'] === 'textarea') {
        type = 'textarea';
      }

      return {
        id: uuidv4(),
        key,
        type,
        schema: propSchema,
        uiSchema,
        isRequired: initialSchema.required?.includes(key),
      };
    });
  });

  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  const addField = useCallback(
    (
      type: BuilderFieldType | string,
      index?: number,
      step?: number,
      customTemplate?: CustomFieldDef,
    ) => {
      const template = customTemplate || FIELD_TEMPLATES[type as BuilderFieldType];
      if (!template) return;

      let initialUiSchema = template.uiSchema ? JSON.parse(JSON.stringify(template.uiSchema)) : {};
      if (step !== undefined) {
        initialUiSchema['ui:step'] = step;
      }
      if (Object.keys(initialUiSchema).length === 0) {
        initialUiSchema = undefined;
      }

      const newField: FieldDef = {
        id: uuidv4(),
        key: `${customTemplate ? customTemplate.type : type}_${Math.random().toString(36).substring(2, 6)}`,
        type: (customTemplate ? customTemplate.type : type) as BuilderFieldType,
        // Deep clone template schemas
        schema: JSON.parse(JSON.stringify(template.schema)),
        uiSchema: initialUiSchema,
      };

      setFields((prev) => {
        if (typeof index === 'number') {
          const newFields = [...prev];
          newFields.splice(index, 0, newField);
          return newFields;
        }
        return [...prev, newField];
      });
      setSelectedFieldId(newField.id);
    },
    [],
  );

  const removeField = useCallback(
    (id: string) => {
      setFields((prev) => prev.filter((f) => f.id !== id));
      if (selectedFieldId === id) setSelectedFieldId(null);
    },
    [selectedFieldId],
  );

  const updateField = useCallback((id: string, updates: Partial<FieldDef>) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  }, []);

  const reorderFields = useCallback((activeId: string, overId: string) => {
    setFields((prev) => {
      const oldIndex = prev.findIndex((f) => f.id === activeId);
      const newIndex = prev.findIndex((f) => f.id === overId);
      return arrayMove(prev, oldIndex, newIndex);
    });
  }, []);

  const selectedField = useMemo(
    () => fields.find((f) => f.id === selectedFieldId),
    [fields, selectedFieldId],
  );

  const [formSettings, setFormSettings] = useState<FormSettings>({
    columns: initialColumns || 1,
    theme: initialTheme || {},
    themeMode: 'system',
    title: initialSchema?.title,
    description: initialSchema?.description,
  });

  // Export back to standard JSON Schema and UI Schema
  const compileSchemas = useCallback(() => {
    const finalSchema: JSONSchema = {
      type: 'object',
      title: formSettings.title ?? initialSchema?.title ?? 'Form Builder',
      description: formSettings.description ?? initialSchema?.description ?? '',
      properties: {},
      required: [],
    };

    const finalUiSchema: Record<string, UISchema> = {};

    fields.forEach((field) => {
      if (finalSchema.properties) {
        finalSchema.properties[field.key] = field.schema;
      }
      if (field.isRequired && finalSchema.required) {
        finalSchema.required.push(field.key);
      }
      if (field.uiSchema) {
        finalUiSchema[field.key] = field.uiSchema;
      }
    });

    if (finalSchema.required?.length === 0) {
      delete finalSchema.required;
    }

    return { schema: finalSchema, uiSchema: finalUiSchema };
  }, [fields, initialSchema, formSettings.title, formSettings.description]);

  const updateFormSettings = useCallback((updates: Partial<FormSettings>) => {
    setFormSettings((prev) => ({
      ...prev,
      ...updates,
      theme: { ...prev.theme, ...(updates.theme || {}) },
    }));
  }, []);

  return {
    fields,
    selectedFieldId,
    setSelectedFieldId,
    selectedField,
    addField,
    removeField,
    updateField,
    reorderFields,
    compileSchemas,
    formSettings,
    updateFormSettings,
  };
};
