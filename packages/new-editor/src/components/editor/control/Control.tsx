import type { ReactElement } from 'react';
import { Fragment, cloneElement } from 'react';
import './Control.css';

type ControlProps = {
  buttons: ReactElement[];
};

export const Control = ({ buttons }: ControlProps) => {
  return buttons.map((button, index) => {
    if (index === 0) {
      return cloneElement(button, { style: { marginLeft: 'auto' } });
    }
    return (
      <Fragment key={index}>
        <div className='vertical-line' />
        {button}
      </Fragment>
    );
  });
};
