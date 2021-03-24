#!/usr/bin/env node
import argv from 'minimist';
import { agor } from '.';

const args = argv(process.argv.slice(2));

async function cli() {
  try {
    agor(args);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}
cli();
