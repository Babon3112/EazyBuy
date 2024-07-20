import React, { useState } from "react";
import styled from "styled-components";
import sliderItems from "@/sliderItems.json";
import { mobile } from "../../responsive";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

interface ArrowProps {
  direction: "left" | "right";
}

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  position: relative;
  overflow: hidden;

  ${mobile({ display: "none" })}
`;

const Arrow = styled.div<ArrowProps>`
  width: 50px;
  height: 50px;
  background-color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 2;
  margin: auto;
  opacity: 0.5;
  cursor: pointer;
  ${({ direction }) => (direction === "left" ? "left: 10px;" : "right: 10px;")}
`;

interface WrapperProps {
  slideindex: number;
}

const Wrapper = styled.div<WrapperProps>`
  height: 100%;
  display: flex;
  transition: all 1.5s ease;
  transform: translateX(${({ slideindex }) => slideindex * -100}vw);
`;

interface SlideProps {
  bg: string;
}

const Slide = styled.div<SlideProps>`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  background-color: ${({ bg }) => bg};
`;

const ImageContainer = styled.div`
  height: 100%;
  flex: 1;
`;

const Image = styled.img`
  height: 100%;
  object-fit: cover;
`;

const InfoContainer = styled.div`
  flex: 1;
  padding: 50px;
`;

const Title = styled.h1`
  font-size: 70px;
  margin-bottom: 20px;
`;

const Description = styled.p`
  margin-bottom: 50px;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 1px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 20px;
  background-color: transparent;
  border: 2px solid #000;
  color: #000;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #fff;
  }
`;

const Slider: React.FC = () => {
  const [slideindex, setSlideindex] = useState(0);

  const handleClick = (direction: "left" | "right") => {
    if (direction === "left") {
      setSlideindex(slideindex > 0 ? slideindex - 1 : sliderItems.length - 1);
    } else {
      setSlideindex(slideindex < sliderItems.length - 1 ? slideindex + 1 : 0);
    }
  };

  return (
    <Container>
      <Arrow direction="left" onClick={() => handleClick("left")}>
        <ArrowBackIosRoundedIcon />
      </Arrow>
      <Wrapper slideindex={slideindex}>
        {sliderItems.map((sliderItem) => (
          <Slide key={sliderItem.id} bg={sliderItem.bg}>
            <ImageContainer>
              <Image src={sliderItem.img} />
            </ImageContainer>
            <InfoContainer>
              <Title>{sliderItem.title}</Title>
              <Description>{sliderItem.desc}</Description>
              <Button>SHOP NOW</Button>
            </InfoContainer>
          </Slide>
        ))}
      </Wrapper>
      <Arrow direction="right" onClick={() => handleClick("right")}>
        <ArrowForwardIosRoundedIcon />
      </Arrow>
    </Container>
  );
};

export default Slider;
