import styled from "styled-components";

export const DefaultButton = styled.button`
  font-family: OpenSans-SemiBold, Helvetica, Arial, sans-serif;
  line-height: 1;
  color: #fff;
  border-radius: 21px;
  transition: all 0.2s ease;
  padding: 12px 40px;
  background: linear-gradient(90deg, #ff7904, #ff1605);
  border: 1px transparent;
  box-shadow: 0 10px 20px 0 rgba(231, 72, 0, 0.3);

  &:hover,
  &:focus,
  &:active {
    border-color: transparent;
    box-shadow: 0 5px 12px 0 rgba(231, 72, 0, 0.3);
  }

  &:hover {
    background-color: #ce1800;
  }

  &:active {
    box-shadow: 0 0 0 0;
    background-color: #9c1200;
  }
`;

export const CancelButton = DefaultButton.extend`
  background: #ffffff;
  color: #0f181e;
  border: 1px solid #e7e7e7;

  &:hover {
    background-color: #ffffff;
    border: solid 1px #e2e2e2;
    color: #e74800;
  }

  &:active {
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
    color: #e74800;
  }

  &:disabled {
    background: #f1f1f1;
    opacity: 0.3;
    color: #e74800;
  }
`;
