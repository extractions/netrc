import * as core from "@actions/core";
import * as os from "os";
import { constants, promises as fs } from "fs";
import * as path from "path";

async function checkPermissions(p: string): Promise<void> {
  if (process.platform != "linux" && process.platform != "darwin") {
    return;
  }
  try {
    const stat = await fs.stat(p);
    if (stat.uid != process.getuid()) {
      throw new Error("~/.netrc file owner does not match current user");
    }
    if (stat.mode & (constants.S_IRWXG | constants.S_IRWXO)) {
      throw new Error(
        "~/.netrc access too permissive: " +
          "access permissions must restrict access to only the owner"
      );
    }
  } catch (err) {
    if (err.code != "ENOENT") {
      throw err;
    }
  }
}

async function main() {
  try {
    const machine = encodeURI(core.getInput("machine")) || "''";
    const username = encodeURI(core.getInput("username")) || "''";
    const password = encodeURI(core.getInput("password")) || "''";
    const line = `machine ${machine} login ${username} password ${password}\n`;
    const netrc = path.resolve(os.homedir(), ".netrc");
    await checkPermissions(netrc);
    await fs.writeFile(netrc, line, { flag: "a", mode: 0o600 });
  } catch (err) {
    core.setFailed(err.message);
  }
}

main();
