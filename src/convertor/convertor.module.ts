import {Module} from "@nestjs/common";
import {ConvertorService} from "./convertor.service";
import {ConvertorCommand} from "./convertor.command";

@Module({
	providers: [
		ConvertorService,
		ConvertorCommand
	],
})
export class ConvertorModule {}