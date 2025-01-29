export class ResponseObj {
  public status: number;
  public message: string;
  public data: object | object[] | string;
  public toastMessage?: string;

  constructor(
    status: number,
    message: string,
    data: object | object[] | string,
    toastMessage?: string
  ) {
    this.status = status;
    this.message = message;
    this.data = data;
    this.toastMessage = toastMessage;
  }

  public toJson(): object {
    return { status: this.status, message: this.message, data: this.data };
  }

  public toPlain(): string {
    return `${this.status} ${this.message} ${JSON.stringify(this.data)}`;
  }

  public toJsonString(): string {
    return JSON.stringify({
      status: this.status,
      message: this.message,
      data: this.data,
    });
  }
}
