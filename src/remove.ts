import * as core from "@actions/core";
import * as os from "os";
import { promises as fs } from "fs";
import * as path from "path";

async function main() {
  try {
    const netrc = path.resolve(os.homedir(), ".netrc");
    await fs.unlink(netrc);
  } catch (err) {
    if (err instanceof Error) {
      core.setFailed(err.message);
    }
  }
}

main();
