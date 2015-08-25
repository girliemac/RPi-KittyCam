## 3.3.4 (2015-7-18)

- Updated dependencies

## 3.3.3 (2015-7-14)

- Updated the repository links to point to their new location

## 3.3.2 (2015-7-14)

- Updated raspi-board dependency to pull in fix for overclocked board detection

## 3.3.1 (2015-7-13)

- Added missing es6-symbol shim
- Marked certain unimplemented methods as won't implement
- Added a contributing guide
- Added code linter
- Update code style to use newer best practices

## 3.3.0 (2015-7-2)

- Added pingRead stub. It's currently unimplemented, but will at least throw a nice error.

## 3.2.2 (2015-6-1)

- Added a shim for Symbol to get raspi-io working on Node.js 0.10 again

## 3.2.1 (2015-5-26)

- Updated I2C dependency to pull in the latest raspi-i2c

## 3.2.0 (2015-5-18)

- Updated I2C dependency to pull in the latest raspi-i2c
- Added support for controlling the status LED (set as the default LED)

## 3.1.1 (2015-3-25)

- I2C support!!!

## 3.0.1 (2015-3-17)

- Dependency update to fix a bug with destroying peripherals

## 3.0.0 (2015-3-9)

- POTENTIALLY BREAKING CHANGE. Changed the default mode for each pin from INPUT to UNKNOWN
  - This is a necessary change for incorporating I2C support, which is coming very soon

## 2.2.3 (2015-3-8)

- Added pin normalization to all instance lookups

## 2.2.2 (2015-2-28)

- Fixed a method name typo, causing new five.Pin(1) to crash

## 2.2.1 (2015-2-21)

- Fixed a bug with board.pins[mypin].mode not reporting the correct value

## 2.2.0 (2015-2-21)

- Switched from traceur to babel for ES6->ES5 compilation

## 2.1.0 (2015-2-20)

- Upgraded dependencies to add support for Node 0.12
  - io.js support is theoretically there too, but won't work until https://github.com/TooTallNate/node-gyp/pull/564 is landed


## 2.0.7 (2015-2-17)

- Fixed a pin normalization bug with pinMode
- Updated dependencies

## 2.0.6 (2015-2-12)

- Fixed a bug with pin numbering on the B+/A+

## 2.0.5 (2015-2-11)

- Refactored raspi-core usage to match the new name
- README updates

## 2.0.4 (2015-2-8)

- Relaxed restrictions on calling methods with mismatched modes.

## 2.0.3 (2015-1-7)

- Fixed a bug with mode checking in digitalRead

## 2.0.2 (2014-2-30)

- Added error checking to the ```normalize``` method to make exceptions more readable

## 2.0.1 (2014-12-8)

- Added support for the capability queries

## 2.0.0 (2014-12-6)

- Total rewrite! Now uses wiringPi under the hood
- PWM support included
- New pin mapping scheme, see README. The pin numbering scheme has CHANGED!

## 1.0.3 (2014-11-14)

- Cleaned up the README

## 1.0.1-1.0.2 (2014-10-06)

- Migrated repo to GitHub

## 1.0.0 (2014-08-20)

- Added support for the Raspberry Pi B+
- Bumped the version to 1.0.0. NO BREAKING API CHANGES, but switching the version to better conform with semver. See https://twitter.com/izs/status/494980144197402625

## 0.1.14 (2014-07-25)

- Added proper API documentation

## 0.1.12 (2014-07-16)

- Fleshed out default LED access from Johnny Five

## 0.1.11 (2014-07-14)

- Fixed a bug with LEDs on Arch Linux

## 0.1.10 (2014-07-14)

- Fixed a super embarrassing typo

## 0.1.9 (2014-06-09)

- Fixed a bug where if you passed in a number as an alias, it caused a crash

## 0.1.8 (2014-05-22)

- Added support for ```normalize()``` and ```defautLed```

## 0.1.7 (2014-05-15)

- Re-added the root user check, but this time left it as a warning, not a hard error

Note: there was an error publishing 0.1.6 which prevented using that version number

## 0.1.5 (2014-05-15)

- Removed the root user check because it's causing resin.io to break. Will fix later.

## 0.1.4 (2014-05-13)

- Fixed a publishing problem (functionality same as 0.1.3)

## 0.1.3 (2014-05-13)

- Added a check for superuser access

## 0.1.2 (2014-05-12)

- Fleshed out error messaging for initial inclusion in Johnny-Five

## 0.1.1 (2014-05-04)

- API compatibility fixes
    - Reading values while in OUTPUT mode
    - ```data-read-#``` event added

## 0.1.0 (2014-05-03)

- Initial release including support for GPIO
