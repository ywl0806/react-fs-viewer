import * as React from 'react';
import { forwardRef } from 'react';
import { ElementWithBoundary, Movement } from '../types/types';

type SelectionItemProps = {
  isSelected: boolean;
  isDragging: boolean;
  index: number;
  selectedStyle?: React.CSSProperties;
  movement?: Movement;
  element?: ElementWithBoundary;
} & React.HTMLAttributes<HTMLDivElement>;

const SelectionItem = forwardRef<HTMLDivElement, SelectionItemProps>(
  (
    {
      isSelected,
      isDragging,
      index,
      className,
      element,
      movement,
      selectedStyle = {
        boxShadow: '0 0 4px 1px blue',
        zIndex: 500,
      },
      style = {
        padding: '1rem',
        borderRadius: '10px',
        width: 'fit-content',
        height: 'fit-content',
        transitionDuration: '100ms',
        transitionTimingFunction: 'linear',
        transitionProperty: 'all',
      },
      ...props
    },
    ref
  ) => {
    const dynamicStyle: React.CSSProperties = {
      ...style,
      ...(isSelected ? selectedStyle : {}),

      transform: `translate(${movement ? movement.translateX : 0}px, ${
        movement ? movement.translateY : 0
      }px) scale(${movement?.scale ?? 1})`,
      opacity: movement ? movement.opacity : '',
      position: movement
        ? ('fixed' as React.CSSProperties['position'])
        : undefined,
    };

    return (
      <>
        <div
          ref={ref}
          className={`selection-draggable ${className ?? ''}`}
          style={dynamicStyle}
          data-index={index}
          {...props}
        />
        {movement && (
          <div
            style={{
              ...style,
              opacity: 0.5,
            }}
          >
            {props.children}
          </div>
        )}
      </>
    );
  }
);

SelectionItem.displayName = 'SelectionItem';

export default SelectionItem;
