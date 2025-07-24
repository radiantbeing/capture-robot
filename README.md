# Capture Robot

**English | [한국어](README.ko.md)**

Screenshot capture automation CLI tool

## Installation & Usage

```shell
$ npx capture-robot [command]
```

Global installation:

```shell
$ npm install -g capture-robot
$ capture-robot [command]
```

## Usage

### Help

```shell
$ capture-robot --help
$ capture-robot start --help
```

### List Available Monitors

```shell
$ capture-robot monitors

Available monitors:
  [ID: 2] Monitor #30544
```

### Automated Capture

**Simple example:**

```shell
$ capture-robot start -c 5 -d 3000
```

**Full options:**

```shell
$ capture-robot start \
    --count 10 \
    --delay 5000 \
    --monitor 2 \
    --interval 500 \
    --key enter \
    --output /tmp/screenshots \
    --overwrite
```

**Option descriptions:**

- `--count 10`: Capture 10 screenshots
- `--delay 5000`: Wait 5 seconds (5000ms) before starting
- `--monitor 2`: Use monitor ID 2 (check IDs with `monitors` command)
- `--interval 500`: 0.5 second (500ms) interval between captures
- `--key enter`: Press Enter key after each capture
- `--output /tmp/screenshots`: Specify output directory
- `--overwrite`: Allow overwriting existing files

## License

MIT License
