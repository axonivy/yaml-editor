import { Button, Input, InputGroup } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState } from 'react';

type PasswordInputProps = {
  value: string;
  onChange: (newValue: string) => void;
};

export const PasswordInput = ({ value, onChange }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <InputGroup>
      <Input value={value} onChange={event => onChange(event.target.value)} type={showPassword ? 'text' : 'password'} />
      <Button icon={IvyIcons.Attribute} size='large' onClick={() => setShowPassword(!showPassword)} />
    </InputGroup>
  );
};
