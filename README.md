# mini-lambda-ci-repro

A minimal, self-contained reproduction of `marketplace.monorepo`'s `lambda-pr-check.yaml`
design (SAV-690), built to verify the required-check + no-op + `coverage-guard` mechanism
end-to-end **without** needing CodeArtifact auth or any org-internal secrets. The workflow
files use the same job structure, action pins, and `coverage-guard` bash logic as the real
repo — only paths are scaled down to this repo's smaller tree.

## Layout

```
apps/demo-service/                          ← stand-in for a normal marketplace app (NestJS)
apps/demo-service/aws/lambdas/enrolled-hello/  ← the one lambda registered in the CI filter+matrix
.github/workflows/lambda-pr-check.yaml       ← real workflow (detect + check + coverage-guard)
.github/workflows/lambda-pr-check-noop.yaml  ← no-op pairing (same name + job id, inverse paths)
```

## One-time setup (after pushing to your own GitHub account)

1. `git init && git add -A && git commit -m "init mini-lambda-ci-repro"`
2. Create a new **empty** repo on your own GitHub account, then:
   `git remote add origin <your-repo-url> && git push -u origin main`
3. On GitHub, go to the **Actions** tab and enable workflows if prompted (new repos/forks
   sometimes need this confirmed once).
4. Go to **Settings → Branches → Add branch protection rule** for `main`, enable
   "Require status checks to pass before merging", and once the first PR below has run at
   least once, select **`Lambda PR Check / coverage-guard`** as a required check.

## Three test scenarios (map directly to SAV-690's Done-when)

| # | Branch / PR change | Expected result |
|---|---|---|
| ① | Edit `apps/demo-service/src/app.controller.ts` only | `lambda-pr-check.yaml` doesn't even trigger (paths don't match); `lambda-pr-check-noop.yaml` triggers and reports `Lambda PR Check / coverage-guard` as passing immediately → PR can merge without waiting |
| ② | Edit `apps/demo-service/aws/lambdas/enrolled-hello/src/index.ts` | `detect` finds `enrolled-hello`, `check` runs `npm ci && npm test` and passes, `coverage-guard` finds nothing unregistered and passes |
| ③ | Add a new dir `apps/demo-service/aws/lambdas/not-enrolled-hello/` **without** touching `lambda-pr-check.yaml`'s filter/matrix (simulates a developer forgetting to register a new lambda) | `detect` finds nothing → `check` is skipped (this is the "silent green" bug on its own); but `coverage-guard` diffs the PR, finds `not-enrolled-hello` missing from `COVERED`, and **fails** — required check blocks the merge |

Scenario ③ is the actual regression test for SAV-690's core claim: without `coverage-guard`,
this PR would merge green with zero test coverage on the new lambda.

## Known limitations of this rig (don't over-generalize from it)

- `check`'s `npm ci`/`npm test` here has no shared-package dependency, so it never exercises
  the `shared-gap-14` symlink issue from the real repo — this rig is scoped to SAV-690's
  required-check/no-op/coverage-guard question only.
- `pricing-discounts`'s real-world CodeArtifact auth gap isn't represented here — every
  lambda in this rig installs from the public npm registry only.
- Settings applied here (branch protection, required checks) are local to whatever GitHub
  repo you push this to — they don't propagate anywhere. The point of this rig is to prove
  the design before asking the team that owns `reddrummer/marketplace.monorepo`'s branch
  protection to apply the equivalent setting there.
