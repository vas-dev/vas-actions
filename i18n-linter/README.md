# I18n Linter

:warning: WIP :warning:

Checks new PRs for missing translation keys when using [react-i18nify](https://github.com/JSxMachina/react-i18nify) and leaves a comment

![Example](https://user-images.githubusercontent.com/216782/52160571-eada2880-266c-11e9-91fc-357b56c21632.png)

## Usage

```yaml
name: Lint I18n
on:
  pull_request:
    types: [opened, synchronize]
jobs:
  action-filter:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - name: lint
        uses: vas-dev/vas-actions/i18n-linter@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          TRANSLATION_PATH: path/to/translations.en.json
```

### Maintainers

- [Marcelo Alves](https://github.com/marceloalves)
- [Jason Soares](https://github.com/jasonsoares)
