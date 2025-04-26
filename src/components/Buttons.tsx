// import { Children, cloneElement, ReactElement } from 'react'
// import type { ReactNode } from 'react'

// type Props = {
//   type?: string
//   mb?: string
//   noWrap?: boolean
//   classAddon?: string
//   children: ReactNode
//   className?: string
// }

// const Buttons = ({
//   type = 'justify-start',
//   mb = '-mb-3',
//   classAddon = 'mr-3 last:mr-0 mb-3',
//   noWrap = false,
//   children,
//   className,
// }: Props) => {
//   return (
//     <div
//       className={`flex items-center ${type} ${className} ${mb} ${
//         noWrap ? 'flex-nowrap' : 'flex-wrap'
//       }`}
//     >
//       {Children.map(children, (child: ReactElement) =>
//         child ? cloneElement(child, { className: `${classAddon} ${child.props.className}` }) : null
//       )}
//     </div>
//   )
// }

// export default Buttons



import React, { Children, cloneElement, ReactElement } from 'react';
import type { ReactNode } from 'react';

type Props = {
  type?: string;
  mb?: string;
  noWrap?: boolean;
  classAddon?: string;
  children: ReactNode; // This can be any ReactNode, including strings, numbers, etc.
  className?: string;
};

const Buttons = ({
  type = 'justify-start',
  mb = '-mb-3',
  classAddon = 'mr-3 last:mr-0 mb-3',
  noWrap = false,
  children,
  className,
}: Props) => {
  return (
    <div
      className={`flex items-center ${type} ${className} ${mb} ${
        noWrap ? 'flex-nowrap' : 'flex-wrap'
      }`}
    >
      {Children.map(children, (child) => {
        // Ensure child is a valid ReactElement before cloning
        if (React.isValidElement(child)) {
          // return cloneElement(child, { className: `${classAddon} ${child.props.className || ''}` });
        }
        return null; // Return null if child is not a valid ReactElement
      })}
    </div>
  );
};

export default Buttons;