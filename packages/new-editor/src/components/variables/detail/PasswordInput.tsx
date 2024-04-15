import { Button, Input } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState } from 'react';
import './PasswordInput.css';

type PasswordInputProps = {
  value: string;
  onChange: (newValue: string) => void;
};

export const PasswordInput = ({ value, onChange }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className='password-container'>
      <Input value={value} onChange={event => onChange(event.target.value)} type={showPassword ? 'text' : 'password'} />
      <Button className='show-password-button' icon={IvyIcons.Attribute} size='large' onClick={() => setShowPassword(!showPassword)} />
    </div>
  );
};
