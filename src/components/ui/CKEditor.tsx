"use client";

import React, { useRef, useEffect, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

interface CKEditorProps {
  value: string;
  onChange: (data: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  height?: string;
}

export default function CKEditorComponent({
  value,
  onChange,
  placeholder = "İçerik yazın...",
  disabled = false,
  className = "",
  height = "300px",
}: CKEditorProps) {
  const editorRef = useRef<any>(null);

  useEffect(() => {
    // Clean up editor on unmount
    return () => {
      if (editorRef.current && typeof editorRef.current.destroy === 'function') {
        try {
          editorRef.current.destroy();
        } catch (error) {
          console.warn('Error destroying CKEditor:', error);
        }
        editorRef.current = null;
      }
    };
  }, []);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className={`ckeditor-wrapper ${className}`}>
        <div className="border border-gray-300 rounded-md p-4 min-h-[200px] bg-gray-50">
          <p className="text-gray-500">Editor yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`ckeditor-wrapper ${className}`}>
      <CKEditor
        editor={ClassicEditor as any}
        data={value}
        onReady={(editor) => {
          editorRef.current = editor;
          
          // Set minimum height
          editor.editing.view.change((writer) => {
            const root = editor.editing.view.document.getRoot();
            if (root) {
              writer.setStyle("min-height", height, root);
              writer.setStyle("font-family", "Inter, system-ui, sans-serif", root);
              writer.setStyle("line-height", "1.6", root);
            }
          });

          // Focus management
          editor.ui.focusTracker.on('change:isFocused', (evt, data, isFocused) => {
            const editorElement = editor.ui.element;
            if (editorElement) {
              if (isFocused) {
                editorElement.classList.add('ck-focused');
              } else {
                editorElement.classList.remove('ck-focused');
              }
            }
          });
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          onChange(data);
        }}
        config={{
          placeholder,
          toolbar: {
            items: [
              "heading",
              "|",
              "bold",
              "italic",
              "underline",
              "strikethrough",
              "|",
              "bulletedList",
              "numberedList",
              "|",
              "outdent",
              "indent",
              "|",
              "blockQuote",
              "insertTable",
              "|",
              "link",
              "|",
              "undo",
              "redo",
            ],
            shouldNotGroupWhenFull: true
          },
          heading: {
            options: [
              { model: 'paragraph', title: 'Paragraf', class: 'ck-heading_paragraph' },
              { model: 'heading1', view: 'h1', title: 'Başlık 1', class: 'ck-heading_heading1' },
              { model: 'heading2', view: 'h2', title: 'Başlık 2', class: 'ck-heading_heading2' },
              { model: 'heading3', view: 'h3', title: 'Başlık 3', class: 'ck-heading_heading3' },
            ]
          },
          table: {
            contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
            tableProperties: {
              borderColors: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'],
              backgroundColors: ['#f8fafc', '#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b']
            }
          },
          link: {
            addTargetToExternalLinks: true,
            decorators: {
              openInNewTab: {
                mode: "manual",
                label: "Yeni sekmede aç",
                attributes: {
                  target: "_blank",
                  rel: "noopener noreferrer",
                },
              },
            },
          },
          language: 'tr',
        }}
        disabled={disabled}
      />
      <style jsx global>{`
        .ckeditor-wrapper {
          position: relative;
        }
        
        .ckeditor-wrapper .ck-editor {
          border-radius: 0.75rem;
          overflow: hidden;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
          transition: all 0.2s ease-in-out;
        }
        
        .ckeditor-wrapper .ck-editor:hover {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        .ckeditor-wrapper .ck-editor.ck-focused {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .ckeditor-wrapper .ck-toolbar {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border: 1px solid #e2e8f0;
          border-bottom: none;
          border-radius: 0.75rem 0.75rem 0 0;
          padding: 0.5rem;
        }
        
        .ckeditor-wrapper .ck-toolbar .ck-button {
          border-radius: 0.375rem;
          margin: 0 0.125rem;
          transition: all 0.15s ease-in-out;
        }
        
        .ckeditor-wrapper .ck-toolbar .ck-button:hover {
          background-color: #e2e8f0;
          transform: translateY(-1px);
        }
        
        .ckeditor-wrapper .ck-toolbar .ck-button.ck-on {
          background-color: #3b82f6;
          color: white;
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
        }
        
        .ckeditor-wrapper .ck-editor__editable {
          min-height: ${height};
          border: 1px solid #e2e8f0;
          border-top: none;
          border-radius: 0 0 0.75rem 0.75rem;
          padding: 1.5rem;
          font-family: Inter, system-ui, sans-serif;
          font-size: 16px;
          line-height: 1.6;
          color: #1e293b;
          background-color: #ffffff;
          transition: all 0.2s ease-in-out;
        }
        
        .ckeditor-wrapper .ck-editor__editable:focus {
          outline: none;
          border-color: #3b82f6;
        }
        
        .ckeditor-wrapper .ck-editor__editable.ck-focused {
          border-color: #3b82f6;
          box-shadow: inset 0 0 0 1px #3b82f6;
        }
        
        /* Content styling */
        .ckeditor-wrapper .ck-editor__editable h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          margin: 1.5rem 0 1rem 0;
          line-height: 1.2;
        }
        
        .ckeditor-wrapper .ck-editor__editable h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1e293b;
          margin: 1.25rem 0 0.75rem 0;
          line-height: 1.3;
        }
        
        .ckeditor-wrapper .ck-editor__editable h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
          margin: 1rem 0 0.5rem 0;
          line-height: 1.4;
        }
        
        .ckeditor-wrapper .ck-editor__editable p {
          margin: 0.75rem 0;
          color: #475569;
        }
        
        .ckeditor-wrapper .ck-editor__editable ul,
        .ckeditor-wrapper .ck-editor__editable ol {
          margin: 0.75rem 0;
          padding-left: 1.5rem;
        }
        
        .ckeditor-wrapper .ck-editor__editable li {
          margin: 0.25rem 0;
          color: #475569;
        }
        
        .ckeditor-wrapper .ck-editor__editable blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #64748b;
          background-color: #f8fafc;
          padding: 1rem;
          border-radius: 0 0.5rem 0.5rem 0;
        }
        
        .ckeditor-wrapper .ck-editor__editable a {
          color: #3b82f6;
          text-decoration: underline;
          font-weight: 500;
        }
        
        .ckeditor-wrapper .ck-editor__editable a:hover {
          color: #1d4ed8;
        }
        
        .ckeditor-wrapper .ck-editor__editable table {
          border-collapse: collapse;
          width: 100%;
          margin: 1rem 0;
          border-radius: 0.5rem;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .ckeditor-wrapper .ck-editor__editable th,
        .ckeditor-wrapper .ck-editor__editable td {
          border: 1px solid #e2e8f0;
          padding: 0.75rem;
          text-align: left;
        }
        
        .ckeditor-wrapper .ck-editor__editable th {
          background-color: #f8fafc;
          font-weight: 600;
          color: #1e293b;
        }
        
        /* Dark mode styles */
        .dark .ckeditor-wrapper .ck-toolbar {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          border-color: #475569;
        }
        
        .dark .ckeditor-wrapper .ck-toolbar .ck-button {
          color: #e2e8f0;
        }
        
        .dark .ckeditor-wrapper .ck-toolbar .ck-button:hover {
          background-color: #475569;
        }
        
        .dark .ckeditor-wrapper .ck-toolbar .ck-button.ck-on {
          background-color: #3b82f6;
          color: white;
        }
        
        .dark .ckeditor-wrapper .ck-editor__editable {
          background-color: #1e293b;
          border-color: #475569;
          color: #e2e8f0;
        }
        
        .dark .ckeditor-wrapper .ck-editor__editable:focus {
          border-color: #3b82f6;
        }
        
        .dark .ckeditor-wrapper .ck-editor__editable h1,
        .dark .ckeditor-wrapper .ck-editor__editable h2,
        .dark .ckeditor-wrapper .ck-editor__editable h3 {
          color: #f1f5f9;
        }
        
        .dark .ckeditor-wrapper .ck-editor__editable p,
        .dark .ckeditor-wrapper .ck-editor__editable li {
          color: #cbd5e1;
        }
        
        .dark .ckeditor-wrapper .ck-editor__editable blockquote {
          background-color: #334155;
          color: #94a3b8;
          border-left-color: #3b82f6;
        }
        
        .dark .ckeditor-wrapper .ck-editor__editable th {
          background-color: #334155;
          color: #f1f5f9;
        }
        
        .dark .ckeditor-wrapper .ck-editor__editable th,
        .dark .ckeditor-wrapper .ck-editor__editable td {
          border-color: #475569;
        }
        
        /* Responsive design */
        @media (max-width: 768px) {
          .ckeditor-wrapper .ck-toolbar {
            padding: 0.25rem;
          }
          
          .ckeditor-wrapper .ck-toolbar .ck-button {
            margin: 0 0.0625rem;
            padding: 0.25rem;
          }
          
          .ckeditor-wrapper .ck-editor__editable {
            padding: 1rem;
            font-size: 14px;
          }
          
          .ckeditor-wrapper .ck-editor__editable h1 {
            font-size: 1.5rem;
          }
          
          .ckeditor-wrapper .ck-editor__editable h2 {
            font-size: 1.25rem;
          }
          
          .ckeditor-wrapper .ck-editor__editable h3 {
            font-size: 1.125rem;
          }
        }
      `}</style>
    </div>
  );
}
