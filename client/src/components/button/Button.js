import React, { Component } from 'react';
import classNames from 'classnames';
import './Button.scss';

export const Button = ({
  text,
  onClick,
  type,
  disabled,
  style,
  size
}) => (
  <button
    type={type}
    disabled={disabled}
    onClick={onClick}
    className={classNames('btn', style, size)}
  >{text}</button>
);
