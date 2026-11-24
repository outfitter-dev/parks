# Changesets

Add a changeset with `bun run changeset` when a pull request changes `@outfitter/parks` in a way its users would notice.

Releases are cut from the changesets on `main`:

1. Each push to `main` updates a "chore: version packages" pull request that bumps the version and writes the changelog.
2. Merging that pull request needs the maintainer's go-ahead.
3. The maintainer then runs the Release workflow by hand from `main`. It checks the repo, stages the version on npm through trusted publishing with provenance, and tags the release. The version becomes installable only when the maintainer approves it on npm with 2FA.
