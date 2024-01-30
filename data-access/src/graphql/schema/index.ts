/**
 * This file is used to traverse  all the files in this directory
 * and merge them together to create the application schema
 */

import { Resolvers } from '../generated';
import path from 'path';
import { mergeResolvers } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
// import { IRules, shield, allow } from 'graphql-shield';

console.log(`Loading resolvers from ${path.join(__dirname, "./**/*.resolvers.*")}`);
const resolversArray = loadFilesSync(path.join(__dirname, "./**/*.resolvers.*"));
// const shieldArray = loadFilesSync(path.join(__dirname, "./**/*.shield.*"));

export const resolvers: Resolvers = mergeResolvers(resolversArray);
// export const shields = shield(mergeResolvers(shieldArray) as IRules, {allowExternalErrors: true});