<p align="left">
    <b>Language: &nbsp <a href="README.md">中文</a> &nbsp ｜ &nbsp English</b>
</p>

# nodejs-jre

<p>
  <a href="https://www.npmjs.com/package/nodejs-jre"><img alt="npm" src="https://img.shields.io/npm/v/nodejs-jre?logo=npm"></a>
  <a href="https://github.com/duskstar9623/nodejs-jre/blob/main/LICENSE"><img alt="GitHub" src="https://img.shields.io/github/license/duskstar9623/nodejs-jre?color=%23E2492F"></a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"><img alt="Static Badge" src="https://img.shields.io/badge/language-javascript-%23F1E05A"></a>
  <a href="https://github.com/duskstar9623"><img alt="Static Badge" src="https://img.shields.io/badge/author-Duskstar-%23008c8c?logo=github"></a>
</p>

*Nodejs-jre* will download the Java Runtime Environment (JRE) or Java Development Kit (JDK) from the open source mirror website. And embed it into your node.js application and provide usage way.

Current supported JRE and JDK versions：*`8`*, *`11`*, *`17`*, *`18`*, *`19`*, *`20`*, *`21`*.  
Current supported operating systems: *windows*, *macos*, *linux*, *alpine-linux*.


## Installation

```bash
npm install --save nodejs-jre
```


## Basic Usage

Installing *nodejs-jre* will automatically download `jre8`. If this is not the resource type or version you want, you can call the `install` API to download the corresponding resource. (Downloads of the same resource type will be overwritten, and different types can coexist. For example, you cannot have both `jre8` and `jre11`, but you can have both `jre8` and `jdk11`)

```javascript
const { install } = require('nodejs-jre');

// Install jre17
install('jre', 17);

// Install jdk11 and output after installation: jdk11 is successfully installed
install('jdk', 11).then(() => {
    console.log('jdk11 is successfully installed');
});
```

It should be noted that except for `install`, all other APIs of *nodejs-jre* require corresponding resources to be used. For example, to use `jre.java`, ensure that JRE is installed, and to use `jdk.javac`, ensure that JDK is installed.

Next, we will learn the basic usage of *nodejs-jre* through Java's "Hello World" program. Firstly, we prepare a raw Java file called `test/Hello.java` in the `test` folder under the root directory.

```java
public class Hello {
    public static void main(String[] args) {
        System.out.print("Hello " + args[0] + "!");
    }
}
```

Compile `test/Hello.java` into a `class` file and run it by running the following code.

```javascript
const { jre, jdk } = require('nodejs-jre');

// Compile synchronously
jdk.javacSync('test/Hello.java');

// Run asynchronously and output results
let outcome = '';
const child = jre.java('Hello', ['-cp', 'test'], ['world']);

child.stdout.on('data', data => {
    outcome = data;
});
child.stderr.on('data', data => {
    console.log('Error: ' + data);
})
child.on('close', code => {
    console.log(outcome);   // Hello world!
})
```


## API

The APIs of *nodejs-jre* are basically based on wrapper of [child_process.spawn] and [child_process.spawnSync]. Except for `install`, all APIs have synchronous and asynchronous two types, which share the same parameters. The synchronization API will not be elaborated too much, and specific usage can refer to [child_process.spawnSync].

- [install](#installdriver-version-os)
- jre
  - [java](#jrejavasourcename-args-execargs-options)
  - javaSync
- jdk
  - [javac](#jdkjavacsourcefile-args-options)
  - javacSync

### install(driver, version[, os])
Download the specified version of JRE or JDK asynchronously and integrate it into the project, and this method will return a `Promise` which becomes `fulfilled` when the integration is complete. When `npm i` *nodejs-jre*, it will automatically call `install ('jre', 8)` to download and install `jre8`.  

If the `os` field is not specified, the JRE or JDK of the current operating system will be downloaded by default.  
❗ To download Alpine Linux resources, it is necessary to explicitly set the `os` field, otherwise Linux resources will be downloaded by default.

**_Params_**: 
- `driver` {String} — Type of resource
  - *<ins>Required</ins>*, only support `'jre'` and `'jdk'`
- `version` {Number} — Version of resource
  - *<ins>Required</ins>*, currently only support *`8`*, *`11`*, *`17`*, *`18`*, *`19`*, *`20`*, *`21`*
- `os` {String} — Operating system of resource
  - *<ins>Optional</ins>*, only support `'windows'`, `'mac'`, `'linux'` or `'alpine-linux'`


### jre.java(sourceName[, args][, execArgs][, options])

Load the specified class or file, and launch the Java program. Specific usage can refer to [official document][java].

**_Params_**: 
- `sourceName` {String} — The class name or `jar` file to start, it needs to be used with different `args`
  - *<ins>Required</ins>*, e.g. `'Hello'`, `'xxx.jar'`
- `args` {String[]} — Command line options used by `java`
  - *<ins>Optional</ins>*, default: `[]`
  - View all available options list [here](https://docs.oracle.com/en/java/javase/11/tools/java.html#GUID-3B1CE181-CD30-4178-9602-230B800D4FAE__CBBIJCHG)
- `execArgs` {String[]} — Parameters passed to the main class
  - *<ins>Optional</ins>*, default: `[]`
- `options` {Object} — Options pass to `child_process.spawn` used in the `options` section
  - *<ins>Optional</ins>*, default: `{ detached: 'false' }`
  - View all available options list [here][child_process.spawn]

This function returns a [ChildProcess instance](https://nodejs.org/docs/latest-v16.x/api/child_process.html#class-childprocess), to handle the execution results and error information of the process. For details, please refer to [child_process.spawn].

```javascript
const { jre } = require('nodejs-jre');

/*** Some Examples ***/

// Merge the environment variables of the parent and child processes, and run the Hello.class file
jre.java('Hello', ['-Dfile.encoding=UTF-8'], [], { env: ...process.env });  

// Run Test.jar file
jre.java('Test.jar', ['-Dfile.encoding=UTF-8', '-jar']);

// Run the class org.xxx.yyy.ZZZ in the a.jar file in Windows 
// And pass two Params, '12' and '34', to it at the same time
jre.java('org.xxx.yyy.ZZZ', ['-Dfile.encoding=UTF-8', '-cp', ';.jar/a.jar'], ['12', '34']);  
```


### jdk.javac(sourceFile[, args][, options])
Read Java class and interface definitions and compile them into bytecode and class files. Specific usage can refer to [official document][javac].

**_Params_**: 
- `sourceFile` {String | String[]} — One or more source files to be compiled, passed in as an array, when there are multiple files
  - *<ins>Required</ins>*, e.g. `'Hello.java'`, `['Hello.java', 'World.java']`
- `args` {String[]} — Command line options used by `javac`
  - *<ins>Optional</ins>*, default: `[]`
  - e.g. `['-d', 'test']`
  - View all available options list [here](https://docs.oracle.com/en/java/javase/11/tools/javac.html#GUID-AEEC9F07-CB49-4E96-8BC7-BCC2C7F725C9__BHCGAJDC)
- `options` {Object} — Options pass to `child_process.spawn` used in the `options` section
  - *<ins>Optional</ins>*, default: `{ encoding: 'utf8' }`
  - View all available options list [here][child_process.spawn]

This function returns a [ChildProcess instance](https://nodejs.org/docs/latest-v16.x/api/child_process.html#class-childprocess), to handle the execution results and error information of the process. For details, please refer to [child_process.spawn].

```javascript
const { jdk } = require('nodejs-jre');

/*** Some Examples ***/

// Merge the environment variables of the parent and child processes, and compile the Hello.java file in the test folder
jdk.javac('test/Hello.java', [], { env: ...process.env });  

// Compile the Hello.java file in the test folder and the World.java file in the current directory
// And generate the compiled file in the class folder
jdk.javac(['test/Hello.java', 'World.java'], ['-d', 'class']);
```


[child_process.spawn]: https://nodejs.org/docs/latest-v16.x/api/child_process.html#child_processspawncommand-args-options
[child_process.spawnSync]: https://nodejs.org/docs/latest-v16.x/api/child_process.html#child_processspawnsynccommand-args-options
[java]: https://docs.oracle.com/en/java/javase/11/tools/java.html#GUID-3B1CE181-CD30-4178-9602-230B800D4FAE
[javac]: https://docs.oracle.com/en/java/javase/11/tools/javac.html#GUID-AEEC9F07-CB49-4E96-8BC7-BCC2C7F725C9
[jar]: https://docs.oracle.com/en/java/javase/11/tools/jar.html#GUID-51C11B76-D9F6-4BC2-A805-3C847E857867


## Extension

If the command you need is not in the existing APIs, you can access the `bin` directory of the installed `JRE` or `JDK` through `jre.bin` and `jdk.bin` for expansion.


## Chat

The author [Duskstar](https://github.com/duskstar9623), a leisurely and happy-go-lucky front-end engineer. Occasionally build some open source projects and occasionally write [blogs](https://juejin.cn/user/3963103129121591).

If you have any doubts about this project, or desire to have technical exchange, let's make friends🍻:
  - WeChat --- Duskstar01
  - Email --- duskstar@foxmail.com

Because of fate, we met here by chance. Feel free to leave a Star ⭐ to this repo, greatly appreciate.


## License

[MIT Copyright (c) 2024 Duskstar](LICENSE)
