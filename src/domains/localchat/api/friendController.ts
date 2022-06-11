import Router, { RouterContext } from 'koa-router';
import { User, UserDetail } from '../../authentication/model/User';
import { Exeption } from '../../exception/Exception';
import { FriendTable } from '../model/FriendTable';

const getFriendList = async (ctx: RouterContext) => {
  const user = ctx.state.user as UserDetail;

  const friendTable = await FriendTable.findOne({
    user: user._id,
  })
    .populate('User')
    .exec();

  const friendlist = friendTable?.friends ?? [];

  ctx.body = friendlist;
};

const addFriend = async (ctx: RouterContext) => {
  const user = ctx.state.user as UserDetail;
  const { friendEmail } = ctx.request.body;

  const friendTable = await FriendTable.findOne({
    user: user._id,
  }).exec();

  const friend = await User.findOne({
    email: friendEmail,
  }).exec();

  if (!friend) throw new Exeption('No Friend Found', 404);

  if (!friendTable) {
    const friendTable = new FriendTable({
      user: user._id,
      friends: [friend?._id],
    });
    await friendTable.save();
    return;
  }

  if (!friendTable.friends.includes(friend._id)) {
    friendTable.friends.push(friend._id);
    await friendTable.save();
  }

  ctx.body = {
    message: 'Friend Added',
    friendTable,
  };
};

const removeFriend = async (ctx: RouterContext) => {
  const user = ctx.state.user as UserDetail;
  const { friendId } = ctx.request.body;

  const friendTable = await FriendTable.findOne({
    user: user._id,
  }).exec();

  if (!friendTable) throw new Exeption('Friend Not Found', 404);

  if (friendTable.friends.includes(friendId)) {
    friendTable.friends.splice(friendTable.friends.indexOf(friendId), 1);
    await friendTable.save();
  } else {
    throw new Exeption('Friend Not Found', 404);
  }

  ctx.body = {
    message: 'Friend Removed',
    friendTable,
  };
};

const router = new Router();
router.get('/', getFriendList);
router.post('/', addFriend);
router.delete('/', removeFriend);

export default router;
