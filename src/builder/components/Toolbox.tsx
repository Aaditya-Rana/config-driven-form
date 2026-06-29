import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { BuilderFieldType } from '../types';
import {
  Type,
  Hash,
  Mail,
  Key,
  AlignLeft,
  FileUp,
  CheckSquare,
  List,
  ChevronDown,
  CheckCircle2,
  AlignJustify,
  Calendar,
  CalendarClock,
  Clock,
  Settings,
  Plus,
  Edit2,
  Trash2,
} from 'lucide-react';
import { CustomFieldDef } from '../types';

const TOOLS: { type: BuilderFieldType; label: string; icon: React.ReactNode }[] = [
  { type: 'text', label: 'Text Field', icon: <Type size={18} /> },
  { type: 'number', label: 'Number', icon: <Hash size={18} /> },
  { type: 'email', label: 'Email', icon: <Mail size={18} /> },
  { type: 'password', label: 'Password', icon: <Key size={18} /> },
  { type: 'rich-text', label: 'Rich Text', icon: <AlignLeft size={18} /> },
  { type: 'select', label: 'Dropdown', icon: <ChevronDown size={18} /> },
  { type: 'radio', label: 'Radio Group', icon: <CheckCircle2 size={18} /> },
  { type: 'checkbox', label: 'Checkbox', icon: <CheckSquare size={18} /> },
  { type: 'checkboxes', label: 'Checkbox Group', icon: <List size={18} /> },
  { type: 'file', label: 'File Upload', icon: <FileUp size={18} /> },
  { type: 'textarea', label: 'Long Text', icon: <AlignJustify size={18} /> },
  { type: 'date', label: 'Date', icon: <Calendar size={18} /> },
  { type: 'datetime', label: 'Date & Time', icon: <CalendarClock size={18} /> },
  { type: 'time', label: 'Time', icon: <Clock size={18} /> },
];

const DraggableTool: React.FC<{
  type: string;
  label: string;
  icon: React.ReactNode;
  customField?: CustomFieldDef;
  onAddField: (type: string, customField?: CustomFieldDef) => void;
  onEdit?: (id: string) => void;
  onRemove?: (id: string) => void;
}> = ({ type, label, icon, customField, onAddField, onEdit, onRemove }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: customField ? `toolbox-custom-${customField.id}` : `toolbox-${type}`,
    data: {
      type: 'ToolboxItem',
      fieldType: type,
      customField,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={() => onAddField(type, customField)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem',
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '0.5rem',
        cursor: isDragging ? 'grabbing' : 'grab',
        opacity: isDragging ? 0.5 : 1,
        marginBottom: '0.5rem',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = '#6366f1';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 6px rgba(99, 102, 241, 0.1)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = '#e5e7eb';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
      }}
      className="cdf-toolbox-item"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
        <div style={{ color: '#6366f1' }}>{icon}</div>
        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>{label}</span>
      </div>

      {customField && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(customField.id);
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#6b7280',
                padding: '0.25rem',
              }}
              title="Edit Name"
            >
              <Edit2 size={14} />
            </button>
          )}
          {onRemove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(customField.id);
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#ef4444',
                padding: '0.25rem',
              }}
              title="Remove"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export const Toolbox: React.FC<{
  onAddField: (type: string, customField?: CustomFieldDef) => void;
  customFields?: CustomFieldDef[];
  onCreateCustomField?: () => void;
  onEditCustomField?: (id: string) => void;
  onRemoveCustomField?: (id: string) => void;
}> = ({
  onAddField,
  customFields = [],
  onCreateCustomField,
  onEditCustomField,
  onRemoveCustomField,
}) => {
  return (
    <div className="cdf-toolbox">
      <div className="cdf-toolbox-inner">
        <div>
          <h3 className="cdf-toolbox-group-title">Form Elements</h3>
          <div className="cdf-toolbox-items">
            {TOOLS.map((tool) => (
              <DraggableTool
                key={tool.type}
                type={tool.type as BuilderFieldType}
                label={tool.label}
                icon={tool.icon}
                onAddField={onAddField}
              />
            ))}
          </div>
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.75rem',
            }}
          >
            <h3 className="cdf-toolbox-group-title" style={{ margin: 0 }}>
              Custom Fields
            </h3>
            {onCreateCustomField && (
              <button
                onClick={onCreateCustomField}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6366f1',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.25rem',
                }}
                title="Create Custom Field"
              >
                <Plus size={16} />
              </button>
            )}
          </div>
          {customFields.length > 0 ? (
            <div className="cdf-toolbox-items">
              {customFields.map((field) => (
                <DraggableTool
                  key={field.id}
                  type={field.type}
                  label={field.title}
                  icon={<Settings size={18} />}
                  customField={field}
                  onAddField={onAddField}
                  onEdit={onEditCustomField}
                  onRemove={onRemoveCustomField}
                />
              ))}
            </div>
          ) : (
            <div
              style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                fontStyle: 'italic',
                padding: '0.5rem',
              }}
            >
              No custom fields yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
