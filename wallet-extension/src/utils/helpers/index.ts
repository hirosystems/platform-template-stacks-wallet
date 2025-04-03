async function hashUint8Array(data: Uint8Array) {
  if (!(data instanceof Uint8Array)) {
    throw new Error("Input must be a Uint8Array");
  }

  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  const hashArray = new Uint8Array(hashBuffer);

  const hashHex = Array.from(hashArray)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
}

export { hashUint8Array };
