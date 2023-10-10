export type NexusModSearch = {
	terms: Array<string>
	exclude_authors: Array<any>
	exclude_tags: Array<any>
	include_adult: boolean
	took: number
	total: number
	results: Array<{
		name: string
		downloads: number
		endorsements: number
		url: string
		image: string
		username: string
		user_id: number
		game_name: string
		game_id: number
		mod_id: number
	}>
}

export type ModLinkList = Array<{
	name: string
	query: string
	nexusModName: string
	url: string
}>

export const blacklistedWords = [
	'and',
	'for',
	'of',
	'the',
	'with',
	'without',
	'from',
	'sse',
	'skyrim'
];