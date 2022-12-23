import { usePprotoStatus } from "../pproto/pproto-react";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { useTestService } from "./commands";
import { DatePicker } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { PprotoError } from "../pproto/pproto";
import DataTable from "react-data-table-component";
import {TableColumn} from "react-data-table-component/dist/src/DataTable/types";

import './styles.Module.scss';

export const LogPage = () => {
    const status = usePprotoStatus();
    const test = useTestService();
    const [answer, setAnswer] = useState("");

    const [checkedByPeriod, setCheckedByPeriod] = useState(true);
    const [checkedByKey, setCheckedByKey] = useState(false);

    const [ percentValue, setPercentValue ] = useState(80);

    const [ text, setText ] = useState("");

    // Таблица
    // Данные
    const data = [
        {
            id: 1,
            date: "2022-12-19",
            userId: 1,
            userName: "Олег",
            description: "Нарушение при открытой печи"
        },
        {
            id: 2,
            date: "2022-12-20",
            userId: 3,
            userName: "Игнат",
            description: "Нарушение при закрытой печи"
        },
        {
            id: 3,
            date: "2022-12-21",
            userId: 4,
            userName: "Валерий",
            description: "Выход из системы"
        },
        {
            id: 4,
            date: "2022-12-21",
            userId: 2,
            userName: "Арсений",
            description: "Вход в систему"
        }
    ];
    // Столбцы
    const columns = [
        {
            name: "Дата",
            selector: "date",
            sortable: true
        },
        {
            name: "Код пользователя",
            selector: "userId",
            sortable: true
        },
        {
            name: "Имя пользователя",
            selector: "userName",
            sortable: true
        },
        {
            name: "Описание",
            selector: "description",
            sortable: true
        }
    ];
    

    const LoadBar = ({ text="Загрузка видео", percent = 40 }) => {
        const style = {
            width: `${percent}%`
        }
        return (
            <div className="percent-bar-container">
                <p>{text}</p>
                <div className="percent-bar">
                    <div style={ style }></div>
                </div>
            </div>
        );
    }

    const handleCheckedByKey = () => {
        setCheckedByKey(true);
        setCheckedByPeriod(false);
    }

    const handleCheckedByPeriod = () => {
        setCheckedByPeriod(true);
        setCheckedByKey(false);
    }

    const handleInput = (event) => {
        setText(event.target.value);
        // console.log(event.target.value);
    }

    // ----------
    return (
        <Root>
            <Table>
                <Status>
                    Статус: {status === "connected" ? "Подключено" : "Отключено"}
                </Status>
                <ResultTable>
                    <DataTable
                        columns={columns}
                        data={data}
                        defaultSortField="date"
                        pagination
                    />
                </ResultTable>
            </Table>
            <Panel>
                <Text>События</Text>
                <div className="container">
                    <Radio>
                        <RadioButton
                            type="radio"
                            name="address"
                            checked={checkedByPeriod}
                            onClick={() => handleCheckedByPeriod()}
                        />
                        <Text>Поиск событий за период</Text>
                    </Radio>
                    <Radio>
                        <RadioButton
                            type="radio"
                            name="address"
                            checked={checkedByKey}
                            onClick={() => handleCheckedByKey()}
                        />
                        <Text>Поиск события по ключу</Text>
                    </Radio>
                </div>
                <div className="container">
                    { checkedByPeriod &&
                        <>
                            <div className="flex-row-50">
                                <Radio>
                                        <RadioButton
                                        type="radio"
                                        name="address"
                                        checked={false}
                                        onClick={() => alert("abobe")}
                                    />
                                    <Text>Период</Text>
                                </Radio>
                                <select className="select" name="" id="">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                </select>
                            </div>
                            <Radio>
                                <RadioButton
                                type="radio"
                                name="address"
                                checked={false}
                                onClick={() => alert("abobe")}
                                />
                                <Text>Указать вручную</Text>
                            </Radio>
                            <div className="flex-row-50">
                                <Text>Начало</Text>
                                <DatePicker
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder="Выберите дату"
                                    showTime={{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }}
                                />
                            </div>
                            <div className="flex-row-50">
                                <Text>Окончание</Text>
                                <DatePicker
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder="Выберите дату"
                                    showTime={{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }}
                                />
                            </div>
                        </>
                    }
                    { checkedByKey &&
                        <>
                            <Text>Код события</Text>
                            <input
                                onChange={handleInput}
                                />
                        </>
                    }
                </div>
                <div className="flex-column">
                    <button className="styled-button">Показать</button>
                    <button className="styled-button">Очистить</button>
                    <button className="styled-button">Экспорт файл</button>
                </div>
                <LoadBar
                    text={"Загрузка видео"}
                    percent={percentValue}
                />
                <button className="styled-button">Показать видео</button>
            </Panel>
        </Root>
    );
};

const ContainerRow = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const RadioButton = styled.input`
    margin: 0;
`;

const Radio = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    column-gap: 8px;
`;

const Text = styled.p`
    margin: 0;
`;

const Table = styled.div`
    width: 70%;
`;

const Panel = styled.div`
    border: 1px solid black;
    border-radius: 10px;
    width: 30%;
    padding: 10px;
    display: flex;
    flex-direction: column;
`;

const Root = styled.div`
  padding: 8px;
  display: flex;
  flex-direction: row;
  column-gap: 40px;
  width: 100%;
  max-width: 1200px;
  min-height: 500px;
`;

const Status = styled.div`
  margin-bottom: 16px;
`;

const CommandButton = styled.button`
  display: block;
  margin-bottom: 8px;
`;

const ResultTable = styled.div`
  display: block;
  resize: none;
  width: 100%;
`;
