import {Injectable, Logger} from "@nestjs/common";
import {ModLinkList, NexusModSearch} from "./convertor.definition";

@Injectable()
export class ConvertorService {

	private readonly logger: Logger = new Logger(ConvertorService.name);

	async convert(fileContent: string) : Promise<ModLinkList> {
		const lines = fileContent
			.split('\n')
			// Skip first line
			.slice(1)
			// Exclude native mods
			.filter(line => !line.startsWith('*DLC'))
			// Exclude comments
			.filter(line => !line.startsWith('#'))
		;

		const modList: ModLinkList = [];
		const lineCount = lines.length;

		for (let i = 0; i < lineCount; i++) {
			const line = lines[i];

			// What to do with kind lol ?
			//const kind = line[0];
			const modName = line.substring(1);

			this.logger.log(`[${i}/${lineCount}] Searching for ${modName}`);
			const nexusModSearch = await this.searchNexusMods(modName);

			if (!nexusModSearch) {
				this.logger.error(`[${i}/${lineCount}] Failed to search for ${modName}`);
			}

			modList.push({
				name: modName,
				url: nexusModSearch?.results?.[0]?.url ?? null
			});
		}

		return modList;
	}

	async searchNexusMods(modName: string) : Promise<NexusModSearch> {
		const url = `https://api.nexusmods.com/mods?terms=${
			modName
				.replace(/[^a-zA-Z0-9 ]/g, "")
				.split(' ')
				.join(',')
		}&game_id=0&blocked_tags=&blocked_authors=&include_adult=1`;
		const response = await fetch(url);

		if (!response.ok)
			return null;

		return await response.json();
	}
}