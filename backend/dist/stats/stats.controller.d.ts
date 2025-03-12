import { StatsService } from './stats.service';
import { User } from '../auth/auth.entity';
export declare class StatsController {
    private statsService;
    constructor(statsService: StatsService);
    getTestStats(user: User): Promise<{
        totalTests: number;
        lastTestDate: string;
    }>;
}
