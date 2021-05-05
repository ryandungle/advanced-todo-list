import React, { useRef } from "react";
import styled from "styled-components";

export default function InputForm({ fieldName, label, variant, submitForm }) {
  const listName = useRef(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (listName.current.value == null || listName.current.value === "") return;

    submitForm(listName.current.value);
    listName.current.value = "";
  };
  return (
    <FormContainer variant={variant} onSubmit={handleSubmit}>
      <input
        ref={listName}
        type="text"
        placeholder={fieldName}
        aria-label={fieldName}
      />
      <button aria-label={label}>+</button>
    </FormContainer>
  );
}

const FormContainer = styled.form`
  display: flex;
  padding: 0.25em;
  > input {
    border: 0;
    background: transparent;
    color: inherit;
    border-bottom: 1px solid currentColor;
    outline: none;
    font-size: inherit;

    transition: border-bottom 150ms ease-in;
    order: 2;
  }
  > input:focus {
    border-bottom-width: 3px;
  }
  > input:focus::placeholder {
    opacity: 0.2;
  }
  > button {
    cursor: pointer;
    background: 0;
    border: 0;
    padding: 0;
    color: ${(props) =>
      props.variant === "list" ? "inherit" : "var(--clr-primary)"};
    font-size: 1.5rem;
    font-weight: 900;
    margin-right: 0.25em;
    transition: opacity 250ms ease-in;
  }
  > button:hover {
    opacity: 0.7;
  }
`;
