import { FC, Fragment } from 'react';
import { IconWrapper, StyledButton } from './NormalButtonStyled';
import { ButtonProps } from '../../../../interfaces/buttons';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';

const Button: FC<ButtonProps> = ({
  text,
  variant = 'primary',
  icon,
  hasSpecial,
  iconPosition = 'left',
  onClick,
  disabled = false,
  type,
  loading = false,
}) => {
  return (
    <Fragment>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <StyledButton
          onClick={onClick}
          disabled={disabled || loading}
          variant={variant}
          hasSpecial={hasSpecial}
          type={type}
        >
          {icon && iconPosition === 'left' && <IconWrapper iconPosition={iconPosition}>{icon}</IconWrapper>}
          {text}
          {icon && iconPosition === 'right' && <IconWrapper iconPosition={iconPosition}>{icon}</IconWrapper>}
        </StyledButton>
      )}
    </Fragment>
  );
};

export default Button;
