export function jsonToURLEncoded(object: Record<string, any>) {
  const queries = [];

  for (const key in object) {
    let value = object[key];
    if (Array.isArray(value)) {
      value = value.join(" ");
    }

    queries.push(key + "=" + value);
  }
  return queries.join("&");
}
