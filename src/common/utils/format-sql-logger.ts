/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { format } from "sql-formatter";
import { Logger } from "typeorm";

import { ConsoleLogger } from "@nestjs/common";

export class FormatSqlLogger extends ConsoleLogger implements Logger {
  constructor() {
    super();
  }
  private format = (query: string, params: any[]) =>
    "\n" +
    format(query.replace(/(\$(\s?)[0-9]+)/g, "?"), {
      params: params?.map((param) => `'${param}'`) || [],
    });

  logQuery(query: string, parameters: any[]) {
    const formatted = this.format(query, parameters);
    super.log(formatted, "TYPEORM");
  }
  logQueryError(error: string | Error, query: string, parameters: any[]) {
    const formatted = this.format(query, parameters);
    super.error(formatted, error, "TYPEORM");
  }
  logQuerySlow(time: number, query: string, parameters: any[]) {
    const formatted = this.format(query, parameters);
    super.warn(time + "s " + formatted, "TYPEORM");
  }
  logSchemaBuild(message: string) {
    super.log(message, "TYPEORM");
  }
  logMigration(message: string) {
    super.log(message, "TYPEORM");
  }

  log(message: any, context?: string) {
    super.log(message, context);
  }

  debug(message: any, context?: string) {
    super.debug(message, context);
  }
  error(message: any, stack?: string, context?: string) {
    super.error(message, stack, context);
  }

  warn(message: any, context?: string) {
    super.warn(message, context);
  }
}
