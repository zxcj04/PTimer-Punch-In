const formattedDate = (date) => {
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let min = date.getMinutes();
  let sec = date.getSeconds();

  if (day < 10) day = `0${day}`;
  if (month < 10) month = `0${month}`;
  if (hour < 10) hour = `0${hour}`;
  if (min < 10) min = `0${min}`;
  if (sec < 10) sec = `0${sec}`;

  return `${year}/${month}/${day} ${hour}:${min}:${sec}`;
};

export {
  formattedDate,
};