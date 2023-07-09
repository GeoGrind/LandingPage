import React, { useState } from 'react';
import styles from './FormButton.module.scss';

interface IFormButtonProps {
  label: string;
  onClick: (e: any) => void;
}

function FormButton({ label, onClick }: IFormButtonProps) {
  return (
    <button className={styles.FormButton} type="button" onClick={onClick}>
      {label}
    </button>
  );
}

export default FormButton;
