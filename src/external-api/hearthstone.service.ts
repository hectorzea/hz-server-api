// import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
// import { lastValueFrom, map } from "rxjs";

@Injectable()
export class HearthstoneApiService {
  private readonly logger = new Logger(HearthstoneApiService.name);
  constructor() {}

  // async findCardByName(cardName: string) {
  //   const response = this.httpService
  //     .get(`/${encodeURI(cardName)}`)
  //     .pipe(map((response: { data: HearthstoneCardInfo[] }) => response.data));

  //   const results = await lastValueFrom(response);
  //   return results
  // }
}
