export class KeyCode {
  static left = new KeyCode(37);
  static down = new KeyCode(40);
  static right = new KeyCode(39);
  static up = new KeyCode(38);

  private keyCode: number;

  constructor(keyCode: number) {
    this.keyCode = keyCode;
  }

  toString() {
    return `KeyCode.${this.keyCode}`;
  }

  value() {
    return this.keyCode;
  }
}
