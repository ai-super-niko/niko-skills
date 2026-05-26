#!/usr/bin/env bun

interface Options {
  name: string;
  json: boolean;
}

function parseArgs(): Options {
  const args = process.argv.slice(2);
  const get = (flag: string): string | undefined => {
    const i = args.indexOf(flag);
    return i >= 0 && i + 1 < args.length ? args[i + 1] : undefined;
  };
  return {
    name: get("--name") ?? "World",
    json: args.includes("--json"),
  };
}

function main() {
  const opts = parseArgs();
  const greeting = `Hello, ${opts.name}!`;

  if (opts.json) {
    console.log(JSON.stringify({ status: "ok", greeting }));
  } else {
    console.log(greeting);
  }
}

main();
