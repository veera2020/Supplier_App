/*
 *  Document    : InputFields.js
 *  Author      : uyarchi
 *  Description : Custom input field
 */

import React from "react";

const InputFields = (props) => {
  const { disabled = false,...others } = props;
  return <input {...others} style={{ outline: 0 }} disabled={disabled} />;
};

export default InputFields;