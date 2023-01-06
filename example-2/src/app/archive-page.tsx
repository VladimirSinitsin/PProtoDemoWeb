import { usePprotoStatus } from "../pproto/pproto-react";
import { SetStateAction, useEffect, useState} from "react";
import {usePprotoService} from "./commands";
import {DatePicker, DatePickerProps} from 'antd';
import dayjs from 'dayjs';
import {PprotoError} from "../pproto/pproto";
import DataTable, {ExpanderComponentProps, TableColumn} from "react-data-table-component";

import './styles.Module.scss';

export const ArchivePage = () => {
    // Таблица
    // Столбцы
    type DataRow = {
        id: number;
        humanId: number;
        humanDetect: string;
        doorIsOpen: string;
        offenseType: string;
        overall: string;
        screen: string;
        glove: string;
        boot: string;
        robe: string;
        pants: string;
    };

    const columns: TableColumn<DataRow>[] = [
        {
            name: "Код события",
            selector: row => row.id,
            sortable: true,
            width: "8rem"
        },
        {
            name: "Код сотрудника",
            selector: row => row.humanId,
            sortable: true,
            width: "9rem"
        },
        {
            name: "Время события",
            selector: row => row.humanDetect,
            sortable: true,
            width: "11rem"
        },
        {
            name: "Положение двери",
            selector: row => row.doorIsOpen,
            sortable: true,
            width: "10rem"
        },
        {
            name: "Тип нарушения",
            selector: row => row.offenseType,
            sortable: true,
            width: "9rem"
        },
        {
            name: "Комбинезон",
            selector: row => row.overall,
            sortable: true,
            width: "8rem"
        },
        {
            name: "Защитный экран",
            selector: row => row.screen,
            sortable: true,
            width: "7rem"
        },
        {
            name: "Перчатки",
            selector: row => row.glove,
            sortable: true,
            width: "7rem"
        },
        {
            name: "Ботинки",
            selector: row => row.boot,
            sortable: true,
            width: "6rem"
        },
        {
            name: "Халат",
            selector: row => row.robe,
            sortable: true,
            width: "6rem"
        },
        {
            name: "Штаны",
            selector: row => row.pants,
            sortable: true,
            width: "6rem"
        }
    ];

    const [dataFrame, setDataFrame] = useState<DataRow[]>([]);
    //-------------

    // Настройки таблицы
    const ExpandableRowComponent: React.FC<ExpanderComponentProps<DataRow>> = ({data}) => {
        return (
            <>
                <div className="expandableRowText"><b>Код события:</b> {data.id}</div>
                <div className="expandableRowText"><b>Код сотрудника:</b> {data.humanId}</div>
                <div className="expandableRowText"><b>Время события:</b> {data.humanDetect}</div>
                <div className="expandableRowText"><b>Положение двери:</b> {data.doorIsOpen}</div>
                <div className="expandableRowText">
                    <b>Тип нарушения:</b> {
                    // data.offenseType === 0 ? "0 - Нарушение использования СИЗ не найдено" :
                    //     data.offenseType === 1 ? "1 - Нарушение использования СИЗ при работе с печью" :
                    //         "2 - Нарушение использования СИЗ при перемещении по участку"
                    data.offenseType === "Нахождение в зоне" ? "Нарушение использования СИЗ при перемещении по участку" :
                    data.offenseType === "Работа с печью" ? "Нарушение использования СИЗ при работе с печью" :
                    "Нарушение использования СИЗ не найдено"
                }
                </div>
                <div className="expandableRowText"><b>Комбинезон:</b> {data.overall}</div>
                <div className="expandableRowText"><b>Защитный экран:</b> {data.screen}</div>
                <div className="expandableRowText"><b>Перчатки:</b> {data.glove}</div>
                <div className="expandableRowText"><b>Ботинки:</b> {data.boot}</div>
                <div className="expandableRowText"><b>Халат:</b> {data.robe}</div>
                <div className="expandableRowText"><b>Штаны:</b> {data.pants}</div>
            </>
        );
    };


    const pprotoStatus = usePprotoStatus();
    const pprotoService = usePprotoService();

    const [checkedEventsByPeriod, setCheckedEventsByPeriod] = useState(true);
    const [checkedEventsByKey, setCheckedEventsByKey] = useState(false);

    const [percentValue, setPercentValue] = useState(80);

    const [keyText, setKeyText] = useState("");

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

    // Поиск событий за период и Поиск события по ключу radioButton
    const handleCheckedEventsByKey = () => {
        setCheckedEventsByKey(true);
        setCheckedEventsByPeriod(false);
        setCheckedByManual(false);
        setCheckedByPeriod(false);
        setTableOffset(0);
    }

    const handleCheckedEventsByPeriod = () => {
        setCheckedEventsByKey(false);
        setCheckedEventsByPeriod(true);
        // alert(checkedEventsByPeriod)
    }
    // -----------------------------------------------------------

    // handler для Код события
    const handleInput = (event: { target: { value: SetStateAction<string>; }; }) => {
        setKeyText(event.target.value);
        // console.log(event.target.value);
    }
    // ----------------------

    // Период и Указать вручную radioButton
    const [checkedByPeriod, setCheckedByPeriod] = useState(true);
    const [checkedByManual, setCheckedByManual] = useState(false);

    const handleCheckedByManual = () => {
        setCheckedByManual(true);
        setCheckedByPeriod(false);
        setTableOffset(0);
    }

    const handleCheckedByPeriod = () => {
        setCheckedByManual(false);
        setCheckedByPeriod(true);
        setTableOffset(0);
    }
    // ------------------------------------

    // Период select
    const [periodValue, setPeriodValue] = useState("1");

    const handlePeriodValue = (event: { target: { value: SetStateAction<string>; }; }) => {
        setTableOffset(0);
        setPeriodValue(event.target.value);
    }
    //-------------------

    // Указать вручную DatePicker
    const [manualBeginValue, setManualBeginValue] = useState<Date>(new Date());
    const handleManualBeginValue: DatePickerProps["onChange"] = (date, dateString) => {
        setManualBeginValue(new Date(dateString));
        setTableOffset(0);
    };

    const [manualEndValue, setManualEndValue] = useState<Date>(new Date());
    const handleManualEndValue: DatePickerProps["onChange"] = (date, dateString) => {
        setManualEndValue(new Date(dateString));
        setTableOffset(0);
    };
    // --------------------------


    // Показать
    const [tableOffset, setTableOffset] = useState<number>(0);
    const [tableLimit, setTableLimit] = useState<number>(15);
    const showTableDataFrame = async () => {
        checkedByPeriod && await requestPeriod();
        checkedByManual && await requestManual();
        checkedEventsByKey && await requestByKey();
        setTableOffset(tableOffset + tableLimit)
    }

    const requestPeriod = async () => {
        try {
            const now = new Date();
            const begin = new Date(now.setHours(now.getHours() - Number(periodValue)));
            // (!) после setHours значение в now меняется
            const r = await pprotoService.sendArchiveReq({
                begin: begin, end: new Date(), limit: tableLimit, offset: tableOffset
            });
            const currDataFrame: DataRow[] = [];
            r.items.forEach((item, index) => {
                const dataRow: DataRow = {
                    id: item.id,
                    humanId: item.humanId,
                    humanDetect: new Date(item.humanDetect).toLocaleString(),
                    doorIsOpen: item.doorIsOpen ? "Открыта" : "Закрыта",
                    offenseType: item.offenseType === 2 ? "Нахождение в зоне" : item.offenseType === 1 ? "Работа с печью" : "Не выявлено",
                    overall: item.overall === 0 ? "Нет" : "Есть",
                    screen: item.screen === 0 ? "Нет" : "Есть",
                    glove: item.glove === 0 ? "Нет" : "Есть",
                    boot: item.boot === 0 ? "Нет" : "Есть",
                    robe: item.robe === 0 ? "Нет" : "Есть",
                    pants: item.pants === 0 ? "Нет" : "Есть",
                };
                currDataFrame.push(dataRow);
            });
            setDataFrame(currDataFrame);
        } catch (e) {
            alert(`${e}`);
        }
    }

    const requestManual = async () => {
        try {
            const r = await pprotoService.sendArchiveReq({
                begin: manualBeginValue, end: manualEndValue, limit: tableLimit, offset: tableOffset
            });
            const currDataFrame: DataRow[] = [];
            r.items.forEach((item, index) => {
                const dataRow: DataRow = {
                    id: item.id,
                    humanId: item.humanId,
                    humanDetect: new Date(item.humanDetect).toLocaleString(),
                    doorIsOpen: item.doorIsOpen ? "Открыта" : "Закрыта",
                    offenseType: item.offenseType === 2 ? "Нахождение в зоне" : item.offenseType === 1 ? "Работа с печью" : "Не выявлено",
                    overall: item.overall === 0 ? "Нет" : "Есть",
                    screen: item.screen === 0 ? "Нет" : "Есть",
                    glove: item.glove === 0 ? "Нет" : "Есть",
                    boot: item.boot === 0 ? "Нет" : "Есть",
                    robe: item.robe === 0 ? "Нет" : "Есть",
                    pants: item.pants === 0 ? "Нет" : "Есть",
                };
                currDataFrame.push(dataRow);
            });
            setDataFrame(currDataFrame);
        } catch (e) {
            alert(`${e}`);
        }
    }

    const requestByKey = async () => {
        try {
            const r = await pprotoService.sendArchiveReq({archiveId: keyText + "%"});
            const currDataFrame: DataRow[] = [];
            r.items.forEach((item) => {
                const dataRow: DataRow = {
                    id: item.id,
                    humanId: item.humanId,
                    humanDetect: new Date(item.humanDetect).toLocaleString(),
                    doorIsOpen: item.doorIsOpen ? "Открыта" : "Закрыта",
                    offenseType: item.offenseType === 2 ? "Нахождение в зоне" : item.offenseType === 1 ? "Работа с печью" : "Не выявлено",
                    overall: item.overall === 0 ? "Нет" : "Есть",
                    screen: item.screen === 0 ? "Нет" : "Есть",
                    glove: item.glove === 0 ? "Нет" : "Есть",
                    boot: item.boot === 0 ? "Нет" : "Есть",
                    robe: item.robe === 0 ? "Нет" : "Есть",
                    pants: item.pants === 0 ? "Нет" : "Есть",
                };
                currDataFrame.push(dataRow);
            });
            setDataFrame(currDataFrame);
        } catch (e) {
            alert(`${e}`);
        }
    }
    // --------

    // Очистить
    const clearTableDataFrame = () => {
        setDataFrame([])
        setTableOffset(0)
    }
    // --------

    return (
        <div className="root">
            <div className="table">
                <div className="Status">
                    Статус: {pprotoStatus === "connected" ? "Подключено" : "Отключено"}
                </div>
                <div className="resultTable">
                    <DataTable
                        className="dataTables_wrapper"
                        columns={columns}
                        data={dataFrame}
                        defaultSortFieldId="Время события"
                        // pagination
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
                    <div className="radio" onClick={handleCheckedEventsByPeriod}>
                        <input className="radioButton"
                               type="radio"
                               checked={checkedEventsByPeriod}
                        />
                        <div className="textRadioButton">Поиск событий за период</div>
                    </div>
                    <div className="radio" onClick={handleCheckedEventsByKey}>
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
                                <div className="radio" onClick={handleCheckedByPeriod}>
                                    <input className="radioButton"
                                           type="radio"
                                           checked={checkedByPeriod}
                                    />
                                    <div className="textRadioButton">Период</div>
                                </div>
                                <select className="select" onChange={ e => handlePeriodValue(e)}>
                                    <option value="1">1 час</option>
                                    <option value="4">4 часа</option>
                                    <option value="8">8 часов</option>
                                    <option value="12">12 часов</option>
                                    <option value="24">24 часа</option>
                                    <option value="168">1 неделя</option>  // 24 * 7
                                    <option value="744">1 месяц</option>  // 24 * 31
                                </select>
                            </div>
                            <div className="radio" onClick={handleCheckedByManual}>
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
                    <button className="styled-button" onClick={showTableDataFrame}>
                        Показать { tableOffset !== 0 ? "ещё" : "" }
                    </button>
                    <button className="styled-button" onClick={clearTableDataFrame}>
                        Очистить
                    </button>
                    <button className="styled-button">
                        Экспорт файл
                    </button>
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
