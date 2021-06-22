/**
 * Class for dealing with HAP TLV data.
 */

// const kTLVType_Separator = 255;

export type TLV = Map<number, Buffer>;

/**
 * Decode a buffer into a TLV object.
 *
 * See Chapter 12.1
 *
 * @param {Buffer} buffer - Buffer to decode
 * @returns {TLV} TLV object
 */
export function decodeBuffer(buffer: Buffer): TLV {
  let pos = 0, ret: TLV = new Map<number, Buffer>();
  while (buffer.length - pos > 0) {
      let [ type, length ] = buffer.slice(pos);

      pos += 2;

      let newData = buffer.slice(pos, pos + length);
      
      if (ret.has(type)) {
          ret.set(type, Buffer.concat([ret.get(type) as Buffer, newData]))
      } else {
        ret.set(type, newData);
      }

      pos += length;
  }

  return ret;
}

/**
 * Encode a TLV object into a buffer.
 *
 * See Chapter 12.1
 *
 * @param {TLV} obj - TLV object to encode
 * @returns {Buffer} Encoded buffer
 */
export function encodeObject(object: TLV): Buffer {
    let encodedBuffer = Buffer.alloc(0);

    let type: number;
    let data: Buffer;
    for ([type, data] of object) {
      let position: number = 0;
      while (data.length - position > 0) {
        let length = Math.min(data.length - position, 255);

        encodedBuffer = Buffer.concat([
            encodedBuffer, Buffer.from([type, length]),
            data.slice(position, position + length)
        ]);

        position += length;
      }
    }

    return encodedBuffer;
}
