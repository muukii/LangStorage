'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Config = exports.Record = exports.LanguageStore = exports.LangDataStoreError = undefined;

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class LangDataStoreError {

  constructor(message) {
    this.message = message;
    this.domain = "me.muukii.lang";
    this.code = 0;
  }
}

exports.LangDataStoreError = LangDataStoreError;
class LanguageStore {

  constructor(yamlPath) {

    const source = _jsYaml2.default.safeLoad(_fs2.default.readFileSync(yamlPath, 'utf8'));
    this.yamlPath = yamlPath;
    this.source = source;
    this.config = new Config(source.config);

    console.log("Open Yaml");
    // console.log(source)
  }

  fetchFrom(identifier) {

    const results = this.source.strings.filter(o => {
      return o.id == identifier;
    });
    console.log(results[0]);

    if (results.length > 1) {
      throw new LangDataStoreError("Duplicated Language for " + identifier);
    }

    if (_lodash2.default.isEmpty(results)) {
      return null;
    }

    const record = new Record();
    record.source = _lodash2.default.head(results);
    return record;
  }

  update(record) {

    console.log("Update => " + record.toString());

    const index = _lodash2.default.findIndex(this.source.strings, { 'id': record.source.id });

    console.log("Index", index);

    if (index == -1) {
      console.log("Create => " + record.toString());

      if (record.source.id == null) {
        throw new LangDataStoreError("New Record must have id.");
      }

      this.source.strings.push(record.toRawObject());
    } else {
      console.log("Update => " + record.toString());
      this.source.strings[index] = record.toRawObject();
    }
  }

  remove(record) {

    const index = _lodash2.default.findIndex(this.source.strings, { 'id': record.source.id });
    this.source.strings.remove(index);
  }

  save() {

    const result = _jsYaml2.default.dump(this.source);
    _fs2.default.writeFileSync(this.yamlPath, result);
    console.log(result);
  }
}

exports.LanguageStore = LanguageStore;
class Record {

  constructor() {
    this.source = {};
  }

  setIdentifier(id) {
    this.source.id = id;
  }

  setLanguage(language, value) {
    this.source[language] = value;
  }

  setOption(key, value) {
    if (this.source.options == null) {
      this.source.options = {};
    }

    this.source.options[key] = value;
  }

  toRawObject() {
    return this.source;
  }
}

exports.Record = Record;
class Config {

  constructor(source) {

    // console.log(source);

    // this.records = source.languages
  }
}
exports.Config = Config;