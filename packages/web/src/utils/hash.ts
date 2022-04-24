import * as md5Module from "js-md5";

export function md5(input: string): string {
  const hash = md5Module.create();
  hash.update(input);
  return hash.hex();
}
