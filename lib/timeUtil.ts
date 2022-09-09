export function UTCToLocal(date: Date | null) {
  if (date) {
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset);
  }
}
export function LocalToUTC(date: Date) {
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() + tzOffset);
}

const res = UTCToLocal(new Date());
console.log(res);
