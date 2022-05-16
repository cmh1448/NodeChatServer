import { Context, Next } from "koa";

export interface Exception {
  message: string;
  code: number;
}

export function Exception(message: string, code: number = 500) {
  const ex: Exception = {
    message: message,
    code: code,
  };

  return ex;
}

export async function exeptionHandler (ctx: Context, next: Next) {
  try{
    await next();
  }catch(ex: any) {
    ctx.body = ex.message;
    ctx.status = ex.code ?? '500';
  }
}