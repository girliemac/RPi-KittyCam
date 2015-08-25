## 1.4.0 (2015-7-16)

- Reverted the changes in 1.3.0
  - The performance tradeoffs weren't worth the ease of installation, sadly
- Updated dependencies
- Updated the repository links to point to their new location
- Added a contributing guide
- Added code linter
- Update code style to use newer best practices

## 1.3.0 (2015-6-2)

- Switched to using node-ffi for calling Wiring Pi.
    - See https://github.com/nodejs/hardware/issues/11 for more info

## 1.2.1 (2015-3-17)

- Dependency update to fix a bug with destroying peripherals

## 1.2.0 (2015-2-21)

- Switched from traceur to babel for ES6->ES5 compilation

## 1.1.0 (2015-2-19)

- Upgraded NAN to get support for Node.js 0.12
  - io.js support is theoretically there, but won't work until https://github.com/TooTallNate/node-gyp/pull/564 is landed

## 1.0.5 (2015-2-12)

- Updated the README to reflect the change to Raspi.js

## 1.0.4 (2015-1-21)

- Locked down the NAN version for now since code breaks on 1.5

## 1.0.3 (2015-1-7)

- New README
- Code cleanup

## 1.0.2 (2014-12-5)

- Bug fix when reading from a destroyed input

## 1.0.1 (2014-12-2)

- Refactored to match changes in raspi-peripheral

## 1.0.0 (2014-11-12)

- Initial implementation