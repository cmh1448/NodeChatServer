import Router, { RouterContext } from 'koa-router';
import { jwtAccess } from '../../../configuration/security/passport/authGuards';
import { getUserFromContext } from '../../authentication/model/User';
import { Exeption } from '../../exception/Exception';
import { Room } from '../model/Room';

const createRoom = async (ctx: RouterContext) => {
  const { name, description, userlimit } = ctx.request.body;

  const loginUser = await getUserFromContext(ctx);

  const room = new Room({
    name: name,
    description: description,
    userlimit: userlimit,
    users: [loginUser._id],
    admin: loginUser._id,
  });

  await room.save();

  const query = await Room.findById(room._id).exec();
  ctx.body = {
    message: 'Room Created',
    room: query?.toJSON(),
  };
  ctx.status = 201;
};

const addUser = async (ctx: RouterContext) => {
  const { user } = ctx.request.body;
  const loginUser = await getUserFromContext(ctx);

  const room = await Room.findById(ctx.params.id).exec();
  if (!room) throw new Exeption('Room Not Found In Repository', 404);
  if (room.admin._id !== loginUser._id) throw new Exeption('Unauthorized', 401);
  if (room.users.includes(user._id))
    throw new Exeption('User Already Exists', 409);
  if (room.userlimit <= room.users.length)
    throw new Exeption('Room is full', 409);

  room.users.push(user._id);
  await room.save();

  ctx.body = {
    message: 'User Added',
    room: room,
  };
  ctx.status = 201;
};

const removeUser = async (ctx: RouterContext) => {
  const { user } = ctx.request.body;
  const loginUser = await getUserFromContext(ctx);

  const room = await Room.findById(ctx.params.id).exec();
  if (!room) throw new Exeption('Room Not Found In Repository', 404);
  if (room.admin._id !== loginUser._id) throw new Exeption('Unauthorized', 401);
  if (!room.users.includes(user._id))
    throw new Exeption('User Not Found In Repository', 404);

  room.users = room.users.filter((id) => id !== user._id);
  await room.save();

  ctx.body = {
    message: 'User Removed',
    room: room,
  };
  ctx.status = 201;
};

const getAllRoomsAdmin = async (ctx: RouterContext) => {
  const loginUser = await getUserFromContext(ctx);

  const rooms = await Room.find({ admin: loginUser._id }).exec();
  ctx.body = rooms;
  ctx.status = 200;
};

const updateRoom = async (ctx: RouterContext) => {
  const { name, description, userlimit } = ctx.request.body;
  const loginUser = await getUserFromContext(ctx);

  const room = await Room.findById(ctx.params.id).exec();
  if (!room) throw new Exeption('Room Not Found In Repository', 404);
  if (room.admin._id !== loginUser._id) throw new Exeption('Unauthorized', 401);

  room.name = name;
  room.description = description;
  room.userlimit = userlimit;
  await room.save();

  ctx.body = {
    message: 'Room Updated',
    room: room,
  };
  ctx.status = 200;
};

const deleteRoom = async (ctx: RouterContext) => {
  const loginUser = await getUserFromContext(ctx);

  const room = await Room.findById(ctx.params.id).exec();
  if (!room) throw new Exeption('Room Not Found In Repository', 404);
  if (room.admin._id !== loginUser._id) throw new Exeption('Unauthorized', 401);

  await room.remove();

  ctx.body = {
    message: 'Room Deleted',
  };
  ctx.status = 200;
};

const getRoom = async (ctx: RouterContext) => {
  const room = await Room.findById(ctx.params.id).exec();
  if (!room) throw new Exeption('Room Not Found In Repository', 404);

  const loginUser = await getUserFromContext(ctx);
  if (!room.users.includes(loginUser._id)) throw new Exeption('Forbidden', 403);

  ctx.body = {
    message: 'Room Found',
    room: room.toJSON(),
  };
  ctx.status = 200;
};

const getAllRooms = async (ctx: RouterContext) => {
  const loginUser = await getUserFromContext(ctx);

  const rooms = await Room.find({
    users: { $in: [loginUser._id] },
  }).exec();

  ctx.body = {
    message: 'Rooms Found',
    rooms: rooms.map((room) => room.toJSON()),
  };
  ctx.status = 200;
};

const domainRouter = new Router();
domainRouter.post('/', jwtAccess, createRoom);
domainRouter.post('/user', jwtAccess, addUser);
domainRouter.delete('/user', jwtAccess, removeUser);
domainRouter.get('/admin', jwtAccess, getAllRoomsAdmin);
domainRouter.put('/', jwtAccess, updateRoom);
domainRouter.delete('/', jwtAccess, deleteRoom);
domainRouter.get('/:id', jwtAccess, getRoom);
domainRouter.get('/', jwtAccess, getAllRooms);

export default domainRouter;