import { usePprotoStatus } from "../pproto/pproto-react";
import { useEffect, useState } from "react";
import { useTestService } from "./commands";
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
            userId: 12345678901234567890,
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
    type DataRow = {
        id: number,
        date: string,
        userId: number,
        userName: string,
        description: string
    };

    const columns: TableColumn<DataRow>[] = [
        {
            name: "Дата",
            selector: row => row.date,
            sortable: true,
            width: "8rem"
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


    const status = usePprotoStatus();
    const test = useTestService();
    const [answer, setAnswer] = useState("");

    // ----------
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
                        data={data}
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
                        <div className="radio">
                            <input className="radioButton"
                                type="radio"
                                name="address"
                                checked={false}
                                onClick={() => alert("abobe")}
                            />
                            <div className="text">Период</div>
                        </div>
                        <select className="select" name="" id="">
                            <option value="1">1 час</option>
                            <option value="4">4 часа</option>
                            <option value="8">8 часов</option>
                            <option value="12">12 часов</option>
                            <option value="24">24 часа</option>
                        </select>
                    </div>
                    <div className="radio">
                        <input className="radioButton"
                            type="radio"
                            name="address"
                            checked={false}
                            onClick={() => alert("abobe")}
                        />
                        <div className="text">Указать вручную</div>
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
                    <button className="styled-button">Показать</button>
                    <button className="styled-button">Очистить</button>
                    <button className="styled-button">Экспорт файл</button>
                </div>
            </div>
        </div>
    );
};
