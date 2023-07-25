import React, { useState } from 'react';
import styles from './FormItem.module.scss';

interface IFormItemProps {
  label: string;
  placeholder?: string;
  onChange: (value: React.SetStateAction<string>) => void;
}

function FormItem({ label, placeholder, onChange }: IFormItemProps) {
  return (
    <div className={styles.FormItem}>
      <label className={styles.FormItem__label} htmlFor={label}>
        {label}
      </label>
      {/* add icon */}
      <input
        className={styles.FormItem__input}
        onChange={(e) => onChange(e.target.value)}
        id={label}
        type={label === 'password' ? 'password' : 'text'}
        placeholder={placeholder}
      />
    </div>
  );
}

export default FormItem;
