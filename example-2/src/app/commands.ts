import {usePproto} from "../pproto/pproto-react";
import {PprotoConnection, PprotoSubscription} from "../pproto/pproto";

// Команды
const LOG_COMMAND_TYPE = "a3691706-3376-424d-8bca-394d0df7e514";
const ARCHIVE_COMMAND_TYPE = "82a1ac8a-09fe-4c4b-b152-ac9a60be6e7d";
// -------

// Интерфейс для запроса Журнал событий
interface LogReqType {
  timeRange: {
    begin: number,
    end: number
  },
  paging: {
    limit: number,
    offset: number,
    total: number
  }
}
// ------------------------------------

// Интерфейс для ответа Журнал событий
interface LogAnswerType {
  timeRange: TimeRangeType;
  paging: PagingType;
  items: Array<ItemLogType>;
}

interface  TimeRangeType {
  begin: number;
  end: number;
}

interface PagingType {
  limit: number;
  offset: number;
  total: number
}

interface ItemLogType {
  eventTime: number;
  userSid: string;
  userName: string;
  description: string;
}
// ----------------------------------


// Интерфейс для запроса Архив нарушений
interface ArchiveReqType {
  timeRange: {
    begin: number,
    end: number
  },
  paging: {
    limit: number,
    offset: number,
    total: number
  }
}
// -------------------------------------

// Интерфейс для ответа Архив нарушений
interface ArchiveAnswerType {
  timeRange: TimeRangeType;
  paging: PagingType;
  archiveId: string;
  items: Array<ItemArchiveType>;
}

interface ItemArchiveType {
  id: number;
  humanId: number;
  humanDetect: string;
  doorIsOpen: boolean;
  offenseType: number;
  overall: number;
  screen: number;
  glove: number;
  boot: number;
  robe: number;
  pants: number;
}
// ------------------------------------

// Тестовый запрос Журнал событий
const now = new Date();
const nowInt64 = now.getTime()
const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
const monthAgoInt64 = monthAgo.getTime();

const TestReq = {
  timeRange: {
    begin: monthAgoInt64,
    end: nowInt64
  },
  paging: {
    limit: 20,
    offset: 0,
    total: -1
  }
};
// -----------------------------

// Сервис для работы с командами
export const usePprotoService = (): PprotoService => {
  const conn = usePproto();
  return new PprotoService(conn);
};

class PprotoService {
  constructor(private readonly conn: PprotoConnection) {}

  async sendLogReq(begin: Date, end: Date, limit: number=20, offset: number=0): Promise<LogAnswerType> {
    return this.conn.sendCommand(LOG_COMMAND_TYPE, this.createLogCommandContent(begin, end, limit, offset));
    // return this.conn.sendCommand(LOG_COMMAND_TYPE, TestReq);
  }

  async sendArchiveReq(begin: Date, end: Date, limit: number=20, offset: number=0): Promise<ArchiveAnswerType> {
    return this.conn.sendCommand(ARCHIVE_COMMAND_TYPE, this.createArchiveCommandContent(begin, end, limit, offset));
    // return this.conn.sendCommand(ARCHIVE_COMMAND_TYPE, TestReq);
  }

  // (?) скорее всего надо сделать ассинхронной -> добавить промис в возвращаемый тип
  createLogCommandContent(begin: Date, end: Date, limit: number, offset: number): LogReqType {
    return {
      timeRange: {
        begin: begin.getTime(),
        end: end.getTime()
      },
      paging: {
        limit: limit,
        offset: offset,
        total: -1
      }
    };
  }

  createArchiveCommandContent(begin: Date, end: Date, limit: number, offset: number): ArchiveReqType {
    return {
      timeRange: {
        begin: begin.getTime(),
        end: end.getTime()
      },
      paging: {
        limit: limit,
        offset: offset,
        total: -1
      }
    };
  }
}
// ------------------------------
