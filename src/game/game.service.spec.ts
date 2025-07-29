import { Test, TestingModule } from "@nestjs/testing";
import { GameService } from "./game.service";
import { getModelToken } from "@nestjs/mongoose";
import { Game } from "./schemas/game.schema";

describe("GameService", () => {
  let service: GameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameService,
        {
          provide: getModelToken(Game.name),
          useValue: {
            getMulliganWinratesForAllCards: jest.fn(),
            create: jest.fn()
          }
        }
      ]
    }).compile();

    service = module.get<GameService>(GameService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
