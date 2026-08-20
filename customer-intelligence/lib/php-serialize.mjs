export function parsePhpSerialized(input) {
  if (typeof input !== 'string') throw new TypeError('Serialized value must be a string');
  let offset = 0;

  function expect(value) {
    if (!input.startsWith(value, offset)) {
      throw new Error(`Expected ${JSON.stringify(value)} at byte ${offset}`);
    }
    offset += value.length;
  }

  function readUntil(delimiter) {
    const end = input.indexOf(delimiter, offset);
    if (end === -1) throw new Error(`Missing ${delimiter} after byte ${offset}`);
    const value = input.slice(offset, end);
    offset = end + delimiter.length;
    return value;
  }

  function readBytes(length) {
    const start = offset;
    let bytes = 0;
    while (offset < input.length && bytes < length) {
      const code = input.codePointAt(offset);
      const character = String.fromCodePoint(code);
      bytes += Buffer.byteLength(character);
      offset += character.length;
    }
    if (bytes !== length) throw new Error(`Invalid string byte length at byte ${start}`);
    return input.slice(start, offset);
  }

  function parseValue() {
    const type = input[offset++];
    if (type === 'N') {
      expect(';');
      return null;
    }
    expect(':');
    if (type === 'i') return Number.parseInt(readUntil(';'), 10);
    if (type === 'd') return Number.parseFloat(readUntil(';'));
    if (type === 'b') return readUntil(';') === '1';
    if (type === 's') {
      const length = Number.parseInt(readUntil(':'), 10);
      expect('"');
      const value = readBytes(length);
      expect('";');
      return value;
    }
    if (type === 'a') {
      const count = Number.parseInt(readUntil(':'), 10);
      expect('{');
      const entries = [];
      for (let index = 0; index < count; index += 1) {
        entries.push([parseValue(), parseValue()]);
      }
      expect('}');
      const sequential = entries.every(([key], index) => key === index);
      return sequential ? entries.map(([, value]) => value) : Object.fromEntries(entries);
    }
    throw new Error(`Unsupported PHP serialized type ${JSON.stringify(type)}`);
  }

  const result = parseValue();
  if (offset !== input.length) throw new Error(`Unexpected data at byte ${offset}`);
  return result;
}
