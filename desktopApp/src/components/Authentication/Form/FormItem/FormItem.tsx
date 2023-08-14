import React, { useState } from 'react';
import styles from './FormItem.module.scss';

interface IFormItemProps {
  errors?: boolean;
  label?: string;
  placeholder?: string;
  onChange: (value: React.SetStateAction<string>) => void;
}

function FormItem({ errors, label, placeholder, onChange }: IFormItemProps) {

  return (
    <div className={styles.FormItem}>
      <label className={styles.FormItem__label} htmlFor={label}>
        {label}
      </label>
      {/* add icon */}
      <input
        className={!errors? styles.FormItem__input: styles.FormItem__errorInput}
        onChange={(e) => onChange(e.target.value)}
        id={label}
        type={'text'}
        placeholder={placeholder}
      />
    </div>
  );
}

export default FormItem;
