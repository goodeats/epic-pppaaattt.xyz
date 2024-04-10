// artboards will have version control now
// new prisma migration created the following tables:
// - ArtboardVersion, ArtboardBranch, ArtboardMergeRequest
// and the following changes to existing tables:
// - artboard: has many versions, branches, mergeRequests
// - layer: added artboardVersion, artboardBranch
// - design: added artboardVersion, artboardBranch

// the goal of this script:
// - for each artboard
// - - create a new version (latest)
// - - create a new branch (main)
// - - deep copy layers and designs to the new version and branch

// after this script runs, there is more work to do:
// - routing, ui, and api changes to support artboard versions and branches
export const createArtboardVersionsBranches = async () => {
	console.log('createArtboardVersionsBranches')
}

await createArtboardVersionsBranches()

// add the folowing to package.json scripts:
// "data:migrate": "npx vite-node ./prisma/data-migrations/create-artboard-versions-and-branches.ts"
// then run `npm run data:migrate`
// then remove the script from package.json
