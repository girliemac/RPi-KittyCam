## 1.3.1 (2015-4-27)

- Updated dependencies

## 1.3.0 (2015-2-21)

- Switched from traceur to babel for ES6->ES5 compilation

## 1.2.0 (2015-2-19)

- Upgraded NAN to get support for Node.js 0.12
  - io.js support is theoretically there, but won't work until https://github.com/TooTallNate/node-gyp/pull/564 is landed

## 1.1.6 (2015-2-11)

- Renamed this package to raspi.js (raspi in NPM) to better reflect the purpose.

## 1.1.5 (2015-1-21)

- Locked down the NAN version for now since code breaks on 1.5

## 1.1.4 (2014-12-29)

- Updated the README

## 1.1.3 (2014-12-20)

- Added a README
- Fixed a script compile issue that prevented 1.1.2 from including the reentrant fix

## 1.1.2 (2014-12-3)

- Made ```init``` properly reentrant

## 1.1.1 (2014-12-2)

- Bug fix in package.json

## 1.1.0 (2014-12-2)

- Switched to ECMAScript 6
- This is a breaking API change! The export structure is slightly different

## 1.0.5 (2014-11-27)

- Fixed a bad NPM publish

## 1.0.4 (2014-11-25)

- Switched to using wiringPiSetup instead of wiringPiSetupGpio

## 1.0.0-1.0.3 (2014-11-14)

- Implemented initial functionality and worked out the kinks in building during ```npm install```
