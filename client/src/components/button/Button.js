import React, { Component } from 'react';
import classNames from 'classnames';
import './Button.scss';

export const Button = ({
  text,
  onClick,
  type,
  disabled,
  buttonType
}) => (
  <button
    type={type}
    disabled={disabled}
    onClick={onClick}
    className={classNames('btn', buttonType)}
  >{text}</button>
);
