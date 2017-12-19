/* This script generates mock data for local development.
   This way you don't have to point to an actual API,
   but you can enjoy realistic, but randomized data,
   and rapid page loads due to local, static data.
 */

/* eslint-disable no-console */

import jsf from 'json-schema-faker';
import { schema } from './mockDataSchema';
import fs from 'fs';
import { chalkError, chalkSuccess } from './chalkConfig';

const json = JSON.stringify(jsf(schema));

fs.writeFile("./src/api/db.json", json, function (err) {
  if (err) {
    return console.error(chalkError(err));
  } else {
    console.log(chalkSuccess("Mock data generated."));
  }
});
