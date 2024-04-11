import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import styled from "styled-components";

import { type Sale, Store, User } from "../../interfaces";

import { OverdueOrders } from "./OverdueOrders";

const AppWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: #cccccc;
`;

const AppHeader = styled.header`
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0rem 2rem;
`;

const HeaderText = styled.h1`
  font-family: "Roboto", sans-serif;
`;

const Username = styled.span`
  font-family: "Roboto", sans-serif;
`;

const AppBody = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const App = () => {
  const [user, setUser] = useState<User | null>(null);

  React.useEffect(() => {
    fetch("http://localhost:8080/user")
      .then((results) => results.json())
      .then((data) => {
        setUser(data);
      });
  }, []);

  return (
    <BrowserRouter>
      <AppWrapper>
        <AppHeader>
          <HeaderText>Analytics Dashboard</HeaderText>
          <Username>Welcome, {user ? user.firstName : "Guest"}!</Username>
        </AppHeader>
        <AppBody>
          <OverdueOrders />
        </AppBody>
      </AppWrapper>
    </BrowserRouter>
  );
};

export default App;
