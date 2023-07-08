import React, { useState } from 'react';
import styles from './FormItem.module.scss';

interface IFormItemProps {
  label: string;
  onChange: (value: React.SetStateAction<string>) => void;
}

function FormItem({ label, onChange }: IFormItemProps) {
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
      />
    </div>
    // <div className={styles.FormItem}>
    //   {/* add icon */}
    //   <label className={styles.FormItem__label} htmlFor="password">
    //     Password
    //     <input
    //       className={styles.FormItem__input}
    //       type="password"
    //       id="password"
    //       name="password"
    //       required
    //       // placeholder="Password"
    //       onChange={(e) => setPassword(e.target.value)}
    //     />
    //   </label>
    // </div>
  );
}

export default FormItem;
