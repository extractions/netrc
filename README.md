# `netrc` action

[![build](https://github.com/extractions/netrc/actions/workflows/build.yaml/badge.svg)](https://github.com/extractions/netrc/actions/workflows/build.yaml)

This GitHub Action will append an entry to the `~/.netrc` file for you. File
owner and access permission checks are done before writing to the file.

## Usage

### Inputs

| Name       | Required | Description                          | Type   | Default |
| ---------- | -------- | ------------------------------------ | ------ | ------- |
| `machine`  | yes      | Identifies a remote machine name     | string |         |
| `username` | no       | The user name for the remote machine | string | ''      |
| `password` | no       | The password for the remote machine  | string | ''      |

### Basic example

Add the following to your workflow.

```yaml
- uses: extractions/netrc@v2
  with:
    machine: some.private.domain.com
    username: ${{ secrets.USERNAME }}
    password: ${{ secrets.PASSWORD }}
```

### Example use case

In the below example we have a Python project that needs to install packages
from a private PyPI registry. We want to be able to check-in a
`requirements.txt` that contains an extra index URL but we don't want to
check-in the credentials

**`requirements.txt`:**

```
--extra-index-url https://pypi.private.domain.com

requests==2.23.0
private-package==2.8.3
```

**`.github/workflows/build.yaml`:**

```yaml
on: [push]

name: build

jobs:
  check:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: extractions/netrc@v2
        with:
          machine: pypi.private.domain.com
          username: ${{ secrets.PYPI_USERNAME }}
          password: ${{ secrets.PYPI_PASSWORD }}

      - uses: actions/setup-python@v5
        with:
          python-version: 3.8

      - run: pip install -r requirements.txt

      # tests follow...
```

## License

Licensed under either of

- Apache License, Version 2.0 ([LICENSE-APACHE](LICENSE-APACHE) or
   http://www.apache.org/licenses/LICENSE-2.0)
- MIT license ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)

at your option.
