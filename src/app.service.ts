import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHello(): string {
    return `
      <!DOCTYPE html>
      <html style=background-color:#1e293b>
      <head>
        <title></title>
      </head>
      <body>
        <h1>HZ Api</h1>
        <p>Where all the data is handled...</p>
      </body>
      </html>
    `;
  }
}
