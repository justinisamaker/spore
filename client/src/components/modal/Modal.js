import React, { Component } from 'react';
import './Modal.scss';

const Modal = (props) => {
  return(
    <div style={{ display: props.show ? 'block' : 'none' }}>
      <div className="modal-bg" onClick={ props.close }></div>
      <div className="modal-content">
        { props.children }
      </div>
    </div>
  );
}

export default Modal;
