/*
 *  Document    : FormikErrorMessage.js
 *  Author      : uyarchi
 *  Description : custom form error message for all components
 */

import React from "react";

const FormikErrorMessage = (props) => {
  return <span className="text-secondary">{props.children}</span>;
};

export default FormikErrorMessage;