import {Injectable, Logger} from "@nestjs/common";
import {blacklistedWords, ModLinkList, NexusModSearch} from "./convertor.definition";

@Injectable()
export class ConvertorService {

	private readonly logger: Logger = new Logger(ConvertorService.name);

	async convert(fileContent: string, gameId: number = 0): Promise<ModLinkList> {
		const lines = fileContent
			.split('\n')
			// Skip first line
			.slice(1)
			// Exclude native mods
			.filter(line => !line.startsWith('*DLC'))
			// Exclude comments
			.filter(line => !line.startsWith('#'))
			// Exclude empty lines
			.filter(line => line.length > 0)
			// Exclude lines with only spaces
			.filter(line => line.trim().length > 0)
		;

		this.logger.log(`Found ${lines.length} mods`);

		const modList: ModLinkList = [];
		const lineCount = lines.length;

		for (let i = 0; i < lineCount; i++) {
			const line = lines[i];

			// What to do with kind lol ?
			//const kind = line[0];
			const modName = line.substring(1);

			this.logger.log(`[${i}/${lineCount}] Searching for ${modName}`);
			const {res: nexusModSearch, query} = await this.searchNexusMods(modName, gameId);

			if (!nexusModSearch) {
				this.logger.error(`[${i}/${lineCount}] Failed to search for ${modName}`);
			}

			modList.push({
				name: modName,
				query,
				nexusModName: nexusModSearch?.results?.[0]?.name ?? null,
				url: nexusModSearch?.results?.[0]?.url ?? null
			});
		}

		return modList;
	}

	async searchNexusMods(modName: string, gameId: number = 0): Promise<{ res: NexusModSearch, query: string }> {

		if (!modName)
			return null;

		let nexusModName = modName
			// Remove special characters
			.replace(/[^a-zA-Z0-9 ]/g, " ")
			.split(' ');

		// If any word are camel case, split them
		for (let i = 0; i < nexusModName.length; i++) {
			const word = nexusModName[i];

			// If word is camel case
			// Starting with uppercase letter and next letter is lowercase letter (ex: "ModName") exclude full uppercase words (ex: "MODNAME")
			if (word.match(/^[A-Z][a-z]/) && !word.match(/^[A-Z]+$/)) {
				const split = word.split(/(?=[A-Z])/);
				nexusModName.splice(i, 1, ...split);
			}
		}

		nexusModName = nexusModName
			// Remove empty words
			.filter(word => word.length > 0)
			// Remove numbers
			.filter(word => !word.match(/^[0-9]+$/))
			// Remove words with less than 3 characters
			.filter(word => word.length > 2)
			// Remove spaces
			.map(word => word.trim())
			// Remove blacklisted words
			.filter(word => !blacklistedWords.includes(word.toLowerCase()))
		;

		const url = `https://api.nexusmods.com/mods?terms=${nexusModName.join(',')}&game_id=${gameId}&blocked_tags=&blocked_authors=&include_adult=1`;
		const response = await fetch(url);

		if (!response.ok) {
			this.logger.error(`Failed to search for ${modName}`);
		}

		return {
			res: await response.json(),
			query: nexusModName.join(','),
		};
	}
}