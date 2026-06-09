import styled from "styled-components";

export const StyledLoginPage = styled.div`
  display: flex; /* Use flexbox for centering */
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  height: 100%; /* Full viewport height */
  min-height: 100vh;
  width: 100%; /* Full width */
  background-color: #f0f2f5; /* Optional background color */

  .ant-card-head {
    border-bottom: 1.8px solid #f0f0f0;
  }
  .ant-card-body {
    padding: 16px;
  }
  .ant-card-actions {
    border-top: 1.8px solid #f0f0f0;
  }
  .ant-card .ant-card-actions > li:not(:last-child) {
    border-inline-end: 1.8px solid #f0f0f0;
  }

  .ant-form-item-label {
    text-align: start;
    padding: 0px;
  }
  .ant-form-item {
    margin-bottom: 16px;
  }
  .ant-form-item .ant-form-item-control {
    margin: auto;
  }
`;
