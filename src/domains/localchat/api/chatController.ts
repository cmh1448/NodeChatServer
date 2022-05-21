import dayjs from 'dayjs';
import Router, { RouterContext } from 'koa-router';
import { createTicket } from '../../../configuration/security/securityUtil';
import { UserDetail } from '../../authentication/model/User';

const getTicket = async (ctx: RouterContext) => {
  const loginUser = ctx.state.user as UserDetail;
  const ticket = createTicket(loginUser);

  ctx.body = {
    message: 'Ticket Created',
    ticket: ticket,
    expire: dayjs().add(2, 'minute'),
  };

  ctx.status = 201;
};

const router = new Router();
router.get('/ticket', getTicket);

export default router;
