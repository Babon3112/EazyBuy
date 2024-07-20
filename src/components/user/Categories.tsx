"use client";
import styled from "styled-components";
import categories from "@/categories.json";
import { mobile } from "../../responsive";
import Link from "next/link";

const Container1 = styled.div`
  display: flex;
  padding: 20px;
  justify-content: space-between;
  border-bottom: 1px solid #f0f0f0;

  ${mobile({ padding: "0px", flexDirection: "column" })}
`;

const Container2 = styled.div`
  flex: 1;
  margin: 5px;
  height: 70vh;
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;
const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;

  ${mobile({ height: "20vh" })}
`;
const Info = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;
  ${Container2}:hover & {
    opacity: 1;
  }
`;
const Title = styled.h1`
  margin-bottom: 20px;
  font-size: 24px;
`;
const Button = styled.button`
  cursor: pointer;
  border: none;
  padding: 10px 20px;
  background-color: #fff;
  color: gray;
  font-weight: 600;
  border-radius: 20px;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const Categories = () => {
  return (
    <Container1>
      {categories.map((category) => (
        <Container2 key={category.id}>
          <Link href={`/products/${category.cat}`}>
            <Image src={category.img} />
            <Info>
              <Title>{category.title}</Title>
              <Button>SHOP NOW</Button>
            </Info>
          </Link>
        </Container2>
      ))}
    </Container1>
  );
};

export default Categories;
