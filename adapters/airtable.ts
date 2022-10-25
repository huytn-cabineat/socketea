/**
 * https://deno.land/x/airtable@v1.1.1
 */

import { Airtable } from "https://deno.land/x/airtable/mod.ts";

const airtable = new Airtable({
  apiKey: "keyHAwBS13CrEf8ls",
  baseId: "appUJnLyNerZFFOzt",
  tableName: "vote",
});
