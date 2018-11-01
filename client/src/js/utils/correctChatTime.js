const correctChatTime = (time) => {
  const addZero = value => (value < 10 ? `0${value}` : value);
  const date = new Date(time);
  const day = addZero(date.getDay());
  const month = addZero(date.getMonth());
  const year = date.getFullYear();
  const hours = addZero(date.getHours());
  const minutes = addZero(date.getMinutes());
  const seconds = addZero(date.getSeconds());

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

export default correctChatTime;
