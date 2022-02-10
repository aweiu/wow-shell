import { spawn, SpawnOptionsWithoutStdio } from "child_process";

function shell<T extends string | void>(
  command: string,
  options: Omit<SpawnOptionsWithoutStdio, "shell" | "stdio"> & {
    resolveKeyWords?: T;
  } = {}
  // Prevent string type from being converted to string literal
): Promise<T extends string ? string : void> {
  return new Promise((resolve, reject) => {
    let resolved = false;
    let errData: any;

    const { resolveKeyWords, ...rawOptions } = options;
    const env: any = rawOptions.env || process.env;

    const p = spawn(command, {
      ...rawOptions,
      env: {
        ...env,
        FORCE_COLOR: true,
      },
      stdio: "pipe",
      shell: true,
    });

    p.stdout.addListener("data", (data) => {
      process.stdout.write(data);

      if (!resolved && resolveKeyWords) {
        const msg = data.toString();

        if (msg.includes(resolveKeyWords)) {
          resolved = true;
          resolve(msg);
        }
      }
    });

    p.stderr.addListener("data", (data) => {
      errData = data;
      process.stderr.write(data);
    });

    p.addListener("error", (err) => {
      errData = err;
    });

    p.addListener("close", (code) => {
      if (resolved) return;

      if (errData || code !== 0) {
        const e =
          errData instanceof Error
            ? errData
            : Error(errData || "unknown shell error, note the console output");
        return reject(e);
      }

      if (code === 0) {
        if (resolveKeyWords !== undefined) {
          reject(Error(`process closed but not match resolveKeyWords`));
        } else {
          resolve(undefined as any);
        }
      }
    });
  });
}

export default shell;
