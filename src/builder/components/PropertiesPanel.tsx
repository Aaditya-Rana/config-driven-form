import React, { useState } from 'react';
import { FieldDef } from '../types';
import {
  Settings,
  CheckCircle2,
  Paintbrush,
  LayoutTemplate,
  Palette,
  X,
  Type,
  Code2,
  List,
} from 'lucide-react';
import { FormSettings } from '../useFormBuilder';

const SIZES = [
  { value: '', label: 'Default' },
  { value: 'text-sm', label: 'Small' },
  { value: 'text-base', label: 'Medium' },
  { value: 'text-lg', label: 'Large' },
  { value: 'text-xl', label: 'Extra Large' },
  { value: 'text-2xl', label: '2XL' },
  { value: 'text-3xl', label: '3XL' },
];

const WEIGHTS = [
  { value: '', label: 'Default' },
  { value: 'font-normal', label: 'Normal' },
  { value: 'font-medium', label: 'Medium' },
  { value: 'font-bold', label: 'Bold' },
  { value: 'font-extrabold', label: 'Extra Bold' },
];

const ALIGNS = [
  { value: '', label: 'Default' },
  { value: 'text-left', label: 'Left' },
  { value: 'text-center', label: 'Center' },
  { value: 'text-right', label: 'Right' },
];

const RADII = [
  { value: '', label: 'Default' },
  { value: 'rounded-none', label: 'None' },
  { value: 'rounded-md', label: 'Medium' },
  { value: 'rounded-lg', label: 'Large' },
  { value: 'rounded-full', label: 'Full' },
];

const WIDTHS = [
  { value: '', label: 'Default' },
  { value: 'w-full', label: 'Full Width (100%)' },
  { value: 'w-1/2', label: 'Half (50%)' },
  { value: 'w-1/3', label: 'One Third (33%)' },
  { value: 'w-2/3', label: 'Two Thirds (66%)' },
  { value: 'w-1/4', label: 'One Quarter (25%)' },
];

const HEIGHTS = [
  { value: '', label: 'Default' },
  { value: 'h-8', label: 'Small' },
  { value: 'h-12', label: 'Medium' },
  { value: 'h-24', label: 'Large' },
  { value: 'h-48', label: 'Extra Large' },
  { value: 'h-full', label: 'Full Height' },
];

const extractValue = (str: string, options: { value: string }[], prefix?: string) => {
  const words = (str || '').split(' ').filter(Boolean);
  const values = options.map((opt) => opt.value).filter(Boolean);

  const exactMatch = words.find((w) => values.includes(w));
  if (exactMatch) return exactMatch;

  if (prefix) {
    const customMatch = words.find((w) => w.startsWith(prefix));
    if (customMatch) return customMatch;
  }

  return '';
};

const patchValue = (
  str: string,
  options: { value: string }[],
  newValue: string,
  prefix?: string,
) => {
  let words = (str || '').split(' ').filter(Boolean);
  const values = options.map((opt) => opt.value).filter(Boolean);

  words = words.filter((w) => {
    if (values.includes(w)) return false;
    if (prefix && w.startsWith(prefix)) return false;
    return true;
  });

  if (newValue) words.push(newValue);
  return words.join(' ');
};

const DesignSelect = ({ label, value, options, onChange }: any) => {
  const isCustom = value && !options.find((opt: any) => opt.value === value);
  const [mode, setMode] = useState<'select' | 'custom'>(isCustom ? 'custom' : 'select');

  React.useEffect(() => {
    // eslint-disable-next-line
    setMode(value && !options.find((opt: any) => opt.value === value) ? 'custom' : 'select');
  }, [value, options]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ fontSize: '0.75rem', fontWeight: 500, color: '#6b7280' }}>{label}</label>
        <button
          onClick={() => setMode(mode === 'custom' ? 'select' : 'custom')}
          style={{
            background: 'none',
            border: 'none',
            color: '#6366f1',
            fontSize: '0.7rem',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          {mode === 'custom' ? 'Use preset' : 'Custom value'}
        </button>
      </div>
      {mode === 'custom' ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. w-[350px]"
          style={{
            width: '100%',
            padding: '0.5rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
          }}
        />
      ) : (
        <select
          value={options.find((o: any) => o.value === value) ? value : ''}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
          }}
        >
          {options.map((opt: any) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

interface PropertiesPanelProps {
  field: FieldDef | null;
  formSettings: FormSettings;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<FieldDef>) => void;
  onUpdateSettings: (updates: Partial<FormSettings>) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  field: initialField,
  formSettings: initialFormSettings,
  isOpen,
  onClose,
  onUpdate: _onUpdate,
  onUpdateSettings: _onUpdateSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'validation' | 'design' | 'logic'>(
    'general',
  );
  const [themeColorMode, setThemeColorMode] = useState<'light' | 'dark'>('light');
  const [localOptions, setLocalOptions] = useState<string | null>(null);

  const [field, setField] = useState<FieldDef | null>(null);
  const [formSettings, setFormSettings] = useState<FormSettings>(initialFormSettings);

  React.useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line
      setField(initialField ? JSON.parse(JSON.stringify(initialField)) : null);
      setFormSettings(JSON.parse(JSON.stringify(initialFormSettings)));
      setLocalOptions(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialField?.id]);

  const onUpdate = (id: string, updates: Partial<FieldDef>) => {
    if (!field) return;
    setField({ ...field, ...updates });
  };

  const onUpdateSettings = (updates: Partial<FormSettings>) => {
    setFormSettings({ ...formSettings, ...updates });
  };

  const handleSave = () => {
    if (field) {
      _onUpdate(field.id, {
        key: field.key,
        schema: field.schema,
        uiSchema: field.uiSchema,
        isRequired: field.isRequired,
      });
    }
    _onUpdateSettings(formSettings);
    onClose();
  };

  if (!isOpen) return null;

  if (!field) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
        }}
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: '500px',
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
          }}
        >
          <div
            style={{
              padding: '1.5rem',
              borderBottom: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderTopLeftRadius: '0.75rem',
              borderTopRightRadius: '0.75rem',
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', margin: 0 }}>
                Global Form Settings
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0' }}>
                Configure global form behavior and styling here.
              </p>
            </div>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
            >
              <X size={20} />
            </button>
          </div>

          <div
            style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            {/* Global Content */}
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
                <Type size={16} /> Content
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 500, color: '#6b7280' }}>
                    Form Title
                  </label>
                  <input
                    type="text"
                    value={formSettings.title || ''}
                    onChange={(e) => onUpdateSettings({ title: e.target.value })}
                    placeholder="Enter form title"
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
                  <label style={{ fontSize: '0.75rem', fontWeight: 500, color: '#6b7280' }}>
                    Form Description
                  </label>
                  <textarea
                    value={formSettings.description || ''}
                    onChange={(e) => onUpdateSettings({ description: e.target.value })}
                    placeholder="Enter form description"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      minHeight: '60px',
                      resize: 'vertical',
                    }}
                  />
                </div>
              </div>
            </div>

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

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: '#6b7280',
                      display: 'block',
                      marginBottom: '0.375rem',
                    }}
                  >
                    Form Grid Columns
                  </label>
                  <select
                    value={formSettings.columns || 1}
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
                    <option value={1}>1 Column (Mobile Default)</option>
                    <option value={2}>2 Columns (Standard)</option>
                    <option value={3}>3 Columns (Wide)</option>
                    <option value={4}>4 Columns (Dashboard)</option>
                  </select>
                  <p
                    style={{
                      fontSize: '0.7rem',
                      color: '#9ca3af',
                      marginTop: '0.25rem',
                      lineHeight: 1.4,
                    }}
                  >
                    Maximum columns allowed. Fields can span across these columns.
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.375rem',
                    marginTop: '0.75rem',
                  }}
                >
                  <label style={{ fontSize: '0.75rem', fontWeight: 500, color: '#6b7280' }}>
                    Form Max Width
                  </label>
                  <select
                    value={
                      ['600px', '800px', '1000px', '100%'].includes(
                        formSettings.maxWidth || '800px',
                      )
                        ? formSettings.maxWidth || '800px'
                        : 'custom'
                    }
                    onChange={(e) => {
                      if (e.target.value !== 'custom') {
                        onUpdateSettings({ maxWidth: e.target.value });
                      } else {
                        onUpdateSettings({ maxWidth: '1200px' }); // placeholder for custom
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      marginBottom: '0.25rem',
                    }}
                  >
                    <option value="600px">Narrow (600px)</option>
                    <option value="800px">Medium (800px)</option>
                    <option value="1000px">Wide (1000px)</option>
                    <option value="100%">Full Width (100%)</option>
                    <option value="custom">Custom...</option>
                  </select>
                  {!['600px', '800px', '1000px', '100%'].includes(
                    formSettings.maxWidth || '800px',
                  ) && (
                    <input
                      type="text"
                      value={formSettings.maxWidth || '800px'}
                      onChange={(e) => onUpdateSettings({ maxWidth: e.target.value })}
                      placeholder="e.g. 75vw"
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                      }}
                    />
                  )}
                </div>

                {/* Theme Mode */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.375rem',
                    marginTop: '0.75rem',
                  }}
                >
                  <label style={{ fontSize: '0.75rem', fontWeight: 500, color: '#6b7280' }}>
                    Theme Mode
                  </label>
                  <select
                    value={formSettings.themeMode || 'system'}
                    onChange={(e) =>
                      onUpdateSettings({ themeMode: e.target.value as 'light' | 'dark' | 'system' })
                    }
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                    }}
                  >
                    <option value="system">System Default</option>
                    <option value="light">Light Mode</option>
                    <option value="dark">Dark Mode</option>
                  </select>
                </div>
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

              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setThemeColorMode('light')}
                  style={{
                    flex: 1,
                    padding: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    borderRadius: '0.25rem',
                    border: '1px solid',
                    borderColor: themeColorMode === 'light' ? '#6366f1' : '#d1d5db',
                    backgroundColor: themeColorMode === 'light' ? '#eef2ff' : 'white',
                    color: themeColorMode === 'light' ? '#4f46e5' : '#4b5563',
                    cursor: 'pointer',
                  }}
                >
                  Light Mode
                </button>
                <button
                  type="button"
                  onClick={() => setThemeColorMode('dark')}
                  style={{
                    flex: 1,
                    padding: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    borderRadius: '0.25rem',
                    border: '1px solid',
                    borderColor: themeColorMode === 'dark' ? '#6366f1' : '#d1d5db',
                    backgroundColor: themeColorMode === 'dark' ? '#eef2ff' : 'white',
                    color: themeColorMode === 'dark' ? '#4f46e5' : '#4b5563',
                    cursor: 'pointer',
                  }}
                >
                  Dark Mode
                </button>
              </div>

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
                      value={
                        (themeColorMode === 'light'
                          ? formSettings.theme.light?.primary
                          : formSettings.theme.dark?.primary) ||
                        formSettings.theme.primary ||
                        '#6366f1'
                      }
                      onChange={(e) =>
                        onUpdateSettings({
                          theme: {
                            ...formSettings.theme,
                            [themeColorMode]: {
                              ...(formSettings.theme[themeColorMode] || {}),
                              primary: e.target.value,
                            },
                          },
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
                      value={
                        (themeColorMode === 'light'
                          ? formSettings.theme.light?.primary
                          : formSettings.theme.dark?.primary) ||
                        formSettings.theme.primary ||
                        ''
                      }
                      placeholder="#6366f1"
                      onChange={(e) =>
                        onUpdateSettings({
                          theme: {
                            ...formSettings.theme,
                            [themeColorMode]: {
                              ...(formSettings.theme[themeColorMode] || {}),
                              primary: e.target.value,
                            },
                          },
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
                      value={
                        (themeColorMode === 'light'
                          ? formSettings.theme.light?.background
                          : formSettings.theme.dark?.background) ||
                        formSettings.theme.background ||
                        '#ffffff'
                      }
                      onChange={(e) =>
                        onUpdateSettings({
                          theme: {
                            ...formSettings.theme,
                            [themeColorMode]: {
                              ...(formSettings.theme[themeColorMode] || {}),
                              background: e.target.value,
                            },
                          },
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
                      value={
                        (themeColorMode === 'light'
                          ? formSettings.theme.light?.background
                          : formSettings.theme.dark?.background) ||
                        formSettings.theme.background ||
                        ''
                      }
                      placeholder="#ffffff"
                      onChange={(e) =>
                        onUpdateSettings({
                          theme: {
                            ...formSettings.theme,
                            [themeColorMode]: {
                              ...(formSettings.theme[themeColorMode] || {}),
                              background: e.target.value,
                            },
                          },
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
                    Surface Color (Fields)
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="color"
                      value={
                        (themeColorMode === 'light'
                          ? formSettings.theme.light?.surface
                          : formSettings.theme.dark?.surface) ||
                        formSettings.theme.surface ||
                        '#ffffff'
                      }
                      onChange={(e) =>
                        onUpdateSettings({
                          theme: {
                            ...formSettings.theme,
                            [themeColorMode]: {
                              ...(formSettings.theme[themeColorMode] || {}),
                              surface: e.target.value,
                            },
                          },
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
                      value={
                        (themeColorMode === 'light'
                          ? formSettings.theme.light?.surface
                          : formSettings.theme.dark?.surface) ||
                        formSettings.theme.surface ||
                        ''
                      }
                      placeholder="#ffffff"
                      onChange={(e) =>
                        onUpdateSettings({
                          theme: {
                            ...formSettings.theme,
                            [themeColorMode]: {
                              ...(formSettings.theme[themeColorMode] || {}),
                              surface: e.target.value,
                            },
                          },
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
                    Text Color
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="color"
                      value={
                        (themeColorMode === 'light'
                          ? formSettings.theme.light?.text
                          : formSettings.theme.dark?.text) ||
                        formSettings.theme.text ||
                        '#000000'
                      }
                      onChange={(e) =>
                        onUpdateSettings({
                          theme: {
                            ...formSettings.theme,
                            [themeColorMode]: {
                              ...(formSettings.theme[themeColorMode] || {}),
                              text: e.target.value,
                            },
                          },
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
                      value={
                        (themeColorMode === 'light'
                          ? formSettings.theme.light?.text
                          : formSettings.theme.dark?.text) ||
                        formSettings.theme.text ||
                        ''
                      }
                      placeholder="#000000"
                      onChange={(e) =>
                        onUpdateSettings({
                          theme: {
                            ...formSettings.theme,
                            [themeColorMode]: {
                              ...(formSettings.theme[themeColorMode] || {}),
                              text: e.target.value,
                            },
                          },
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
                    marginTop: '0.5rem',
                  }}
                >
                  <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#4b5563' }}>
                    Border Radius
                  </label>
                  <select
                    value={formSettings.theme.radius || '0.75rem'}
                    onChange={(e) =>
                      onUpdateSettings({
                        theme: { ...formSettings.theme, radius: e.target.value },
                      })
                    }
                    style={{
                      width: '120px',
                      padding: '0.25rem 0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                    }}
                  >
                    <option value="0">None</option>
                    <option value="0.25rem">Small</option>
                    <option value="0.5rem">Medium</option>
                    <option value="0.75rem">Large</option>
                    <option value="1.5rem">Extra Large</option>
                    <option value="9999px">Full (Pill)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Global Typography Settings */}
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
                <Type size={16} /> Typography
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ borderLeft: '2px solid #e5e7eb', paddingLeft: '0.75rem' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#4b5563',
                      marginBottom: '0.5rem',
                      display: 'block',
                    }}
                  >
                    Form Title
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <DesignSelect
                      label="Size"
                      value={extractValue(formSettings.classNames?.title || '', SIZES)}
                      options={SIZES}
                      onChange={(val: string) => {
                        const current = formSettings.classNames?.title || '';
                        onUpdateSettings({
                          classNames: {
                            ...formSettings.classNames,
                            title: patchValue(current, SIZES, val),
                          },
                        });
                      }}
                    />
                    <DesignSelect
                      label="Weight"
                      value={extractValue(formSettings.classNames?.title || '', WEIGHTS)}
                      options={WEIGHTS}
                      onChange={(val: string) => {
                        const current = formSettings.classNames?.title || '';
                        onUpdateSettings({
                          classNames: {
                            ...formSettings.classNames,
                            title: patchValue(current, WEIGHTS, val),
                          },
                        });
                      }}
                    />
                    <DesignSelect
                      label="Alignment"
                      value={extractValue(formSettings.classNames?.title || '', ALIGNS)}
                      options={ALIGNS}
                      onChange={(val: string) => {
                        const current = formSettings.classNames?.title || '';
                        onUpdateSettings({
                          classNames: {
                            ...formSettings.classNames,
                            title: patchValue(current, ALIGNS, val),
                          },
                        });
                      }}
                    />
                  </div>
                </div>

                <div style={{ borderLeft: '2px solid #e5e7eb', paddingLeft: '0.75rem' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#4b5563',
                      marginBottom: '0.5rem',
                      display: 'block',
                    }}
                  >
                    Form Description
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <DesignSelect
                      label="Size"
                      value={extractValue(formSettings.classNames?.description || '', SIZES)}
                      options={SIZES}
                      onChange={(val: string) => {
                        const current = formSettings.classNames?.description || '';
                        onUpdateSettings({
                          classNames: {
                            ...formSettings.classNames,
                            description: patchValue(current, SIZES, val),
                          },
                        });
                      }}
                    />
                    <DesignSelect
                      label="Alignment"
                      value={extractValue(formSettings.classNames?.description || '', ALIGNS)}
                      options={ALIGNS}
                      onChange={(val: string) => {
                        const current = formSettings.classNames?.description || '';
                        onUpdateSettings({
                          classNames: {
                            ...formSettings.classNames,
                            description: patchValue(current, ALIGNS, val),
                          },
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button Settings */}
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
                <CheckCircle2 size={16} /> Submit Button
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 500, color: '#6b7280' }}>
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={formSettings.submitButtonText ?? 'Submit'}
                    onChange={(e) => onUpdateSettings({ submitButtonText: e.target.value })}
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
                  <label style={{ fontSize: '0.75rem', fontWeight: 500, color: '#6b7280' }}>
                    Button Alignment
                  </label>
                  <select
                    value={formSettings.submitButtonAlign || 'full'}
                    onChange={(e) => onUpdateSettings({ submitButtonAlign: e.target.value as any })}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                    }}
                  >
                    <option value="full">Full Width</option>
                    <option value="left">Left Align</option>
                    <option value="center">Center Align</option>
                    <option value="right">Right Align</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Save / Cancel Footer for Global Settings */}
          <div
            style={{
              padding: '1rem 1.5rem',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              backgroundColor: '#f9fafb',
              borderBottomLeftRadius: '0.75rem',
              borderBottomRightRadius: '0.75rem',
            }}
          >
            <button
              onClick={onClose}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: '1px solid #d1d5db',
                backgroundColor: 'white',
                color: '#374151',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: 'none',
                backgroundColor: '#6366f1',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              }}
            >
              Save Settings
            </button>
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

  const handleErrorMessageChange = (errorKey: string, message: string) => {
    const currentMessages = (
      typeof field.schema.errorMessage === 'object' ? field.schema.errorMessage : {}
    ) as Record<string, string>;

    const newMessages = { ...currentMessages };
    if (!message) {
      delete newMessages[errorKey];
    } else {
      newMessages[errorKey] = message;
    }

    handleSchemaChange(
      'errorMessage',
      Object.keys(newMessages).length > 0 ? newMessages : undefined,
    );
  };

  const getErrorMessage = (errorKey: string) => {
    if (typeof field.schema.errorMessage === 'object') {
      return field.schema.errorMessage[errorKey] || '';
    }
    return '';
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '500px',
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ padding: '1.5rem 1.5rem 0', borderBottom: '1px solid #e5e7eb' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', margin: 0 }}>
              Field Settings
            </h3>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
            >
              <X size={20} />
            </button>
          </div>

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
            <button
              onClick={() => setActiveTab('logic')}
              style={{
                flex: 1,
                padding: '0.75rem 0',
                fontSize: '0.875rem',
                fontWeight: 500,
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: `2px solid ${activeTab === 'logic' ? '#6366f1' : 'transparent'}`,
                color: activeTab === 'logic' ? '#6366f1' : '#6b7280',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.25rem',
              }}
            >
              <List size={14} /> Logic
            </button>
          </div>
        </div>

        <div
          style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
        >
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
              {(field.type === 'select' ||
                field.type === 'radio' ||
                field.type === 'checkboxes') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                    Options (One per line)
                  </label>
                  <textarea
                    value={
                      localOptions !== null
                        ? localOptions
                        : field.type === 'checkboxes'
                          ? field.schema.items && !Array.isArray(field.schema.items)
                            ? field.schema.items.enum?.join('\n')
                            : ''
                          : field.schema.enum?.join('\n') || ''
                    }
                    onChange={(e) => setLocalOptions(e.target.value)}
                    onBlur={() => {
                      const currentVal =
                        localOptions !== null
                          ? localOptions
                          : field.type === 'checkboxes'
                            ? field.schema.items && !Array.isArray(field.schema.items)
                              ? field.schema.items.enum?.join('\n')
                              : ''
                            : field.schema.enum?.join('\n') || '';

                      const valArray = (currentVal || '')
                        .split('\n')
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

                      // Re-sync to formatted
                      setLocalOptions(valArray.join('\n'));
                    }}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      minHeight: '120px',
                      fontFamily: 'inherit',
                    }}
                    placeholder="Option 1&#10;Option 2&#10;Option 3"
                  />
                </div>
              )}
            </>
          )}

          {activeTab === 'validation' && (
            <>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.375rem',
                  marginBottom: '1rem',
                  borderBottom: '1px solid #e5e7eb',
                  paddingBottom: '1rem',
                }}
              >
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
                {field.isRequired && (
                  <input
                    type="text"
                    placeholder="Custom required error message"
                    value={getErrorMessage('required')}
                    onChange={(e) => handleErrorMessageChange('required', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.4rem',
                      border: '1px dashed #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.75rem',
                      marginTop: '0.25rem',
                      backgroundColor: '#f9fafb',
                    }}
                  />
                )}
              </div>

              {(field.type === 'text' || field.type === 'email' || field.type === 'password') && (
                <>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.375rem',
                      marginBottom: '0.5rem',
                    }}
                  >
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
                    {field.schema.minLength !== undefined && (
                      <input
                        type="text"
                        placeholder="Custom error message"
                        value={getErrorMessage('minLength')}
                        onChange={(e) => handleErrorMessageChange('minLength', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.4rem',
                          border: '1px dashed #d1d5db',
                          borderRadius: '0.375rem',
                          fontSize: '0.75rem',
                          backgroundColor: '#f9fafb',
                        }}
                      />
                    )}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.375rem',
                      marginBottom: '0.5rem',
                    }}
                  >
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
                    {field.schema.maxLength !== undefined && (
                      <input
                        type="text"
                        placeholder="Custom error message"
                        value={getErrorMessage('maxLength')}
                        onChange={(e) => handleErrorMessageChange('maxLength', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.4rem',
                          border: '1px dashed #d1d5db',
                          borderRadius: '0.375rem',
                          fontSize: '0.75rem',
                          backgroundColor: '#f9fafb',
                        }}
                      />
                    )}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.375rem',
                      marginBottom: '0.5rem',
                    }}
                  >
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
                    {field.schema.pattern !== undefined && (
                      <input
                        type="text"
                        placeholder="Custom error message"
                        value={getErrorMessage('pattern')}
                        onChange={(e) => handleErrorMessageChange('pattern', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.4rem',
                          border: '1px dashed #d1d5db',
                          borderRadius: '0.375rem',
                          fontSize: '0.75rem',
                          backgroundColor: '#f9fafb',
                        }}
                      />
                    )}
                  </div>
                </>
              )}

              {field.type === 'number' && (
                <>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.375rem',
                      marginBottom: '0.5rem',
                    }}
                  >
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
                    {field.schema.minimum !== undefined && (
                      <input
                        type="text"
                        placeholder="Custom error message"
                        value={getErrorMessage('minimum')}
                        onChange={(e) => handleErrorMessageChange('minimum', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.4rem',
                          border: '1px dashed #d1d5db',
                          borderRadius: '0.375rem',
                          fontSize: '0.75rem',
                          backgroundColor: '#f9fafb',
                        }}
                      />
                    )}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.375rem',
                      marginBottom: '0.5rem',
                    }}
                  >
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
                    {field.schema.maximum !== undefined && (
                      <input
                        type="text"
                        placeholder="Custom error message"
                        value={getErrorMessage('maximum')}
                        onChange={(e) => handleErrorMessageChange('maximum', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.4rem',
                          border: '1px dashed #d1d5db',
                          borderRadius: '0.375rem',
                          fontSize: '0.75rem',
                          backgroundColor: '#f9fafb',
                        }}
                      />
                    )}
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
                  {formSettings.columns >= 2 && <option value={2}>2 Columns</option>}
                  {formSettings.columns >= 3 && <option value={3}>3 Columns</option>}
                  {formSettings.columns >= 4 && <option value={4}>4 Columns</option>}
                </select>
              </div>

              <div
                style={{ marginTop: '1rem', borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}
              >
                <h4
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#111827',
                    marginBottom: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                  }}
                >
                  <Type size={16} /> Typography
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ borderLeft: '2px solid #e5e7eb', paddingLeft: '0.75rem' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#4b5563',
                        marginBottom: '0.5rem',
                        display: 'block',
                      }}
                    >
                      Field Label
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <DesignSelect
                        label="Size"
                        value={extractValue(
                          field.uiSchema?.['ui:classNames']?.label || '',
                          SIZES,
                          'text-',
                        )}
                        options={SIZES}
                        onChange={(val: string) => {
                          const current = field.uiSchema?.['ui:classNames']?.label || '';
                          handleClassNamesChange('label', patchValue(current, SIZES, val, 'text-'));
                        }}
                      />
                      <DesignSelect
                        label="Weight"
                        value={extractValue(
                          field.uiSchema?.['ui:classNames']?.label || '',
                          WEIGHTS,
                          'font-',
                        )}
                        options={WEIGHTS}
                        onChange={(val: string) => {
                          const current = field.uiSchema?.['ui:classNames']?.label || '';
                          handleClassNamesChange(
                            'label',
                            patchValue(current, WEIGHTS, val, 'font-'),
                          );
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ borderLeft: '2px solid #e5e7eb', paddingLeft: '0.75rem' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#4b5563',
                        marginBottom: '0.5rem',
                        display: 'block',
                      }}
                    >
                      Input Field
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <DesignSelect
                        label="Size"
                        value={extractValue(
                          field.uiSchema?.['ui:classNames']?.input || '',
                          SIZES,
                          'text-',
                        )}
                        options={SIZES}
                        onChange={(val: string) => {
                          const current = field.uiSchema?.['ui:classNames']?.input || '';
                          handleClassNamesChange('input', patchValue(current, SIZES, val, 'text-'));
                        }}
                      />
                      <DesignSelect
                        label="Weight"
                        value={extractValue(
                          field.uiSchema?.['ui:classNames']?.input || '',
                          WEIGHTS,
                          'font-',
                        )}
                        options={WEIGHTS}
                        onChange={(val: string) => {
                          const current = field.uiSchema?.['ui:classNames']?.input || '';
                          handleClassNamesChange(
                            'input',
                            patchValue(current, WEIGHTS, val, 'font-'),
                          );
                        }}
                      />
                      <DesignSelect
                        label="Border Radius"
                        value={extractValue(
                          field.uiSchema?.['ui:classNames']?.input || '',
                          RADII,
                          'rounded-',
                        )}
                        options={RADII}
                        onChange={(val: string) => {
                          const current = field.uiSchema?.['ui:classNames']?.input || '';
                          handleClassNamesChange(
                            'input',
                            patchValue(current, RADII, val, 'rounded-'),
                          );
                        }}
                      />
                      <DesignSelect
                        label="Width"
                        value={extractValue(
                          field.uiSchema?.['ui:classNames']?.input || '',
                          WIDTHS,
                          'w-',
                        )}
                        options={WIDTHS}
                        onChange={(val: string) => {
                          const current = field.uiSchema?.['ui:classNames']?.input || '';
                          handleClassNamesChange('input', patchValue(current, WIDTHS, val, 'w-'));
                        }}
                      />
                      <DesignSelect
                        label="Height"
                        value={extractValue(
                          field.uiSchema?.['ui:classNames']?.input || '',
                          HEIGHTS,
                          'h-',
                        )}
                        options={HEIGHTS}
                        onChange={(val: string) => {
                          const current = field.uiSchema?.['ui:classNames']?.input || '';
                          handleClassNamesChange('input', patchValue(current, HEIGHTS, val, 'h-'));
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{ marginTop: '1rem', borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}
              >
                <h4
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#111827',
                    marginBottom: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                  }}
                >
                  <Code2 size={16} /> Advanced (Custom CSS)
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

          {activeTab === 'logic' && (
            <div
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
            >
              <div>
                <h4
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#111827',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <List size={16} /> Conditional Logic
                </h4>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
                  Show or hide this field based on the value of another field.
                </p>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    padding: '1rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    backgroundColor: '#f9fafb',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      id="enable-condition"
                      checked={!!field.uiSchema?.['ui:condition']}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleUiSchemaChange('ui:condition', {
                            targetField: '',
                            operator: 'is',
                            expectedValue: '',
                          });
                        } else {
                          handleUiSchemaChange('ui:condition', undefined);
                        }
                      }}
                    />
                    <label
                      htmlFor="enable-condition"
                      style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}
                    >
                      Enable Conditional Logic
                    </label>
                  </div>

                  {field.uiSchema?.['ui:condition'] && (
                    <>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 500, color: '#6b7280' }}>
                          Target Field (Key)
                        </label>
                        <input
                          type="text"
                          value={field.uiSchema['ui:condition'].targetField || ''}
                          onChange={(e) =>
                            handleUiSchemaChange('ui:condition', {
                              ...field.uiSchema?.['ui:condition'],
                              targetField: e.target.value,
                            })
                          }
                          placeholder="e.g. newsletter"
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
                        <label style={{ fontSize: '0.75rem', fontWeight: 500, color: '#6b7280' }}>
                          Operator
                        </label>
                        <select
                          value={field.uiSchema['ui:condition'].operator || 'is'}
                          onChange={(e) =>
                            handleUiSchemaChange('ui:condition', {
                              ...field.uiSchema?.['ui:condition'],
                              operator: e.target.value,
                            })
                          }
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                          }}
                        >
                          <option value="is">Is (Equals)</option>
                          <option value="isNot">Is Not</option>
                          <option value="contains">Contains</option>
                          <option value="doesNotContain">Does Not Contain</option>
                          <option value="isEmpty">Is Empty</option>
                          <option value="isNotEmpty">Is Not Empty</option>
                          <option value="gt">Greater Than</option>
                          <option value="lt">Less Than</option>
                        </select>
                      </div>

                      {!['isEmpty', 'isNotEmpty'].includes(
                        field.uiSchema['ui:condition'].operator,
                      ) && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 500, color: '#6b7280' }}>
                            Expected Value
                          </label>
                          <input
                            type="text"
                            value={field.uiSchema['ui:condition'].expectedValue || ''}
                            onChange={(e) =>
                              handleUiSchemaChange('ui:condition', {
                                ...field.uiSchema?.['ui:condition'],
                                expectedValue: e.target.value,
                              })
                            }
                            placeholder="Value to match"
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
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Save / Cancel Footer */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            backgroundColor: '#f9fafb',
            borderBottomLeftRadius: '0.75rem',
            borderBottomRightRadius: '0.75rem',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: '1px solid #d1d5db',
              backgroundColor: 'white',
              color: '#374151',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: 'none',
              backgroundColor: '#6366f1',
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            }}
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
