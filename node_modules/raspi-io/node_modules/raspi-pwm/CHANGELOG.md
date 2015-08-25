## 1.3.2 (2015-7-16)

- Updated dependencies
- Updated the repository links to point to their new location
- Added a contributing guide
- Added code linter
- Update code style to use newer best practices

## 1.3.1 (2015-3-17)

- Dependency update to fix a bug with destroying peripherals

## 1.3.0 (2015-2-21)

- Switched from traceur to babel for ES6->ES5 compilation

## 1.2.2 (2015-2-20)

- Fixed a bug with mismatched versions of the traceur runtime
- Skipped 1.2.1 because of a typo on my part when publishing (oops)

## 1.2.0 (2015-2-20)

- Removed prebuilt binary support as there are now multiple targets (need to use node-pre-gyp)
- Upgraded NAN to get support for Node.js 0.12
  - io.js support is theoretically there, but won't work until https://github.com/TooTallNate/node-gyp/pull/564 is landed

## 1.1.0 (2015-2-13)

- Added support for multiple PWMs. Note: the API was extended, but is backwards compatible with 1.0.x releases

## 1.0.5 (2015-2-12)

- README updates

## 1.0.4 (2015-1-21)

- Locked down the NAN version for now since code breaks on 1.5

## 1.0.3 (2015-1-8)

- Added pre-built lib so users don't have to compile on their own Raspberry Pis.

## 1.0.2 (2014-12-29)

- Added docs
- Switched to using the 'PWM0' pin nomenclature

## 1.0.1 (2014-12-6)

- Critical bug fix (why did I even publish 1.0.0?)

## 1.0.0 (2014-11-28)

- Initial implementation
