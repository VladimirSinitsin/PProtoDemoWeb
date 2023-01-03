import { usePprotoStatus } from "../pproto/pproto-react";
import {SetStateAction, useEffect, useState} from "react";
import {ItemType, useTestService} from "./commands";
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { PprotoError } from "../pproto/pproto";
import DataTable, { TableColumn, ExpanderComponentProps } from 'react-data-table-component';

import './styles.Module.scss';

export const LogPage = () => {
    // Таблица
    // Данные
    const data: DataRow[] = [
        {
            id: 1,
            date: "2022-12-19",
            userId: "12345678901234567890",
            userName: "Синицин Владимир Владимирович",
            description: "Нарушение при открытой печи Нарушение при открытой печи Нарушение при открытой печи " +
                "Нарушение при открытой печи Нарушение при открытой печи Нарушение при открытой печи " +
                "Нарушение при открытой печи Нарушение при открытой печи Нарушение при открытой печи " +
                "Нарушение при открытой печи Нарушение при открытой печи Нарушение при открытой печи " +
                "Нарушение при открытой печи Нарушение при открытой печи Нарушение при открытой печи " +
                "Нарушение при открытой печи Нарушение при открытой печи Нарушение при открытой печи " +
                "Нарушение при открытой печи Нарушение при открытой печи "
        },
        {
            id: 2,
            date: "2022-12-20",
            userId: "3",
            userName: "Игнат",
            description: "Нарушение при закрытой печи"
        },
        {
            id: 3,
            date: "2022-12-21",
            userId: "4",
            userName: "Валерий",
            description: "Выход из системы"
        },
        {
            id: 4,
            date: "2022-12-21",
            userId: "2",
            userName: "Арсений",
            description: "Вход в систему"
        }
    ];
    // ---------

    // Столбцы
    type DataRow = {
        id: number,
        date: string,
        userId: string,
        userName: string,
        description: string
    };

    const columns: TableColumn<DataRow>[] = [
        {
            name: "Дата",
            selector: row => row.date,
            sortable: true,
            width: "11rem"
        },
        {
            name: "Код пользователя",
            selector: row => row.userId,
            sortable: true,
            width: "12rem"
        },
        {
            name: "Имя пользователя",
            selector: row => row.userName,
            sortable: true,
            width: "20rem"
        },
        {
            name: "Описание",
            selector: row => row.description,
            sortable: true,
            width: "40rem"
        }
    ];

    const [dataFrame, setDataFrame] = useState<DataRow[]>([]);
    // -------

    // Настройки таблицы
    const ExpandableRowComponent: React.FC<ExpanderComponentProps<DataRow>> = ({ data }) => {
        return (
            <>
                <div className="expandableRowText"><b>ID:</b> {data.id}</div>
                <div className="expandableRowText"><b>Дата:</b> {data.date}</div>
                <div className="expandableRowText"><b>Код пользователя:</b> {data.userId}</div>
                <div className="expandableRowText"><b>Имя пользователя:</b> {data.userName}</div>
                <div className="expandableRowText"><b>Описание:</b> {data.description}</div>
            </>
        );
    };
    // ----------

    const status = usePprotoStatus();
    const test = useTestService();
    // ----------

    // Период и Указать вручную radioButton
    const [checkedByPeriod, setCheckedByPeriod] = useState(true);
    const [checkedByManual, setCheckedByManual] = useState(false);

    const handleCheckedByManual = () => {
        setCheckedByManual(true);
        setCheckedByPeriod(false);
    }

    const handleCheckedByPeriod = () => {
        setCheckedByManual(false);
        setCheckedByPeriod(true);
    }
    // ------------------------------------

    // Период select
    const [periodValue, setPeriodValue] = useState("1");

    const handlePeriodValue = (event: { target: { value: SetStateAction<string>; }; }) => {
        setPeriodValue(event.target.value);
    }
    //-------------------

    // Показать
    const showTableDataFrame = async () => {
        checkedByPeriod && await requestPeriod();
        checkedByManual && await requestManual();
    }

    const requestPeriod = async () => {
        try {
            const now = new Date();
            const begin = new Date(now.setHours(now.getHours() - Number(periodValue)));
            // (!) после setHours значение в now меняется
            const r = await test.sendEventLog(begin, new Date());
            const currDataFrame: DataRow[] = [];
            r.items.forEach((item, index) => {
                const dataRow: DataRow = {
                    id: index,
                    date: new Date(item.eventTime).toLocaleString(),
                    userId: item.userSid,
                    userName: item.userName,
                    description: item.description
                };
                currDataFrame.push(dataRow);
            });
            setDataFrame(currDataFrame);
        } catch (e) {
            alert(`${e}`);
        }
    }

    const requestManual = async () => {
        alert("abobe");
    }
    // --------

    return (
        <div className="root">
            <div className="table">
                <div className="Status">
                    Статус: {status === "connected" ? "Подключено" : "Отключено"}
                </div>
                <div className="resultTable">
                    <DataTable
                        className="dataTables_wrapper"
                        columns={columns}
                        data={dataFrame}
                        defaultSortFieldId="date"
                        // pagination
                        // dense
                        fixedHeaderScrollHeight="90%"
                        responsive
                        subHeaderWrap
                        fixedHeader={true}
                        expandableRows
                        expandableRowsComponent={ExpandableRowComponent}
                    />
                </div>
            </div>
            <div className="panelJournal">
                <div className="container">
                    <div className="flex-row-50">
                        <div className="radio" onClick={() => handleCheckedByPeriod()}>
                            <input className="radioButton"
                                type="radio"
                                name="address"
                                checked={checkedByPeriod}
                            />
                            <div className="textRadioButton">Период</div>
                        </div>
                        <select className="select" name="" id="" onChange={ e => handlePeriodValue(e)}>
                            <option value="1">1 час</option>
                            <option value="4">4 часа</option>
                            <option value="8">8 часов</option>
                            <option value="12">12 часов</option>
                            <option value="24">24 часа</option>
                            <option value="168">1 неделя</option>  // 24 * 7
                            <option value="744">1 месяц</option>  // 24 * 31
                        </select>
                    </div>
                    <div className="radio" onClick={() => handleCheckedByManual()}>
                        <input className="radioButton"
                            type="radio"
                            name="address"
                            checked={checkedByManual}
                        />
                        <div className="textRadioButton">Указать вручную</div>
                    </div>
                    <div className="flex-row-50">
                        <div className="text-start-end">Начало</div>
                        <DatePicker
                            format="YYYY-MM-DD HH:mm:ss"
                            placeholder="Выберите дату"
                            showTime={{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }}
                            size="small"
                        />
                    </div>
                    <div className="flex-row-50">
                        <div  className="text-start-end">Окончание</div>
                        <DatePicker
                            format="YYYY-MM-DD HH:mm:ss"
                            placeholder="Выберите дату"
                            showTime={{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }}
                            size="small"
                        />
                    </div>
                </div>
                <div className="flex-column">
                    <button className="styled-button" onClick={() => showTableDataFrame()}>Показать</button>
                    <button className="styled-button">Очистить</button>
                    <button className="styled-button">Экспорт файл</button>
                </div>
            </div>
        </div>
    );
};
