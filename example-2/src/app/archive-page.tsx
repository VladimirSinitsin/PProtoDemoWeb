import { usePprotoStatus } from "../pproto/pproto-react";
import { SetStateAction, useEffect, useState} from "react";
import {useTestService} from "./commands";
import {DatePicker, DatePickerProps} from 'antd';
import dayjs from 'dayjs';
import {PprotoError} from "../pproto/pproto";
import DataTable, {ExpanderComponentProps, TableColumn} from "react-data-table-component";

import './styles.Module.scss';

export const ArchivePage = () => {
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

    const [dataFrame, setDataFrame] = useState<DataRow[]>([]);
    //-------------

    // Настройки таблицы
    const ExpandableRowComponent: React.FC<ExpanderComponentProps<DataRow>> = ({data}) => {
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

    const [checkedEventsByPeriod, setCheckedEventsByPeriod] = useState(true);
    const [checkedEventsByKey, setCheckedEventsByKey] = useState(false);

    const [percentValue, setPercentValue] = useState(80);

    const [text, setText] = useState("");

    const LoadBar = ({text = "Загрузка видео", percent = 40}) => {
        const style = {
            width: `${percent}%`
        }
        return (
            <div className="percent-bar-container">
                <p>{text}</p>
                <div className="percent-bar">
                    <div style={style}></div>
                </div>
            </div>
        );
    }

    const handleCheckedEventsByKey = () => {
        setCheckedEventsByKey(true);
        setCheckedEventsByPeriod(false);
    }

    const handleCheckedEventsByPeriod = () => {
        setCheckedEventsByKey(false);
        setCheckedEventsByPeriod(true);
        // alert(checkedEventsByPeriod)
    }

    const handleInput = (event: { target: { value: SetStateAction<string>; }; }) => {
        setText(event.target.value);
        // console.log(event.target.value);
    }

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

    // Указать вручную DatePicker
    const [manualBeginValue, setManualBeginValue] = useState<Date>(new Date());
    const handleManualBeginValue: DatePickerProps["onChange"] = (date, dateString) => {
        setManualBeginValue(new Date(dateString));
    };

    const [manualEndValue, setManualEndValue] = useState<Date>(new Date());
    const handleManualEndValue: DatePickerProps["onChange"] = (date, dateString) => {
        setManualEndValue(new Date(dateString));
    };
    // --------------------------


    // Показать
    const showTableDataFrame = async () => {
        setDataFrame(data)
    }
    // --------

    // Очистить
    const clearTableDataFrame = () => {
        setDataFrame([])
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
            <div className="panelArchive">
                <div className="text">События</div>
                <div className="container">
                    <div className="radio" onClick={() => handleCheckedEventsByPeriod()}>
                        <input className="radioButton"
                               type="radio"
                               checked={checkedEventsByPeriod}
                        />
                        <div className="textRadioButton">Поиск событий за период</div>
                    </div>
                    <div className="radio" onClick={() => handleCheckedEventsByKey()}>
                        <input className="radioButton"
                               type="radio"
                               checked={checkedEventsByKey}
                        />
                        <div className="textRadioButton">Поиск события по ключу</div>
                    </div>
                </div>
                <div className="container">
                    { checkedEventsByPeriod &&
                        <>
                            <div className="flex-row-50">
                                <div className="radio" onClick={() => handleCheckedByPeriod()}>
                                    <input className="radioButton"
                                           type="radio"
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
                                       checked={checkedByManual}
                                />
                                <div className="textRadioButton">Указать вручную</div>
                            </div>
                            <div className="flex-row-50">
                                <div className="text">Начало</div>
                                <DatePicker
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder="Выберите дату"
                                    showTime={{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }}
                                    size="small"
                                    onChange={handleManualBeginValue}
                                />
                            </div>
                            <div className="flex-row-50">
                                <div  className="text">Окончание</div>
                                <DatePicker
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder="Выберите дату"
                                    showTime={{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }}
                                    size="small"
                                    onChange={handleManualEndValue}
                                />
                            </div>
                        </>
                    }
                    { checkedEventsByKey &&
                        <>
                            <div className="text">Код события</div>
                            <input
                                onChange={handleInput}
                            />
                        </>
                    }
                </div>
                <div className="flex-column">
                    <button className="styled-button" onClick={showTableDataFrame}>Показать</button>
                    <button className="styled-button" onClick={clearTableDataFrame}>Очистить</button>
                    <button className="styled-button">Экспорт файл</button>
                </div>
                <LoadBar
                    text={"Загрузка видео"}
                    percent={percentValue}
                />
                <button className="styled-button">Показать видео</button>
            </div>
        </div>
    );
};
