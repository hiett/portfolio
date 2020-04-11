import styled from "styled-components";

export const OverlayContainer = styled.div`
  position: fixed;
  z-index: 999;
  top: 10px;
  left: 10px;
  width: 300px;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  padding: 5px;
  color: white;
  font-family: sans-serif;
  
  h1, h2, h3, h4, h5 {
    padding: 0;
    margin: 0;
  }
  
  p {
    font-size: 12px;
    padding: 0;
    margin: 0;
  }
`;

export const StatusContent = styled.span`
  color: #7bd4ff;
  text-shadow: 0 0 5px black;
`;