import { css } from "styled-components";

export const mobile = (props: any) => {
  return css`
    @media screen and (max-width: 450px) {
      ${props}
    }
  `;
};
