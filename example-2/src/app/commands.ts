import {usePproto} from "../pproto/pproto-react";
import {PprotoConnection, PprotoSubscription} from "../pproto/pproto";

export interface HelloAnswer {
  value: string;
}

export interface TestMessage {
  uuid: string;
  beginTest: boolean;
  endTest: boolean;
}

export interface EventMessage {
  eventName: string;
  eventData: number;
}

export interface EventLogAnswer {
  timeRange: TimeRangeType;
  paging: PagingType;
  items: Array<ItemType>;
}

export interface  TimeRangeType {
  begin: number;
  end: number;
}

export interface PagingType {
  limit: number;
  offset: number;
  total: number
}

export interface ItemType {
  eventTime: number;
  userSid: string;
  userName: string;
  description: string;
}

export interface ImageBase64Command {
  index: number;
}

export interface ImageBase64Answer {
  data: string;
}

const HELLO_COMMAND_TYPE = "b8338344-bec9-4f7d-b8e2-b81a6d4591c7";
const TEST_COMMAND_TYPE = "59cb5357-80bb-4fa4-a15e-4797a535b50d";
const ERROR_COMMAND_TYPE = "30d5b015-4e8f-4f53-a1a0-b36decd71f4f";
const EVENT_COMMAND_TYPE = "33925dba-4acd-4b45-a40c-7bc97bfbe761";
const IMAGE_BASE64_COMMAND_TYPE = "02224ccd-8bef-4473-b45b-f4d9a97f1102";
const EVENT_LOG_COMMAND_TYPE = "a3691706-3376-424d-8bca-394d0df7e514";


const now = new Date();
const nowInt64 = now.getTime()
const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
const monthAgoInt64 = monthAgo.getTime();


type typeEventLog = {
  timeRange: {
    begin: number,
    end: number
  },
  paging: {
    limit: number,
    offset: number,
    total: number
  }
};

const TestEventLog = {
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

export const useTestService = (): TestService => {
  const conn = usePproto();
  return new TestService(conn);
};

export class TestService {
  constructor(private readonly conn: PprotoConnection) {}

  async sendHello(): Promise<HelloAnswer> {
    return this.conn.sendCommand(HELLO_COMMAND_TYPE, null, 10);
  }

  createEventLogCommandContent(begin: Date, end: Date, limit: number, offset: number): typeEventLog {
    // alert(begin)
    // alert(end)
    // alert(begin.getTime())
    // alert(end.getTime())
    return {
      timeRange: {
        begin: begin.getTime(),
        end: end.getTime()
        // begin: begin,
        // end: end
      },
      paging: {
        limit: limit,
        offset: offset,
        total: -1
      }
    };
  }
  async sendEventLog(begin: Date, end: Date, limit: number=20, offset: number=0): Promise<EventLogAnswer> {
    return this.conn.sendCommand(EVENT_LOG_COMMAND_TYPE, this.createEventLogCommandContent(begin, end, limit, offset));
    // return this.conn.sendCommand(EVENT_LOG_COMMAND_TYPE, TestEventLog);
  }

  async sendEventLog2(): Promise<void> {
    return this.conn.sendCommand(EVENT_LOG_COMMAND_TYPE, TestEventLog);
  }

  async sendError(): Promise<void> {
    return this.conn.sendCommand(ERROR_COMMAND_TYPE, null);
  }

  async sendEvent(): Promise<void> {
    return this.conn.sendCommand(EVENT_COMMAND_TYPE, null);
  }

  onEvent(listener: (event: EventMessage) => void): PprotoSubscription {
    return this.conn.on(EVENT_COMMAND_TYPE, listener);
  }

  onEventLog(listener: (event: EventLogAnswer) => void): PprotoSubscription {
    return this.conn.on(EVENT_LOG_COMMAND_TYPE, listener);
  }

  async sendTest(command: TestMessage): Promise<TestMessage> {
    return this.conn.sendCommand(TEST_COMMAND_TYPE, command);
  }

  async sendImageBase64(
    command: ImageBase64Command
  ): Promise<ImageBase64Answer> {
    return this.conn.sendCommand(IMAGE_BASE64_COMMAND_TYPE, command);
  }
}
