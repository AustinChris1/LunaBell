# Directory listing PR for nimiq/awesome

The Nimiq Pay directory at nimpay.app/miniapps is built from
`nimiq/awesome/src/data/nimiq-mini-apps.json`. Listing LunaBell there is one PR.

1. Fork https://github.com/nimiq/awesome and clone the fork.
2. Copy `austinchris1-lunabell.svg` into `src/data/assets/mini-apps/`.
3. Insert the object in `nimiq-mini-apps.entry.json` into
   `src/data/nimiq-mini-apps.json`, alphabetically by name, case insensitive:
   after `Knock`, before `NimBooks`.
4. `cd src && pnpm install && pnpm run build` must pass.
5. Open the PR using the `mini-app.md` template. Description is under 200
   characters, type is `nimiq`, `featured` stays `false`.

The competition itself does not need this: once the portal PR merges, the Pay app
lists LunaBell from the competition feed automatically. This is the permanent
listing that outlives the cycle.
