# simple_cron for Deno

A cron library for deno and inspired by [node-cron](https://github.com/node-cron/node-cron).

## Usage

```javascript
import { cron } from "https://deno.land/x/simple_cron/mod.ts";

// Start a scheduled task
const task = cron('* 30 9 * * mon', () => {
  console.log('log at 09:30 on Monday.');
})

// Stop it
task.stop();
```
