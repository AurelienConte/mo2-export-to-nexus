import {Command, CommandRunner} from "nest-commander";
import {Logger} from "@nestjs/common";
import * as fs from "fs";
import {ConvertorService} from "./convertor.service";
import {ModLinkList} from "./convertor.definition";

@Command({ name: 'convert', description: 'Convert a ModOrganizer2 list to NexusMods Links' })
export class ConvertorCommand extends CommandRunner {

	private readonly logger = new Logger(ConvertorCommand.name);

	constructor(
		private readonly convertorService: ConvertorService
	) {
		super();
	}

	async run(passedParam: string[]) {

		if (passedParam.length === 0) {
			this.logger.error('No file path provided');
			return;
		}

		const filePath = passedParam[0];
		const outputPath = filePath + '.yaml';

		if (!fs.existsSync(filePath)) {
			this.logger.error(`File ${filePath} does not exists`);
			return;
		}

		if (fs.existsSync(outputPath)) {
			// Remove file
			fs.unlinkSync(outputPath);
		}

		const fileContent = fs.readFileSync(filePath, 'utf8');

		this.logger.log(`File loaded from ${filePath}, converting...`);

		const outputFilContent: ModLinkList = await this.convertorService.convert(fileContent);

		this.logger.log(`File converted, saving...`);

		const header = 'modList:\n'
		const lineContent = outputFilContent.map(mod => `- name: ${mod.name}\n  url: ${mod.url ? 'https://www.nexusmods.com' + mod.url : 'null'}`).join('\n');

		fs.writeFileSync(outputPath,
			header + lineContent,
		);

		this.logger.log(`File converted and saved to ${outputPath}`);
	}
}