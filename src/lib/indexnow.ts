/**
 * Public IndexNow key. The matching file is served at /{INDEXNOW_KEY}.txt
 * (see public/). The key is meant to be public; do not add a CI secret.
 *
 * Submit updated URLs to https://api.indexnow.org/indexnow with
 * keyLocation https://olisbookshelf.com/{INDEXNOW_KEY}.txt
 */
export const INDEXNOW_KEY = "5058d13b230c9d374f2b0d74aef0e894";

export function indexNowKeyPath(): string {
  return `/${INDEXNOW_KEY}.txt`;
}

export function indexNowKeyLocation(origin: URL | string): string {
  return new URL(indexNowKeyPath(), origin).href;
}
