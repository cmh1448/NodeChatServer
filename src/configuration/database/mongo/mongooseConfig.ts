import mongoose from 'mongoose';
import logger from '../../log/logger';

export default () => {
  mongoose
    .connect(process.env.MONGO_URI ?? '')
    .then(() => {
      logger.info('MongoDB connected');
    })
    .catch((err) => {
      logger.error(err);
    });
};
