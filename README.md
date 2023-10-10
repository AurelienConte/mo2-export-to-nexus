# ModOrganizer2 Export list to NexusMods

This simple script convert a ModOrganizer2 export list to a NexusMods import list.
- Check "Modlist2023Feb.txt" for an example of the ModOrganizer2 export list.
- Check "Modlist2023Feb.txt.yaml" for an example of the NexusMods output.

## Usage

Use Node20 for this project. (fetch is supported in node 20)

```bash
yarn
yarn cli:dev convert ./Modlist2023Feb.txt
```

- Since retrieving nexusMods based on bad names is difficult, this tools help to found the right mods, but sometimes he is not accurate.

- You can see query used in the output file by adding a `--query` flag.
- You can filter results by gameId by adding a `--gameId XXX` flag. (XXX is the gameId)

## How to get the gameId ? 

- Go to a nexusMod game home like for skyrim SE -> https://www.nexusmods.com/skyrimspecialedition
- Open the network tab. 
- Reload
- You should see a request containing a number .csv by example for skyrim SE (1704.csv)

