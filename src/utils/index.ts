//判断token是否失效

function ifTokenTime(time: number): boolean {
  let t: number = Math.floor(new Date().getTime() / 1000);

  if (t < time) {
    return true;
  } else {
    return false;
  }
}

export { ifTokenTime };
