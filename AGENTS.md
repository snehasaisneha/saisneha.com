# Repository Instructions

## Git and signing

- Do not bypass commit signing in this repository.
- All commits must be created with elevated permissions when needed so the normal 1Password-backed SSH signing flow can work.
- Do not use `--no-gpg-sign` for commits unless the user explicitly asks for an unsigned commit.
- If signing fails because the 1Password agent is unavailable, stop and ask the user to restore the signing environment instead of forcing the commit through unsigned.
- Pushes may require elevated permissions for network access, but that does not change the requirement that commits themselves should remain signed.
