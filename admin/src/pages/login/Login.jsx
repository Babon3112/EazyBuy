import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/apiCalls";
import { Link } from "react-router-dom";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)),
    url("https://source.unsplash.com/random") center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 300px;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgb(255, 255, 255);
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 400;
  color: #333;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  min-width: 40%;
  margin: 10px 0;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

const ButtonMiddle = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Button = styled.button`
  width: 40%;
  border: none;
  padding: 15px 0;
  margin: 10px 0;
  color: white;
  background-color: teal;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:disabled {
    background-color: rgba(0, 128, 128, 0.5);
    cursor: not-allowed;
  }

  &:hover {
    background-color: #008b8b;
  }
`;

const Error = styled.span`
  color: red;
  text-align: center;
`;

const signIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isFetching, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();

    await login(dispatch, { email, password }).then(() =>
      window.location.reload()
    );
  };

  return (
    <Container>
      <Wrapper>
        <Title>SIGN IN</Title>
        <Form>
          <Input
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <Error>Something Went Wrong.....</Error>}
          <ButtonMiddle>
            <Button onClick={handleLogin} disabled={isFetching}>
              Log IN
            </Button>
          </ButtonMiddle>
        </Form>
      </Wrapper>
    </Container>
  );
};

export default signIn;
