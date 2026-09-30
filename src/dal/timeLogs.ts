// TODO: Student implementation - Part 2: DAL for time logs

import { db } from "../db/database.js";

export async function insertTimeLog(
  ticketId: number,
  userId: number,
  hours: number,
): Promise<any> {
  // TODO: Student implementation
  //inserts a row into time_logs
  const newTimeLog = await db  
    .insertInto('time_logs')
    .values({
      ticket_id: ticketId,
      user_id: userId,
      hours: hours,
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  return newTimeLog;
}

export async function getTotalHoursForTicket(
  ticketId: number,
): Promise<number> {
  // TODO: Student implementation
  const result = await db
    .selectFrom('time_logs')
    .select((eb) => eb.fn.sum<number | string>('hours').as('total_hours'))
    .where('ticket_id', '=', ticketId)
    .executeTakeFirst();
  return Number(result?.total_hours ?? 0);
}
