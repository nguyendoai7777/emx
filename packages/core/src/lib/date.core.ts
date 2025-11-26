import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import vi from 'dayjs/locale/vi.js';

dayjs.extend(relativeTime);
dayjs.locale(vi);
export const passiveOf = (date: string | Date) => {
  return dayjs(date).fromNow();
};

export const day = dayjs;
