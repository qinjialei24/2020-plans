import { CatsService } from './cats.controller.service';
export declare class CatsController {
    private readonly catsService;
    constructor(catsService: CatsService);
    findOne(id: string): string;
}
