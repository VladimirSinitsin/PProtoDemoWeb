import { usePprotoStatus } from "../pproto/pproto-react";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { usePprotoService } from "./commands";
import { PprotoError } from "../pproto/pproto";

export const HomePage = () => {
  const status = usePprotoStatus();
  const test = usePprotoService();
  const [answer, setAnswer] = useState("");


  // LogTest
  const sendTestLog = async () => {
    setAnswer("Loading...");
    try {
      const begin = new Date("2022-12-01");
      const end = new Date("2022-12-31");
      const r = await test.sendLogReq(begin, end);
      setAnswer(JSON.stringify(r, null, 4));
    } catch (e) {
      setAnswer(`${e}`);
    }
  };
  // -------------

  // ArchiveTest
  const sendTestArchive = async () => {
    setAnswer("Loading...");
    try {
        const begin = new Date("2022-12-01");
        const end = new Date("2022-12-31");
        const r = await test.sendArchiveReq(begin, end);
        setAnswer(JSON.stringify(r, null, 4));
    } catch (e) {
        setAnswer(`${e}`);
    }
  };
  // -------------

  return (
    <Root>
      <Status>
        Статус: {status === "connected" ? "Подключено" : "Отключено"}
      </Status>
      <CommandButton onClick={sendTestLog}>Send test Log</CommandButton>
      <CommandButton onClick={sendTestArchive}>Send test Archive</CommandButton>
      <label>
        Ответ от сервера
        <ResultTextArea readOnly value={answer} />
      </label>
    </Root>
  );
};

const Root = styled.div`
  padding: 8px;
`;

const Status = styled.div`
  margin-bottom: 16px;
`;

const CommandButton = styled.button`
  display: block;
  margin-bottom: 8px;
`;

const ResultTextArea = styled.textarea`
  display: block;
  resize: none;
  width: 600px;
  height: 400px;
  max-width: 100%;
`;
