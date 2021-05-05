import React from "react";
import styled from "styled-components";

export default function TodoList({ name, id, active, onClick }) {
  return (
    <Item active={active} onClick={() => onClick(id, name)}>
      {name}
    </Item>
  );
}

const Item = styled.li`
  font-weight: ${(props) => props.active && "700"};
  cursor: pointer;
  :hover {
    opacity: 0.7;
  }
`;
