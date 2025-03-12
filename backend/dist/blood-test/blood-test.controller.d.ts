import { BloodTestService } from "./blood-test.service";
export declare class BloodTestController {
    private bloodTestService;
    constructor(bloodTestService: BloodTestService);
    getUserBloodTests(id: string): Promise<import("./blood-test.entity").BloodTest[]>;
}
