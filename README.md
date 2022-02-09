## wow-shell

Shell command, it will be resolved when something is hit, and support the output of colored logs.

It is very suitable for writing your monorepo development service!

### Install

```
npm install wow-shell
```

### Example1

```javascript
import shell from "wow-shell";

// when stdout data includes 「Listening on port」, the shell promise will be resolved
shell("node ./packages/server/src/index.js", {
  resolveKeyWords: "Listening on port",
}).then((matchedMsg) => {
  console.log("matchedMsg:", matchedMsg);

  // run vite after the server runs successfully
  shell("vite ./packages/webapp");
});
```

The output in console:

```
server Listening on port 3000
matchedMsg: server Listening on port 3000

vite v2.x.x dev server running at:

> Local: http://localhost:xxxx/
> Network: use `--host` to expose

ready in xms.
```

### Example2

```javascript
import shell from "wow-shell";

// If the resolvekeywords parameter is not passed in, the shell promise will be resolved when the child process closed
shell("ping google.com").then(() => console.log("ping completed!"));
```

The output in console:

```
PING google.com (x.x.x.x): x data bytes
x bytes from x.x.x.x: icmp_seq=0 ttl=x time=x ms
x bytes from x.x.x.x: icmp_seq=0 ttl=x time=x ms
x bytes from x.x.x.x: icmp_seq=0 ttl=x time=x ms

--- google.com ping statistics ---
3 packets transmitted, 3 packets received, 0.0% packet loss
round-trip min/avg/max/stddev = x/x/x/x ms
ping completed!
```

### API

shell(command: string, options: Omit<[SpawnOptionsWithoutStdio](http://nodejs.cn/api/child_process.html#child_processspawncommand-args-options), 'shell' | 'stdio'> & { resolveKeyWords?: string; })
