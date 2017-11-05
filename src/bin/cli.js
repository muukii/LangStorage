#!/usr/bin/env node

// @flow

import program from 'commander'
import pkg from '../../package.json'
import { LanguageStore } from '../lib/langstorage.js'

program
  .version(pkg.version)

program
  .command("list <PATH>")
  .action((path) => {
    const store = new LanguageStore(path)
    console.log(store);
  })
  
program
  .command("update <PATH>")
  .action(() => {
    console.log("Do update");
  })
  
program
  .command("delete <PATH>")
  .action(() => {
    console.log("Do update");
  })
  
program
  .command('', ' ', { isDefault : true })
  .action(() => {
    
  })
  
program
  .parse(process.argv)
  
