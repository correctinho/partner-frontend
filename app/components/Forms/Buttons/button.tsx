'use client'

import { ReactNode, ButtonHTMLAttributes } from 'react';
import styles from './styles.module.css';
import { Loader } from 'lucide-react';
import { useFormStatus } from 'react-dom';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export function ButtonComp({ onClick, children, ...rest }: ButtonProps) {
  const { pending } = useFormStatus()

  return (
    <button
      onClick={onClick}
      className={styles.button}
      disabled={pending}
      type='submit'
      {...rest}
    >
      {pending ? (
        <Loader className={styles.loader} />
      ) : (
        <span className={styles.buttonText}>
          {children}
        </span>
      )}
    </button>
  );
}
