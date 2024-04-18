import { Separator } from '@axonivy/ui-components';
import type { ReactElement } from 'react';
import { Fragment, cloneElement } from 'react';

type ControlProps = {
  buttons: Array<ReactElement>;
};

export const Control = ({ buttons }: ControlProps) => {
  return buttons.map((button, index) => {
    if (index === 0) {
      return cloneElement(button, { style: { marginLeft: 'auto' } });
    }
    return (
      <Fragment key={index}>
        <Separator decorative orientation='vertical' style={{ height: `20px` }} />
        {button}
      </Fragment>
    );
  });
};
