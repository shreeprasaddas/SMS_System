import React, { useState } from 'react';
import clsx from 'clsx';

function RichTextEditor({ label, value = '', onChange, error, placeholder = '', className = '', ...props }) {
  return (
    <div className={clsx('flex flex-col gap-1', className)}>
      {label && <label className="text-sm font-medium text-secondary-700">{label}</label>}
      <div className="border border-secondary-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500">
        <div className="bg-secondary-50 border-b border-secondary-200 px-3 py-2 flex gap-2 text-sm text-secondary-600">
          <button type="button" className="font-bold hover:text-secondary-900" title="Bold">B</button>
          <button type="button" className="italic hover:text-secondary-900" title="Italic">I</button>
          <button type="button" className="underline hover:text-secondary-900" title="Underline">U</button>
          <span className="text-secondary-300">|</span>
          <button type="button" className="hover:text-secondary-900" title="List">&bull; List</button>
        </div>
        <textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className="w-full min-h-[150px] p-3 text-sm focus:outline-none resize-y"
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default RichTextEditor;
