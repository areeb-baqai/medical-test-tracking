import { User } from "src/auth/auth.entity";
import { BloodTestService } from "./blood-test.service";
import {    Controller, Get, Param } from "@nestjs/common";            

@Controller('blood-tests')
export class BloodTestController {
    constructor(private bloodTestService: BloodTestService) {}

    @Get(':id')
    async getUserBloodTests(@Param('id') id: string) {
        return this.bloodTestService.getBloodTestsForUser(parseInt(id));
    }
}