# nodejs-jre

![Static Badge](https://img.shields.io/badge/npm-v1.0.0-blue) ![Static Badge](https://img.shields.io/badge/License-MIT-red)


> Warning: this library highly relies on the stability of the download source for operation, so may work abnormally at any time.  

> If the work is abnormal, please create a new issue [here](https://github.com/duskstar9623/nodejs-jre/issues).

This module will download Java Runtime Environment (JRE) from the open source mirror website and embed it into your nodejs application.

In current version, the mirror station that provides resource download is [https://mirrors.tuna.tsinghua.edu.cn](https://mirrors.tuna.tsinghua.edu.cn).  
JRE version: 8


## Install

```bash
npm install --save nodejs-jre
```


## Usage

We will use a simple smoke test to understand the basic usage of _nodejs-jre_, just like the library did after installing jre.

Firstly, we need to create `test/Smoketest.java` which looks like this:

```java
public class Smoketest {
    public static void main(String[] args) {
        System.out.println("Trigger" + args[0] + "test!");
    }
}
```

Then, compile it with something like this:
```sh
javac test/Smoketest.java
```

By running the following file you should get `true` as output.

```javascript
var jre = require('nodejs-jre');

var output = jre.spawnSync(  // call synchronously
    ['test'],                // add the relative directory 'java' to the class-path
    'Smoketest',             // call main routine in class 'Smoketest'
    ['smoke'],               // pass 'smoke' as only parameter
    { encoding: 'utf8' }     // encode output as string
  ).stdout.trim();           // take output from stdout as trimmed String

console.log(output === "Trigger smoke test!");  // Should print 'true'
```


## API

### jre.install([callback])
Downloads and prepares a Java Runtime Engine (JRE). It is automatically called during _nodejs-jre_ installation.

**Params**: 
- `callback` - `Function`
  - Will be called when installation is finished.

```javascript
jre.install(() => {
  console.log('Installation is finished.');
});
```

### jre.spawn(classPath, className[, args][, options])
Spawns a new child process by running the main method of a given Java class. This is a wrapper around [child_process.spawn].

**Params**: 
- `classPath` - `Array`
  - Paths to `.jar` files or directories containing `.class` files.
- `className` - `String`
  - The Java class to run.
- `args` - `Array`
  - The command line arguments that are to be passed to the Java class's main method.
  Same as in [child_process.spawn].
- `options` - `Object` 
  - Options that are passed to [child_process.spawn].
- Returns an object of the type [child_process.ChildProcess].
- Please look [here](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options) for further document.

```javascript
// Continue the smoke test above
const child = jre.spawn(['./test'], 'Smoketest', ['smoke'], {encoding: 'utf-8'});

child.stdout.on('data', res => {
  console.log(res);   // "Trigger smoke test!"
});
child.stderr.on('data', err => {
  console.error(`jre.spawn error: ${err}`);
});
child.on('close', code => {
  console.log(`child process exited with code ${code}`);
});
```

[child_process.spawn]: https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options
[child_process.ChildProcess]: https://nodejs.org/api/child_process.html#child_process_class_childprocess

### jre.spawnSync(classpath, classname[, args][, options])
 Synchronously spawns a new child process by running the main method of a given Java class.This is a wrapper around [child_process.spawnSync](https://nodejs.org/api/child_process.html#child_process_child_process_spawnsync_command_args_options). 

Its usage is similar to **jre.spawn**, could refer to the smoke test above.

Please look [here](https://nodejs.org/api/child_process.html#child_process_child_process_spawnsync_command_args_options) for further document.


## License

[MIT Copyright (c) 2023 Duskstar](LICENSE)
