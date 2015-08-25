## 2.2.1 (2015-7-14)

- Updated the repository links to match the new location

## 2.2.0 (2015-7-14)

- Realized that this should be a minor bump, not a patch bump
- There is a very subtle behavior change in getPinNumber
  - If a pin is not found, it now returns null instead of undefined
  - The behavior when a pin is not found was previously undocumented before this release

## 2.1.3 (2015-7-14)

- Fixed a bug with detecting overclocked RPi revisions
- Added .eslintrc file
- Updated code to pass linting

## 2.1.2 (2015-3-29)

- Added some error checking to getPinNumber to prevent a crash when passing in undefined or null

## 2.1.1 (2015-3-17)

- Fixed a broken unit test

## 2.1.0 (2015-2-21)

- Switched from traceur to babel for ES6->ES5 compilation

## 2.0.0 (2015-2-17)

- Added support for the Raspberry Pi 2
- Added constants for the different board revisions
- Cleaned up error handling surrounding unsupported or unknown versions
- Reworked getBoardRevision to return one of the above constants. THIS IS A BREAKING CHANGE!

## 1.3.0 (2015-2-12)

- Added getBoardRevision method

## 1.2.2 (2014-12-30)

- Added support for looking up Wiring Pi pin numbers that are passed in as a string

## 1.2.1 (2014-12-29)

- README updates

## 1.2.0 (2014-12-20)

- Added P5 support for R2 models
- Added some missed peripherals
- POTENTIALLY BREAKING: Modified all peripherals to have a number, so "SDA"->"SDA0", etc
  - This change was done to allow for multiple SPI connections
  - It's possible there will be multiple I2C and UART pins on future revisions (the BCM2835 supports them)

## 1.1.2 (2014-12-2)

- Well this is embarrassing, I had a bug in package.json

## 1.1.1 (2014-12-1)

- Bug fix with looking up a pin number by said pin number

## 1.1.0 (2014-12-1)

- Switched to using ECMAScript 6
- Added peripheral usage and removed # => P1-# mappings
  - This is a breaking API change!

## 1.0.2 (2014-11-27)

- Reworked aliases so that they map to Wiring Pi numbers, not header numbers
- Added support for "P1-#" style identifiers so that eventually P5 can be supported too 

## 1.0.0-1.0.1 (2014-11-26)

- Implemented initial functionality
