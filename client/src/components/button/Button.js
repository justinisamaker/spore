import React from 'react';
import classNames from 'classnames';
import './Button.scss';

export const Button = ({
  text,
  onClick,
  type,
  disabled,
  color,
  size
}) => (
  <button
    type={type}
    disabled={disabled}
    onClick={onClick}
    className={classNames('btn', color, size)}
  ><span>{text}</span></button>
);
