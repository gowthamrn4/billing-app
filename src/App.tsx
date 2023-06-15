import { useCallback, useState } from "react";
import styled from "styled-components";
import { Colors } from "./config/theme";
import { mobile, tablet } from "./config/screens";
import { Table, Chart } from "./components";

const Container = styled.div`
  background: ${Colors.darkblue};
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const SubContainer = styled.div`
  background: ${Colors.white};
  height: 95%;
  width: 50%;
  align-self: center;
  border-radius: 20px;
  -webkit-box-shadow: -7px 8px 32px -10px rgba(0, 0, 0, 0.46);
  -moz-box-shadow: -7px 8px 32px -10px rgba(0, 0, 0, 0.46);
  box-shadow: -7px 8px 32px -10px rgba(0, 0, 0, 0.46);

  ${tablet(`
  width: 80%;
  `)};

  ${mobile(`
  width: 90%;
  `)};
`;

const BillingTableContainer = styled.div`
  margin: 20px;
  height: 100%;
`;

const Header = styled.div`
  text-align: center;
  padding: 20px 0px;
  background: ${Colors.red};
  color: ${Colors.white};
  position: relative;
`;

const AddItemButton = styled.div`
  position: absolute;
  right: 20px;
  top: 20%;
  cursor: pointer;
  background: ${Colors.darkblue};
  padding: 8px;
  color: ${Colors.white};
  border-radius: 5px;
`;

const TaskHeader = styled.div`
  display: flex;
  justify-content: center;
`;

type TaskProps = {
  currentTab: boolean
}
const Task = styled.div<TaskProps>`
  margin: 10px 20px;
  cursor: pointer;
  color: ${Colors.white};
  text-decoration: ${props => props.currentTab ? 'underline' : 'none'}
`;

function App() {
  const [showAddButton, setShowAddButton] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<number>(0);

  return (
    <Container className="App">
      <TaskHeader>
        <Task currentTab={currentTab == 0} onClick={()=>setCurrentTab(0)}>Task 1</Task>
        <Task currentTab={currentTab == 1} onClick={()=>setCurrentTab(1)}>Task 2</Task>
      </TaskHeader>
      <SubContainer>
        <BillingTableContainer>
          <Header>
            Billing App
            {showAddButton && currentTab == 0 && (
              <AddItemButton onClick={() => setShowAddButton(false)}>
                Add Item
              </AddItemButton>
            )}
          </Header>
          <div style={{ height: "100%" }}>
            {currentTab == 0 && (
              <Table
                showAddButton={showAddButton}
                setShowAddButton={(value) => setShowAddButton(value)}
              />
            )}
            {
              currentTab == 1 && (
                <Chart />
              )
            }
          </div>
        </BillingTableContainer>
      </SubContainer>
    </Container>
  );
}

export default App;
