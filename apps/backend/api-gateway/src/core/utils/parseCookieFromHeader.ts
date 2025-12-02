export const parseCookieFromHeader = (header: string, name: string) => {
  return header
    .split(';')
    .map((s) => s.trim())
    .find((p) => p.startsWith(`${name}=`))
    ?.split('=')[1];
};
