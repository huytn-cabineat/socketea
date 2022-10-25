/**
 * https://deno.land/x/redis@v0.27.2
 */

import { connect } from "https://deno.land/x/redis/mod.ts";

const redis = await connect({
  hostname: "206.189.147.237",
  port: 3770,
});
