import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { JSONSchema, UISchema } from '../types/schema';
import { useFormBuilder, FormSettings } from './useFormBuilder';
import { Toolbox } from './components/Toolbox';
import { Canvas } from './components/Canvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import { BuilderFieldType, CustomFieldDef, FIELD_TEMPLATES } from './types';
import { Save, Code2, Eye, LayoutTemplate, Settings } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { SchemaForm } from '../components/SchemaForm';
import { FieldRenderer } from '../components/FieldRenderer';
import '../styles/form.css'; // Ensure base form styles are loaded for canvas

export interface FormBuilderProps {
  initialSchema?: JSONSchema;
  initialUiSchema?: Record<string, UISchema>;
  initialColumns?: 1 | 2 | 3 | 4;
  initialTheme?: FormSettings['theme'];
  onSave?: (
    schema: JSONSchema,
    uiSchema: Record<string, UISchema>,
    formSettings: FormSettings,
  ) => void;
  customFields?: CustomFieldDef[];
  onCustomFieldsChange?: (fields: CustomFieldDef[]) => void;
}

export const FormBuilder: React.FC<FormBuilderProps> = ({
  initialSchema,
  initialUiSchema,
  initialColumns,
  initialTheme,
  onSave,
  customFields: propCustomFields,
  onCustomFieldsChange,
}) => {
  const {
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
  } = useFormBuilder(initialSchema, initialUiSchema, initialColumns, initialTheme);

  const [activeDragType, setActiveDragType] = useState<BuilderFieldType | null>(null);
  const [activeSortableField, setActiveSortableField] = useState<any | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isPropertiesDialogOpen, setIsPropertiesDialogOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const [localCustomFields, setLocalCustomFields] = useState<CustomFieldDef[]>([]);
  const customFields = propCustomFields !== undefined ? propCustomFields : localCustomFields;
  const setCustomFields = onCustomFieldsChange || setLocalCustomFields;

  const [saveAsCustomFieldData, setSaveAsCustomFieldData] = useState<any | null>(null);
  const [customFieldNameInput, setCustomFieldNameInput] = useState('');

  const [createCustomFieldModalOpen, setCreateCustomFieldModalOpen] = useState(false);
  const [createCustomFieldBaseType, setCreateCustomFieldBaseType] =
    useState<BuilderFieldType>('text');
  const [editingCustomFieldId, setEditingCustomFieldId] = useState<string | null>(null);

  const editingCustomField = React.useMemo(
    () => customFields.find((f) => f.id === editingCustomFieldId),
    [customFields, editingCustomFieldId],
  );
  const customFieldToEdit = React.useMemo(() => {
    if (!editingCustomField) return null;
    return {
      id: editingCustomField.id,
      key: editingCustomField.id,
      type: editingCustomField.type as BuilderFieldType,
      schema: { ...editingCustomField.schema, title: editingCustomField.title },
      uiSchema: editingCustomField.uiSchema,
      isRequired: false,
    };
  }, [editingCustomField]);

  const maxStep = React.useMemo(() => {
    return fields.reduce((max, field) => {
      const step = field.uiSchema?.['ui:step'] || 0;
      return Math.max(max, step);
    }, 0);
  }, [fields]);

  // Dummy form methods for the drag overlay
  const methods = useForm();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === 'ToolboxItem') {
      setActiveDragType(active.data.current.fieldType);
    } else if (active.data.current?.type === 'SortableField') {
      setActiveSortableField(active.data.current.field);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragType(null);
    setActiveSortableField(null);

    if (!over) return;

    if (active.data.current?.type === 'ToolboxItem') {
      // Dropping a new field from the toolbox onto the canvas
      if (over.id === 'canvas-droppable' || fields.find((f) => f.id === over.id)) {
        // If dropped on an existing item, insert at that index. Otherwise append.
        const overIndex = fields.findIndex((f) => f.id === over.id);
        addField(
          active.data.current.fieldType as BuilderFieldType,
          overIndex >= 0 ? overIndex : undefined,
          activeStep,
          active.data.current.customField,
        );
      }
      return;
    }

    if (active.data.current?.type === 'SortableField' && active.id !== over.id) {
      // Reordering fields within the canvas
      reorderFields(active.id as string, over.id as string);
    }
  };

  const handleSave = () => {
    if (onSave) {
      const { schema, uiSchema } = compileSchemas();
      onSave(schema, uiSchema, formSettings);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* Top Bar */}
      <div className="cdf-builder-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#6366f1',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            <Code2 size={20} />
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: 0 }}>
            Visual Form Builder
          </h1>
        </div>

        {/* Mode Toggle */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#f3f4f6',
            padding: '0.25rem',
            borderRadius: '0.5rem',
          }}
        >
          <button
            onClick={() => setIsPreviewMode(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.375rem 0.75rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: !isPreviewMode ? 'white' : 'transparent',
              color: !isPreviewMode ? '#111827' : '#6b7280',
              boxShadow: !isPreviewMode ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            <LayoutTemplate size={16} /> Builder
          </button>
          <button
            onClick={() => setIsPreviewMode(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.375rem 0.75rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: isPreviewMode ? 'white' : 'transparent',
              color: isPreviewMode ? '#111827' : '#6b7280',
              boxShadow: isPreviewMode ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            <Eye size={16} /> Preview
          </button>
        </div>

        {isPreviewMode && (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div
              style={{
                display: 'flex',
                gap: '0.25rem',
                backgroundColor: '#f3f4f6',
                padding: '0.25rem',
                borderRadius: '0.5rem',
              }}
            >
              {(['desktop', 'tablet', 'mobile'] as const).map((device) => (
                <button
                  key={device}
                  onClick={() => setPreviewDevice(device)}
                  style={{
                    padding: '0.25rem 0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    transition: 'all 0.2s',
                    backgroundColor: previewDevice === device ? 'white' : 'transparent',
                    color: previewDevice === device ? '#111827' : '#6b7280',
                    boxShadow: previewDevice === device ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                  }}
                >
                  {device}
                </button>
              ))}
            </div>

            <div
              style={{
                display: 'flex',
                gap: '0.25rem',
                backgroundColor: '#f3f4f6',
                padding: '0.25rem',
                borderRadius: '0.5rem',
              }}
            >
              {(['light', 'dark', 'system'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => updateFormSettings({ themeMode: mode })}
                  style={{
                    padding: '0.25rem 0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    transition: 'all 0.2s',
                    backgroundColor:
                      (formSettings.themeMode || 'system') === mode ? 'white' : 'transparent',
                    color: (formSettings.themeMode || 'system') === mode ? '#111827' : '#6b7280',
                    boxShadow:
                      (formSettings.themeMode || 'system') === mode
                        ? '0 1px 2px rgba(0,0,0,0.05)'
                        : 'none',
                  }}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="cdf-topbar-action"
            onClick={() => {
              setSelectedFieldId(null);
              setIsPropertiesDialogOpen(true);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'white',
              color: '#374151',
              border: '1px solid #d1d5db',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
          >
            <Settings size={16} /> <span>Global Settings</span>
          </button>
          <button
            className="cdf-topbar-action"
            onClick={handleSave}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#6366f1',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4f46e5')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#6366f1')}
          >
            <Save size={16} /> <span>Save Form</span>
          </button>
        </div>
      </div>

      {/* Main Area */}
      <div className="cdf-builder-main">
        {isPreviewMode ? (
          <div
            style={{
              flex: 1,
              padding: '3rem',
              overflowY: 'auto',
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth:
                  previewDevice === 'mobile'
                    ? '375px'
                    : previewDevice === 'tablet'
                      ? '768px'
                      : formSettings.maxWidth || '800px',
                transition: 'all 0.3s ease',
                margin: '0 auto',
                border: previewDevice !== 'desktop' ? '12px solid #1f2937' : 'none',
                borderTopWidth: previewDevice !== 'desktop' ? '40px' : 'none',
                borderBottomWidth: previewDevice !== 'desktop' ? '40px' : 'none',
                borderRadius: previewDevice !== 'desktop' ? '2.5rem' : '0',
                backgroundColor:
                  previewDevice !== 'desktop'
                    ? formSettings.themeMode === 'dark'
                      ? '#1e293b'
                      : 'white'
                    : 'transparent',
                overflow: 'hidden',
              }}
            >
              <SchemaForm
                schema={compileSchemas().schema}
                uiSchema={compileSchemas().uiSchema}
                columns={formSettings.columns}
                theme={formSettings.theme}
                themeMode={formSettings.themeMode}
                classNames={formSettings.classNames}
                submitButtonText={formSettings.submitButtonText}
                submitButtonAlign={formSettings.submitButtonAlign}
                onSubmit={(data) =>
                  alert('Preview Form Submitted!\n\n' + JSON.stringify(data, null, 2))
                }
              />
            </div>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {/* Left: Toolbox */}
            <Toolbox
              customFields={customFields}
              onAddField={(type, customTemplate) =>
                addField(type, undefined, activeStep, customTemplate)
              }
              onCreateCustomField={() => {
                setCustomFieldNameInput('');
                setCreateCustomFieldBaseType('text');
                setCreateCustomFieldModalOpen(true);
              }}
              onEditCustomField={(id) => setEditingCustomFieldId(id)}
              onRemoveCustomField={(id) => setCustomFields(customFields.filter((f) => f.id !== id))}
            />

            {/* Center: Canvas and Tabs */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#f3f4f6',
                padding: '2rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginBottom: '1rem',
                  overflowX: 'auto',
                  paddingBottom: '0.5rem',
                }}
              >
                {Array.from({ length: maxStep + 1 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveStep(i)}
                    style={{
                      padding: '0.5rem 1.5rem',
                      borderRadius: '9999px',
                      border: '1px solid',
                      borderColor: activeStep === i ? '#6366f1' : '#d1d5db',
                      backgroundColor: activeStep === i ? '#eef2ff' : 'white',
                      color: activeStep === i ? '#4f46e5' : '#4b5563',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Step {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setActiveStep(maxStep + 1)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '9999px',
                    border: '1px dashed #9ca3af',
                    backgroundColor: 'transparent',
                    color: '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                  }}
                >
                  + Add Step
                </button>
              </div>

              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: 'white',
                  borderRadius: '1rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden',
                }}
              >
                <Canvas
                  fields={fields.filter((f) => (f.uiSchema?.['ui:step'] || 0) === activeStep)}
                  schema={compileSchemas().schema}
                  formSettings={formSettings}
                  globalColumns={formSettings.columns}
                  theme={formSettings.theme}
                  selectedFieldId={selectedFieldId}
                  onSelectField={setSelectedFieldId}
                  onRemoveField={removeField}
                  onDuplicateField={(f) => {
                    const idx = fields.findIndex((field) => field.id === f.id);
                    addField(f.type, idx + 1, activeStep);
                  }}
                  onEditField={(id) => {
                    setSelectedFieldId(id);
                    setIsPropertiesDialogOpen(true);
                  }}
                  onUpdateColumnSpan={(id, span) => {
                    const f = fields.find((field) => field.id === id);
                    if (f) {
                      updateField(id, {
                        uiSchema: { ...(f.uiSchema || {}), 'ui:columnSpan': span },
                      });
                    }
                  }}
                />
              </div>
            </div>

            {/* Drag Overlay (Visual feedback when dragging) */}
            <DragOverlay dropAnimation={null}>
              {activeDragType ? (
                <div
                  style={{
                    padding: '0.75rem',
                    backgroundColor: '#6366f1',
                    color: 'white',
                    borderRadius: '0.5rem',
                    opacity: 0.8,
                    fontWeight: 500,
                  }}
                >
                  Dropping {activeDragType}...
                </div>
              ) : activeSortableField ? (
                <div
                  style={{
                    padding: '1.5rem 1rem 1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '0.75rem',
                    border: '2px solid #6366f1',
                    boxShadow:
                      '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
                    transform: 'scale(1.02)',
                    opacity: 0.9,
                    cursor: 'grabbing',
                  }}
                >
                  <FormProvider {...methods}>
                    <form>
                      <FieldRenderer
                        name={activeSortableField.key}
                        schema={activeSortableField.schema}
                        uiSchema={activeSortableField.uiSchema}
                        isRequired={activeSortableField.isRequired}
                      />
                    </form>
                  </FormProvider>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}

        {/* Modal Dialog Properties */}
        <PropertiesPanel
          field={editingCustomFieldId ? customFieldToEdit : selectedField || null}
          formSettings={formSettings}
          isOpen={isPropertiesDialogOpen || !!editingCustomFieldId}
          onClose={() => {
            setIsPropertiesDialogOpen(false);
            setEditingCustomFieldId(null);
          }}
          onUpdate={(id, updates) => {
            if (editingCustomFieldId) {
              setCustomFields(
                customFields.map((cf) =>
                  cf.id === id
                    ? {
                        ...cf,
                        title: updates.schema?.title || cf.title,
                        schema: updates.schema || cf.schema,
                        uiSchema: updates.uiSchema || cf.uiSchema,
                      }
                    : cf,
                ),
              );
            } else {
              updateField(id, updates);
            }
          }}
          onUpdateSettings={updateFormSettings}
          onSaveAsCustomField={(field) => {
            setSaveAsCustomFieldData(field);
            setCustomFieldNameInput(field.schema.title || 'Custom Field');
          }}
        />

        {/* Save as Custom Field Modal */}
        {saveAsCustomFieldData && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
            }}
            onClick={() => setSaveAsCustomFieldData(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '400px',
                backgroundColor: 'white',
                borderRadius: '0.75rem',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                padding: '1.5rem',
              }}
            >
              <h3
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#111827',
                  margin: '0 0 1rem 0',
                }}
              >
                Save as Reusable Field
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '1rem' }}>
                Enter a name for this custom field. It will be available in the toolbox for future
                use.
              </p>
              <input
                type="text"
                value={customFieldNameInput}
                onChange={(e) => setCustomFieldNameInput(e.target.value)}
                autoFocus
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  marginBottom: '1.5rem',
                  boxSizing: 'border-box',
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && customFieldNameInput.trim()) {
                    const newCustomField: CustomFieldDef = {
                      id: `custom_${Date.now()}`,
                      title: customFieldNameInput.trim(),
                      type: saveAsCustomFieldData.type,
                      schema: saveAsCustomFieldData.schema,
                      uiSchema: saveAsCustomFieldData.uiSchema,
                    };
                    setCustomFields([...customFields, newCustomField]);
                    setSaveAsCustomFieldData(null);
                  }
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  onClick={() => setSaveAsCustomFieldData(null)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    color: '#374151',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  disabled={!customFieldNameInput.trim()}
                  onClick={() => {
                    if (customFieldNameInput.trim()) {
                      const newCustomField: CustomFieldDef = {
                        id: `custom_${Date.now()}`,
                        title: customFieldNameInput.trim(),
                        type: saveAsCustomFieldData.type,
                        schema: saveAsCustomFieldData.schema,
                        uiSchema: saveAsCustomFieldData.uiSchema,
                      };
                      setCustomFields([...customFields, newCustomField]);
                      setSaveAsCustomFieldData(null);
                    }
                  }}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#6366f1',
                    border: 'none',
                    borderRadius: '0.375rem',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: customFieldNameInput.trim() ? 'pointer' : 'not-allowed',
                    opacity: customFieldNameInput.trim() ? 1 : 0.5,
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Custom Field Modal */}
        {createCustomFieldModalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
            }}
            onClick={() => setCreateCustomFieldModalOpen(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '400px',
                backgroundColor: 'white',
                borderRadius: '0.75rem',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                padding: '1.5rem',
              }}
            >
              <h3
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#111827',
                  margin: '0 0 1rem 0',
                }}
              >
                Create Custom Field
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '1rem' }}>
                Configure a new reusable field from scratch.
              </p>

              <label
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#374151',
                  marginBottom: '0.5rem',
                }}
              >
                Field Name
              </label>
              <input
                type="text"
                value={customFieldNameInput}
                onChange={(e) => setCustomFieldNameInput(e.target.value)}
                autoFocus
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  marginBottom: '1rem',
                  boxSizing: 'border-box',
                }}
              />

              <label
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#374151',
                  marginBottom: '0.5rem',
                }}
              >
                Base Type
              </label>
              <select
                value={createCustomFieldBaseType}
                onChange={(e) => setCreateCustomFieldBaseType(e.target.value as BuilderFieldType)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  marginBottom: '1.5rem',
                  boxSizing: 'border-box',
                }}
              >
                {Object.keys(FIELD_TEMPLATES).map((type) => (
                  <option key={type} value={type}>
                    {FIELD_TEMPLATES[type as BuilderFieldType].schema.title || type}
                  </option>
                ))}
              </select>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  onClick={() => setCreateCustomFieldModalOpen(false)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    color: '#374151',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  disabled={!customFieldNameInput.trim()}
                  onClick={() => {
                    if (customFieldNameInput.trim()) {
                      const template = FIELD_TEMPLATES[createCustomFieldBaseType];
                      const newCustomField: CustomFieldDef = {
                        id: `custom_${Date.now()}`,
                        title: customFieldNameInput.trim(),
                        type: createCustomFieldBaseType,
                        schema: JSON.parse(
                          JSON.stringify({
                            ...template.schema,
                            title: customFieldNameInput.trim(),
                          }),
                        ),
                        uiSchema: template.uiSchema
                          ? JSON.parse(JSON.stringify(template.uiSchema))
                          : undefined,
                      };
                      setCustomFields([...customFields, newCustomField]);
                      setCreateCustomFieldModalOpen(false);
                    }
                  }}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#6366f1',
                    border: 'none',
                    borderRadius: '0.375rem',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: customFieldNameInput.trim() ? 'pointer' : 'not-allowed',
                    opacity: customFieldNameInput.trim() ? 1 : 0.5,
                  }}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
