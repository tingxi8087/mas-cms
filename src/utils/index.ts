/** 获取环境变量 */
export function isBeta() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  return import.meta.env.VITE_ENV == "dev";
}
export function getENV() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  return import.meta.env.VITE_ENV;
}
