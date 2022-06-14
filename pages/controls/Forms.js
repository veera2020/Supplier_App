/*
 *  Document    : Forms.js
 *  Author      : uyarchi
 *  Description : custom forms for all components
 */

import React from "react";

const Forms = (props) => {
  const { ...others } = props;
  return <form {...others}>{props.children}</form>;
};

export default Forms;