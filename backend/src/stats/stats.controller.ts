import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { GetUser } from '../auth/user.decorator';
import { User } from '../auth/auth.entity';

@Controller('api/tests')
export class StatsController {
    constructor(private statsService: StatsService) {}

    @UseGuards(JwtAuthGuard)
    @Get('stats')
    async getTestStats(@GetUser() user: User) {
        return this.statsService.getTestStats(user.id);
    }
} 