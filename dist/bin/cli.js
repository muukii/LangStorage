#!/usr/bin/env node
'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _package = require('../../package.json');

var _package2 = _interopRequireDefault(_package);

var _langstorage = require('../lib/langstorage.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_commander2.default.version(_package2.default.version);

_commander2.default.command("list <PATH>").action(path => {
  const store = new _langstorage.LanguageStore(path);
  console.log(store);
});

_commander2.default.command("update <PATH>").action(() => {
  console.log("Do update");
});

_commander2.default.command("delete <PATH>").action(() => {
  console.log("Do update");
});

_commander2.default.command('', ' ', { isDefault: true }).action(() => {});

_commander2.default.parse(process.argv);