import React, { useState } from 'react';
import styles from './FormPassword.module.scss';

import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import Input from '@mui/material/Input';
import { TextField } from '@mui/material';
import QuestionMark from '@mui/icons-material/QuestionMark';
import Box from '@mui/material/Box';

interface IFormPasswordProps {
  errors?: boolean;
  label?: string;
  placeholder?: string;
  onChange: (value: React.SetStateAction<string>) => void;
}

function FormPassword({ errors, label, placeholder, onChange }: IFormPasswordProps) {
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const handleMouseDownPassword = (e: any) => {
        e.preventDefault();
    };

    return (
        <div className={styles.FormPassword}>
        <label className={styles.FormPassword__label} htmlFor={label}>
            {label}
        </label>
        {/* add icon */}
        <div className={styles.FormPassword__wrapper}>
            <input
                className={!errors? styles.FormPassword__input: styles.FormPassword__errorInput}
                onChange={(e) => onChange(e.target.value)}
                id={label}
                type={showPassword ? 'text' : 'password'}
                placeholder={placeholder}
            />
            <IconButton
                className={styles.FormPassword__visibilityIcon}
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
            >
                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
        </div>
        </div>
    );
}

export default FormPassword;
