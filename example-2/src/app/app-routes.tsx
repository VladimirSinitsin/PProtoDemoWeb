import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import { HomePage } from "./home-page";
import styled from "styled-components";
import {PropsWithChildren, ReactNode} from "react";
import { ArchivePage } from "./archive-page";
import { LogPage } from "./log-page";
import { BenchmarkPage } from "./benchmark-page";
import { ImagePage } from "./image-page";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
    <MainHtml>
      <Links>
        <StyledLink to={"/"}>Видео</StyledLink>
        <StyledLink to={"/archive"}>Архив нарушений</StyledLink>
        <StyledLink to={"/log"}>Журнал событий</StyledLink>
        {/*<StyledLink to={"/image"}>Image</StyledLink>*/}
        {/*<StyledLink to={"/benchmark"}>Benchmark</StyledLink>*/}
      </Links>
      <Routes>
        <Route path={"/"} element={<HomePage />} />
        <Route path={"/archive"} element={<ArchivePage />} />
        <Route path={"/log"} element={<LogPage />} />
        {/*<Route path={"/image"} element={<ImagePage />} />*/}
        {/*<Route path={"/benchmark"} element={<BenchmarkPage />} />*/}
      </Routes>
    </MainHtml>
    </BrowserRouter>
  );
};

const MainHtml = styled.div`
  margin-left: calc(100vw - 100%)
`

const Links = styled.div`
  display: flex;
  gap: 8px;
  padding: 8px;

  a {
    border-radius: 4px;
    padding: 4px;
    text-decoration: none;
    color: black;

    &.active-link {
      background: black;
      color: white;
    }
  }
`;

const StyledLink = (props: PropsWithChildren<{ to: string }>) => {
  return (
    <NavLink
      to={props.to}
      className={({ isActive }) => (isActive ? "active-link" : "")}
    >
      {props.children}
    </NavLink>
  );
};
