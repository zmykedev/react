import React from 'react';
import { Button, ButtonProps } from 'antd';
import { THEME_COLORS } from '../data/landingData';

interface ActionButtonProps extends Omit<ButtonProps, 'onClick'> {
  variant: 'primary' | 'secondary' | 'outline';
  action: 'login' | 'register' | 'scroll';
  target?: string;
  onAction: (action: string, target?: string) => void;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  variant,
  action,
  target,
  onAction,
  children,
  ...buttonProps
}) => {
  const getButtonStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          style: { 
            backgroundColor: THEME_COLORS.primary, 
            borderColor: THEME_COLORS.primary 
          },
          className: 'hover:bg-fountain-blue-500 hover:border-fountain-blue-500 shadow-lg'
        };
      case 'secondary':
        return {
          style: { 
            borderColor: 'white', 
            color: 'white' 
          },
          className: 'hover:bg-white hover:text-fountain-blue-700 shadow-lg'
        };
      case 'outline':
        return {
          style: { 
            borderColor: 'white', 
            color: 'white' 
          },
          className: 'hover:bg-white hover:text-fountain-blue-700 shadow-lg'
        };
      default:
        return {};
    }
  };

  const styles = getButtonStyles();

  return (
    <Button
      {...buttonProps}
      {...styles}
      onClick={() => onAction(action, target)}
    >
      {children}
    </Button>
  );
};
