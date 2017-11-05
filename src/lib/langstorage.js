/* @flow */

import yaml from 'js-yaml'
import fs from 'fs'
import _ from 'lodash'

export class LangDataStoreError {
  
  message: string
  domain: string
  code: number
  
  constructor(message: string) {
    this.message = message
    this.domain = "me.muukii.lang"
    this.code = 0
  }
}

export class LanguageStore {
  
  source: {
    config : { languages : string[] },
    strings: any
  }
  
  config: Config
  yamlPath: string
    
  constructor(yamlPath: string) {
        
    const source = yaml.safeLoad(fs.readFileSync(yamlPath, 'utf8'))
    this.yamlPath = yamlPath
    this.source = source
    this.config = new Config(source.config)
    
    console.log("Open Yaml")
    // console.log(source)
  }
  
  fetchFrom(identifier: string): ?Record {
    
    const results = this.source.strings.filter((o) => { return o.id == identifier })
    console.log(results[0])
    
    if (results.length > 1) {
      throw new LangDataStoreError("Duplicated Language for " + identifier)
    }
        
    if (_.isEmpty(results)) {
      return null
    }
  
    const record = new Record()
    record.source = _.head(results)
    return record
  }
  
  update(record: Record) {
    
    console.log("Update => " + record.toString())
    
    const index = _.findIndex(this.source.strings, { 'id' : record.source.id})
    
    console.log("Index", index)
    
    if (index == -1) {
      console.log("Create => " + record.toString())
      
      if (record.source.id == null) {
        throw new LangDataStoreError("New Record must have id.")
      }
      
      this.source.strings.push(record.toRawObject())
    } else {
      console.log("Update => " + record.toString())
      this.source.strings[index] = record.toRawObject()
    }
  }
  
  remove(record: Record) {
    
    const index = _.findIndex(this.source.strings, { 'id' : record.source.id })
    this.source.strings.remove(index)
  }
  
  save() {
    
    const result: string = yaml.dump(this.source)
    fs.writeFileSync(this.yamlPath, result)
    console.log(result)
  }
}

export class Record {
  
  source: any
  
  constructor() {
    this.source = {}
  }
    
  setIdentifier(id: string) {
    this.source.id = id
  }
  
  setLanguage(language: string, value: string) {
    this.source[language] = value
  }
  
  setOption(key: string, value: string) {
    if (this.source.options == null) {
      this.source.options = {}
    }
    
    this.source.options[key] = value
  }
    
  toRawObject(): any {
    return this.source
  }
}

// @flow
export class Config {
  
  constructor(source: any) {
    
    // console.log(source);
    
    // this.records = source.languages
  }
}
