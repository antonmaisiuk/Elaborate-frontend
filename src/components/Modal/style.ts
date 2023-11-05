import styled from 'styled-components';

export const StyledModalContainer = styled.div<{ isActive: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.73);

  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  pointer-events: none;
  transition: 0.5s;

  ${props => props.isActive && `
    opacity: 1;
    pointer-events: all;
  `}
`

export const StyledModalContent = styled.div`
  display: inline-flex;
  padding: 64px 64px 48px 64px;
  flex-direction: column;
  align-items: center;
  border-radius: 16px;
  background: #fff;
  
  width: 40%;
  max-width: 577px;
  //height: 20%;
`

export const StyledDetailsWrapper = styled.div`
  width: 100%;
  
  div div span{
    border-radius: 0;
    border-bottom: 1px solid #D0D5DD;
  }

`

export const StyledItem = styled.span`
  display: flex;
  width: 100%;
  //height: 48px;
  padding: 12px 16px;
  align-items: flex-start;
  gap: 24px;
  //border-radius: 8px;
  border-bottom: 1px solid #D0D5DD;
  color: #1c1f22;
`
export const StyledButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  
  button{
    width: 40%;
  }
`
