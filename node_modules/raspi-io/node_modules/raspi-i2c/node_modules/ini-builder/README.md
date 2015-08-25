INI Builder
===========

INI builder is a tool for reading and writing INI and certain *NIX configuration files.

## Installation

```
npm install ini-builder
```

## Usage

INI builder takes in a string and parses it into an AST-like structure. This structure can then be edited, modifying sections, adding sections, removing sections, etc, and then serialized back to a string.

## Data Format

The ```parse``` method returns an array, with each entry corresponding to a line, or group of lines, in the document. Each entry will be in one of two forms. The ```serialize``` method accepts this data format.

The first form is a configuration entry, i.e. a key-value pair. This will always represent exactly one line in the document, and has the form:
 
```JavaScript
{
  value: [value],
  path: [path],
  comment: [comment]
}
```
 
The value is the value of the entry, and is always a string. The comment is any comment that appears _after_ the entry on the same line and is also a string. The path is one _or more_ keys for the entry. Some INI files support namespaced keys. As an example, let's say we're given the entry:

```ini
foo=bar=baz ; Setting foo bar to baz
```

The data entry would then be

```JavaScript
{
  value: 'baz',
  path: ['foo', 'bar']
  comment: '; Setting foo bar to baz'
}
```

The second form of entry is a non-configuration entry, i.e. comments and whitespace. This may represent one or more lines in the document, and has the form:

```JavaScript
{
  comment: [comment]
}
```

These entries will always consume all content between configuration entires or the start/end of the document. For example, let's say we have the following document:
 
```ini
; This is a document

; Let's set a value
foo=bar

; Now let's set another
foo2=foo3=bar2 ; Let's get fancy

; And let's end the document
```

This will produce the following data:

```JavaScript
[{
  comment: '; This is a document\n\n; Let\'s set a value'
}, {
  value: 'bar',
  path: [ 'foo' ]
}, {
  comment: '\n; Now let\'s set another'
}, {
  comment: '; Let\'s get fancy',
  value: 'bar2',
  path: [ 'foo2', 'foo3' ]
}, {
  comment: '\n; And let\'s end the document\n'
}]
```

## Editing or creating data

Editing parsed data, or creating your own, is straight forward. The data returned from ```parse``` is just a regular JavaScript array, so you can modify it like you can any other JavaScript array.

### Finding entries

INI builder provides two helper methods for searching for data: ```hasPath``` and ```find```. Both of these methods take parsed data as their first argument, and the path in question for the second. The path can be a string representing a single segment path, or an array of strings.

```hasPath``` returns a boolean indicating whether or not an entry with the supplied path exists in the data, whereas ```find``` returns the entry, if it exists, otherwise it returns undefined.

### Adding new entries

To add a new entry, just push it onto the array:

```JavaScript
data.push({
  path: ['myNewEntry']
  value: 'The value of my new entry'
});
```

### Editing existing entries

To edit existing entries, you must first get a reference to that entry. You can iterate over the array yourself, or you can use the ```find``` method, e.g.:

```JavaScript
var entry = iniBuilder.find(data, 'foo');
entry.value = 'bar2';
```

### Deleting entries

You can use any of the array prototype methods to remove one or more elements. Splice is usually the one you want to use:

```JavaScript
var entry = iniBuilder.find(data, 'foo');
data.splice(data.indexOf(entry), 1);
```

## Complete Example

Here is a complete example that reads in some data from ```data.ini``` and writes it out to ```modified-data.ini```.

```JavaScript

var fs = require('fs');
var iniBuilder = require('ini-builder');

// Read in the file and parse the raw information
var data = iniBuilder.parse(fs.readFileSync('data.ini'));

// Update the value we want to change
iniBuilder.find(data, 'foo').value = 'bar2';

// Save the results
fs.writeFileSync('modified-data.ini', iniBuilder.serialize(data));
```

## API

### parse(rawData, options)

Parses the raw data into the data format described above.

_Arguments_: 

<table>
  <thead>
    <tr>
      <th>Argument</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tr>
    <td>rawData</td>
    <td>String | Buffer</td>
    <td>The data to parse</td>
  </tr>
  <tr>
    <td>options (optional)</td>
    <td>Object</td>
    <td>The options to parse with</td>
  </tr>
  <tr>
    <td></td>
    <td colspan="2">
      <table>
        <thead>
          <tr>
            <th>Property</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tr>
          <td>commentDelimiter</td>
          <td>String</td>
          <td>The character used to delimit comments. Defaults to ";"</td>
        </tr>
      </table>
    </td>
  </tr>
</table>

_Returns_: The parsed data.

_Note: INI builder does not currently support sections._

### hasPath(data, path)

Checks if the given path is found in the data

_Arguments_: 

<table>
  <thead>
    <tr>
      <th>Argument</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tr>
    <td>data</td>
    <td>Array</td>
    <td>Data conforming to the parsed data spec</td>
  </tr>
  <tr>
    <td>path</td>
    <td>String | Array</td>
    <td>The path to search for</td>
  </tr>
</table>

_Returns_: A boolean indicating whether or not the given path was found in the data.

### find(data, path)

Finds the entry at the given path and returns it, if it exists.

_Arguments_: 

<table>
  <thead>
    <tr>
      <th>Argument</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tr>
    <td>data</td>
    <td>Array</td>
    <td>Data conforming to the parsed data spec</td>
  </tr>
  <tr>
    <td>path</td>
    <td>String | Array</td>
    <td>The path to search for</td>
  </tr>
</table>

_Returns_: The entry if one was found, otherwise undefined.

## serialize(data, options)

Serializes the data back to a string.

_Arguments_: 

<table>
  <thead>
    <tr>
      <th>Argument</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tr>
    <td>data</td>
    <td>Array</td>
    <td>The data to serialize</td>
  </tr>
  <tr>
    <td>options (optional)</td>
    <td>Object</td>
    <td>The options to serialize with</td>
  </tr>
  <tr>
    <td></td>
    <td colspan="2">
      <table>
        <thead>
          <tr>
            <th>Property</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tr>
          <td>commentDelimiter</td>
          <td>String</td>
          <td>The character used to delimit comments. Defaults to ";"</td>
        </tr>
      </table>
    </td>
  </tr>
</table>

License
=======

The MIT License (MIT)

Copyright (c) 2015 Bryan Hughes bryan@theoreticalideations.com (https://theoreticalideations.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
