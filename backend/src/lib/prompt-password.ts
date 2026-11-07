import { createInterface } from "node:readline";

/** Saisie masquée (pas d’écho) pour les scripts CLI. */
export async function promptPassword(label: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    const stdin = process.stdin;
    const wasRaw = stdin.isRaw;
    if (stdin.isTTY) {
      stdin.setRawMode(true);
    }
    process.stdout.write(label);
    let value = "";
    const onData = (chunk: Buffer) => {
      const char = chunk.toString("utf8");
      for (const c of char) {
        if (c === "\n" || c === "\r" || c === "\u0004") {
          stdin.off("data", onData);
          if (stdin.isTTY) stdin.setRawMode(wasRaw ?? false);
          process.stdout.write("\n");
          rl.close();
          resolve(value);
          return;
        }
        if (c === "\u0003") {
          stdin.off("data", onData);
          if (stdin.isTTY) stdin.setRawMode(wasRaw ?? false);
          rl.close();
          reject(new Error("Annulé."));
          return;
        }
        if (c === "\u007f" || c === "\b") {
          value = value.slice(0, -1);
          continue;
        }
        value += c;
      }
    };
    stdin.on("data", onData);
    rl.on("close", () => {
      stdin.off("data", onData);
    });
  });
}
