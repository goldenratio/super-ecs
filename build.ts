#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { createGzip } from 'node:zlib';

import { build } from "esbuild";

interface BuildOptions {
  readonly minify?: boolean;
}

function bytes_to_kilobytes(bytes: number): number {
  const value = bytes / 1024;
  return Math.round(value * 100) / 100;
}

async function get_gzip_size(file_path: string): Promise<number> {
  return new Promise((resolve, reject) => {
    let size = 0;
    const gzip = createGzip();

    fs.createReadStream(file_path)
      .pipe(gzip)
      .on("data", chunk => {
        size += chunk.length;
      })
      .on("end", () => resolve(size))
      .on("error", reject);
  });
}

async function main(): Promise<void> {
  await perform_build();
  await perform_build({ minify: true });
}

async function perform_build(options?: BuildOptions): Promise<void> {
  const { minify = false } = options || {};
  const start_time = Date.now();
  const lib_name = "super-ecs";
  const target_file_name = minify ? `${lib_name}.min.js` : `${lib_name}.js`;

  const src_path = path.join("src", "index.ts");
  const dest_path = path.join("dist", target_file_name);

  console.log(`Building... ${src_path} -> ${dest_path}`);
  await build({
    entryPoints: [src_path],
    outfile: dest_path,
    format: "esm",
    target: "esnext",
    treeShaking: true,
    bundle: true,
    minify: minify,
    sourcemap: true,
    drop: ["console", "debugger"],
    external: ["rxjs"],
    define: {
      "process.env.PROD": "true",
    }
  });

  console.log(`Build finished in ${Date.now() - start_time}ms`);
  const gzip_size = await get_gzip_size(dest_path);
  console.log(`${bytes_to_kilobytes(gzip_size)} kb (gzip)`);
}

main();
