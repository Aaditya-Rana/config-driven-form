import React, { useState } from 'react';
import { FieldDef } from '../types';
import { Settings, CheckCircle2, Paintbrush, LayoutTemplate, Palette } from 'lucide-react';
import { FormSettings } from '../useFormBuilder';

interface PropertiesPanelProps {
  field: FieldDef | null;
  formSettings: FormSettings;
  onUpdate: (id: string, updates: Partial<FieldDef>) => void;
  onUpdateSettings: (updates: Partial<FormSettings>) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  field,
  formSettings,
  onUpdate,
  onUpdateSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'validation' | 'design'>('general');

  if (!field) {
    return (
      <div
        style={{
          width: '320px',
          borderLeft: '1px solid #e5e7eb',
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            padding: '1.5rem',
            borderBottom: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb',
          }}
        >
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', margin: 0 }}>
            Global Form Settings
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0' }}>
            Click a field to edit its properties, or configure global form settings here.
          </p>
        </div>

        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Global Layout */}
          <div>
            <h4
              style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
              }}
            >
              <LayoutTemplate size={16} /> Layout Options
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 500, color: '#6b7280' }}>
                Global Columns
              </label>
              <select
                value={formSettings.columns}
                onChange={(e) =>
                  onUpdateSettings({ columns: Number(e.target.value) as 1 | 2 | 3 | 4 })
                }
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                }}
              >
                <option value={1}>1 Column</option>
                <option value={2}>2 Columns</option>
                <option value={3}>3 Columns</option>
                <option value={4}>4 Columns</option>
              </select>
            </div>
          </div>

          {/* Global Theme */}
          <div>
            <h4
              style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
              }}
            >
              <Palette size={16} /> Theme Colors
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem',
                }}
              >
                <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#4b5563' }}>
                  Primary Color
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="color"
                    value={formSettings.theme.primary || '#6366f1'}
                    onChange={(e) =>
                      onUpdateSettings({
                        theme: { ...formSettings.theme, primary: e.target.value },
                      })
                    }
                    style={{
                      width: '28px',
                      height: '28px',
                      padding: '0',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  />
                  <input
                    type="text"
                    value={formSettings.theme.primary || ''}
                    placeholder="#6366f1"
                    onChange={(e) =>
                      onUpdateSettings({
                        theme: { ...formSettings.theme, primary: e.target.value },
                      })
                    }
                    style={{
                      width: '80px',
                      padding: '0.25rem 0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem',
                }}
              >
                <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#4b5563' }}>
                  Background Color
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="color"
                    value={formSettings.theme.background || '#ffffff'}
                    onChange={(e) =>
                      onUpdateSettings({
                        theme: { ...formSettings.theme, background: e.target.value },
                      })
                    }
                    style={{
                      width: '28px',
                      height: '28px',
                      padding: '0',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  />
                  <input
                    type="text"
                    value={formSettings.theme.background || ''}
                    placeholder="#ffffff"
                    onChange={(e) =>
                      onUpdateSettings({
                        theme: { ...formSettings.theme, background: e.target.value },
                      })
                    }
                    style={{
                      width: '80px',
                      padding: '0.25rem 0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSchemaChange = (key: string, value: any) => {
    onUpdate(field.id, {
      schema: { ...field.schema, [key]: value },
    });
  };

  const handleUiSchemaChange = (key: string, value: any) => {
    onUpdate(field.id, {
      uiSchema: { ...(field.uiSchema || {}), [key]: value },
    });
  };

  const handleClassNamesChange = (element: string, value: string) => {
    const existingUiClassNames = field.uiSchema?.['ui:classNames'] || {};
    handleUiSchemaChange('ui:classNames', {
      ...existingUiClassNames,
      [element]: value,
    });
  };

  return (
    <div
      style={{
        width: '320px',
        borderLeft: '1px solid #e5e7eb',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflowY: 'auto',
      }}
    >
      <div style={{ padding: '1.5rem 1.5rem 0', borderBottom: '1px solid #e5e7eb' }}>
        <h3
          style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}
        >
          Field Settings
        </h3>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
          <button
            onClick={() => setActiveTab('general')}
            style={{
              flex: 1,
              padding: '0.75rem 0',
              fontSize: '0.875rem',
              fontWeight: 500,
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: `2px solid ${activeTab === 'general' ? '#6366f1' : 'transparent'}`,
              color: activeTab === 'general' ? '#6366f1' : '#6b7280',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.25rem',
            }}
          >
            <Settings size={14} /> General
          </button>
          <button
            onClick={() => setActiveTab('validation')}
            style={{
              flex: 1,
              padding: '0.75rem 0',
              fontSize: '0.875rem',
              fontWeight: 500,
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: `2px solid ${activeTab === 'validation' ? '#6366f1' : 'transparent'}`,
              color: activeTab === 'validation' ? '#6366f1' : '#6b7280',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.25rem',
            }}
          >
            <CheckCircle2 size={14} /> Validation
          </button>
          <button
            onClick={() => setActiveTab('design')}
            style={{
              flex: 1,
              padding: '0.75rem 0',
              fontSize: '0.875rem',
              fontWeight: 500,
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: `2px solid ${activeTab === 'design' ? '#6366f1' : 'transparent'}`,
              color: activeTab === 'design' ? '#6366f1' : '#6b7280',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.25rem',
            }}
          >
            <Paintbrush size={14} /> Design
          </button>
        </div>
      </div>

      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {activeTab === 'general' && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                Property Key
              </label>
              <input
                type="text"
                value={field.key}
                onChange={(e) =>
                  onUpdate(field.id, { key: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') })
                }
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                }}
                placeholder="e.g. firstName"
              />
              <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                The key used in the final JSON output.
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                Label / Title
              </label>
              <input
                type="text"
                value={field.schema.title || ''}
                onChange={(e) => handleSchemaChange('title', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                Description
              </label>
              <textarea
                value={field.schema.description || ''}
                onChange={(e) => handleSchemaChange('description', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  minHeight: '80px',
                }}
              />
            </div>

            {/* Enums for Select/Radio/Checkboxes */}
            {(field.type === 'select' || field.type === 'radio' || field.type === 'checkboxes') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                  Options (Comma separated)
                </label>
                <input
                  type="text"
                  value={
                    field.type === 'checkboxes'
                      ? field.schema.items && !Array.isArray(field.schema.items)
                        ? field.schema.items.enum?.join(', ')
                        : ''
                      : field.schema.enum?.join(', ') || ''
                  }
                  onChange={(e) => {
                    const valArray = e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean);
                    if (field.type === 'checkboxes') {
                      handleSchemaChange('items', {
                        ...((field.schema.items as any) || {}),
                        enum: valArray,
                      });
                    } else {
                      handleSchemaChange('enum', valArray);
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                  }}
                />
              </div>
            )}
          </>
        )}

        {activeTab === 'validation' && (
          <>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#374151',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={field.isRequired || false}
                onChange={(e) => onUpdate(field.id, { isRequired: e.target.checked })}
              />
              Required Field
            </label>

            {(field.type === 'text' || field.type === 'email' || field.type === 'password') && (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                    Min Length
                  </label>
                  <input
                    type="number"
                    value={field.schema.minLength || ''}
                    onChange={(e) =>
                      handleSchemaChange(
                        'minLength',
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                    Max Length
                  </label>
                  <input
                    type="number"
                    value={field.schema.maxLength || ''}
                    onChange={(e) =>
                      handleSchemaChange(
                        'maxLength',
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                    Regex Pattern
                  </label>
                  <input
                    type="text"
                    value={field.schema.pattern || ''}
                    onChange={(e) => handleSchemaChange('pattern', e.target.value || undefined)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                    }}
                  />
                </div>
              </>
            )}

            {field.type === 'number' && (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                    Minimum Value
                  </label>
                  <input
                    type="number"
                    value={field.schema.minimum || ''}
                    onChange={(e) =>
                      handleSchemaChange(
                        'minimum',
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                    Maximum Value
                  </label>
                  <input
                    type="number"
                    value={field.schema.maximum || ''}
                    onChange={(e) =>
                      handleSchemaChange(
                        'maximum',
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                    }}
                  />
                </div>
              </>
            )}
          </>
        )}

        {activeTab === 'design' && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                Column Span
              </label>
              <select
                value={field.uiSchema?.['ui:columnSpan'] || 1}
                onChange={(e) => handleUiSchemaChange('ui:columnSpan', Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                }}
              >
                <option value={1}>1 Column</option>
                <option value={2}>2 Columns</option>
                <option value={3}>3 Columns</option>
                <option value={4}>4 Columns</option>
              </select>
            </div>

            <div style={{ marginTop: '1rem', borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
              <h4
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#111827',
                  marginBottom: '0.5rem',
                }}
              >
                Tailwind Classes (ui:classNames)
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={{ fontSize: '0.75rem', color: '#6b7280' }}>Input</label>
                  <input
                    type="text"
                    value={field.uiSchema?.['ui:classNames']?.input || ''}
                    onChange={(e) => handleClassNamesChange('input', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.4rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                    }}
                    placeholder="e.g. bg-gray-50 border-blue-500"
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={{ fontSize: '0.75rem', color: '#6b7280' }}>Label</label>
                  <input
                    type="text"
                    value={field.uiSchema?.['ui:classNames']?.label || ''}
                    onChange={(e) => handleClassNamesChange('label', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.4rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                    }}
                    placeholder="e.g. text-blue-600 font-bold"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
