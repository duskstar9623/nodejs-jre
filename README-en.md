<p align="left">
    <b>Language: &nbsp <a href="README.md">中文</a> &nbsp ｜ &nbsp English</b>
</p>

# nodejs-jre

<p>
  <a href="https://www.npmjs.com/package/nodejs-jre"><img alt="npm" src="https://img.shields.io/npm/v/nodejs-jre?logo=npm"></a>
  <a href="https://github.com/duskstar9623/nodejs-jre/blob/main/LICENSE"><img alt="GitHub" src="https://img.shields.io/github/license/duskstar9623/nodejs-jre?color=%23E2492F"></a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"><img alt="Static Badge" src="https://img.shields.io/badge/language-javascript-%23F1E05A"></a>
  <a href="https://github.com/duskstar9623/nodejs-jre"><img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/duskstar9623/nodejs-jre?logo=github&label=repo-size"></a>
  <a href="https://github.com/duskstar9623"><img alt="Static Badge" src="https://img.shields.io/badge/author-Duskstar-%23008c8c?logo=github"></a>
  
</p>

> Warning: This library is highly dependent on the stability of the download source, so it may work abnormally at any time.

> If there is any abnormal work, please create an new issue [here](https://github.com/duskstar9623/nodejs-jre/issues).

*Nodejs-jre* will download the Java Runtime Environment (JRE) or Java Development Kit (JDK) from the open source mirror website. And embed it into your node.js application and provide usage way.

At current version of this lib, the mirror website that provides download resources is [https://mirrors.tuna.tsinghua.edu.cn](https://mirrors.tuna.tsinghua.edu.cn).  
Current supported JRE and JDK versions：*`8`*, *`11`*, *`17`*.


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

// Install jdk11 and output after installation: jdk11 successfully installed
install('jdk', 11, () => {
    console.log('jdk11 successfully installed');
});
```

It should be noted that except for `install`, all other APIs of *nodejs jre* require corresponding resources to be used. For example, to use `jre.java`, ensure that JRE is installed, and to use `jdk.javac`, ensure that JDK is installed.

Next, we will learn the basic usage of *nodejs jre* through Java's "Hello World" program. Firstly, we prepare a raw Java file called `test/Hello.java` in the `test` folder under the root directory.

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

The APIs of *nodejs-jre* are basically based on wrapper of [child_process.spawn] and [child_process.spawnSync]. Except for `install`, all APIs have two types, synchronous execution and asynchronous execution, which share the same functionality and parameters. The synchronization API will not be elaborated too much, and specific usage can refer to [child_process.spawnSync].

- [install](#installdriver-version-callback)
- jre
  - [java](#jrejavasource-args-execargs-options)
  - javaSync
- jdk
  - [javac](#jdkjavacsourcefile-args-options)
  - javacSync
  - [jar](#jdkjarmode-jarpath-args-options)
  - jarSync

### install(driver, version[, callback])
Download the specified version of JRE or JDK asynchronously and integrate it into the project, and execute a callback function upon completion. When `npm i` *nodejs-jre*, it will automatically call `install ('jre', 8)` to download and install `jre8`.

**_Params_**: 
- `driver` {String} — Type of resource
  - *<ins>Required</ins>*, only support `'jre'` and `'jdk'`
- `version` {String | Number} — Version of resource
  - *<ins>Required</ins>*, currently only support *`8`*, *`11`*, *`17`*
- `callback` {Function} — Function called upon completion
  - *<ins>Optional</ins>*, default: `() => {}`


### jre.java(source[, args][, execArgs][, options])

Create a subprocess, load the specified class or file, and launch the Java program. Its essence is to call the `java` command at the terminal, and specific usage can refer to [official document][java].

**_Params_**: 
- `source` {String} — The class name or `jar` file to start, it needs to be used with different `args`
  - *<ins>Required</ins>*, e.g. `'Hello'`, `'xxx.jar'`
- `args` {String[]} — Command line options used by `java`
  - *<ins>Optional</ins>*, default: `[]`
  - e.g. `['-cp', 'test']`, `['-jar', 'xxx.jar']`, ...
  - View all available options list [here](https://docs.oracle.com/en/java/javase/11/tools/java.html#GUID-3B1CE181-CD30-4178-9602-230B800D4FAE__CBBIJCHG)
- `execArgs` {String[]} — Parameters passed to the main class
  - *<ins>Optional</ins>*, default: `[]`
  - e.g. `['world']`, ...
- `options` {Object} — Options pass to `child_process.spawn` used in the `options` section
  - *<ins>Optional</ins>*, default: `{ encoding: 'utf-8' }`
  - View all available options list [here][child_process.spawn]

This function returns a [ChildProcess instance](https://nodejs.org/docs/latest-v16.x/api/child_process.html#class-childprocess), to handle the execution results and error information of the process. For details, please refer to [child_process.spawn] and [Event:'spawn'](https://nodejs.org/docs/latest-v16.x/api/child_process.html#event-spawn).

```javascript
const { jre } = require('nodejs-jre');

/*** Some Examples ***/

// Merge the environment variables of the parent and child processes, and run the Hello.class file
jre.java('Hello', [], [], { env: ...process.env });  
// Equivalent to executing at the terminal => `java Hello`

// Run Test.jar file
jre.java('Test.jar', ['-jar']);
// Equivalent to executing at the terminal => `java -jar Test.jar`

// Run the class org.xxx.yyy.ZZZ in the a.jar file in Windows, and pass two Params, '12' and '34', to it at the same time
jre.java('org.xxx.yyy.ZZZ', ['-cp', ';.jar/a.jar'], ['12', '34']);  
// Equivalent to executing at the terminal => `java -cp ;.jar/a.jar org.xxx.yyy.ZZZ '12' '34'`
```


### jdk.javac(sourceFile[, args][, options])
Create a subprocess, to read Java class and interface definitions and compile them into bytecode and class files. Its essence is to call the `javac` command at the terminal, and specific usage can refer to [official document][javac].

**_Params_**: 
- `sourceFile` {String | String[]} — One or more source files to be compiled, passed in as an array, when there are multiple files
  - *<ins>Required</ins>*, e.g. `'Hello.java'`, `['Hello.java', 'World.java']`
- `args` {String[]} — Command line options used by `javac`
  - *<ins>Optional</ins>*, default: `[]`
  - e.g. `['-d', 'test']`
  - View all available options list [here](https://docs.oracle.com/en/java/javase/11/tools/javac.html#GUID-AEEC9F07-CB49-4E96-8BC7-BCC2C7F725C9__BHCGAJDC)
- `options` {Object} — Options pass to `child_process.spawn` used in the `options` section
  - *<ins>Optional</ins>*, default: `{ encoding: 'utf-8' }`
  - View all available options list [here][child_process.spawn]

This function returns a [ChildProcess instance](https://nodejs.org/docs/latest-v16.x/api/child_process.html#class-childprocess), to handle the execution results and error information of the process. For details, please refer to [child_process.spawn] and [Event:'spawn'](https://nodejs.org/docs/latest-v16.x/api/child_process.html#event-spawn).

```javascript
const { jdk } = require('nodejs-jre');

/*** Some Examples ***/

// Merge the environment variables of the parent and child processes, and compile the Hello.java file in the test folder
jdk.javac('test/Hello.java', [], { env: ...process.env });  
// Equivalent to executing at the terminal => `javac test/Hello.java`

// Compile the Hello.java file in the test folder and the World.java file in the current directory, and generate the compiled file in the class folder
jdk.javac(['test/Hello.java', 'World.java'], ['-d', 'class']);
// Equivalent to executing at the terminal => `javac -d class test/Hello.java World.java`
```


### jdk.jar(mode, jarPath[, args][, options])
Create a subprocess, to create an archive for classes and resources, and to manipulate or restore individual classes or resources from an archive. Its essence is to call the `jar` command at the terminal, and specific usage can refer to [official document][jar].

**_Params_**: 
- `mode` {String} — Main operation modes of `jar` command
  - *<ins>Required</ins>*, e.g. `'tf'`, `-cf`, ...
- `jarPath` {String} — Path to the `jar` file to operate on
  - *<ins>Required</ins>*, e.g. `'jars/xxx.jar'`
- `args` {String | String[]} — Command line parameters used by `jar`
  - *<ins>Optional</ins>*, default: `[]`
  - e.g. `'class/xxx.class'`, `['--manifest', 'mymanifest', '-C', 'foo/']`, ...
  - View all available parameters list [here][jar]
- `options` {Object} — Options pass to `child_process.spawn` used in the `options` section
  - *<ins>Optional</ins>*, default: `{ encoding: 'utf-8' }`
  - View all available options list [here][child_process.spawn]

This function returns a [ChildProcess instance](https://nodejs.org/docs/latest-v16.x/api/child_process.html#class-childprocess), to handle the execution results and error information of the process. For details, please refer to [child_process.spawn] and [Event:'spawn'](https://nodejs.org/docs/latest-v16.x/api/child_process.html#event-spawn).

```javascript
const { jdk } = require('nodejs-jre');

/*** Some Examples ***/

// List the file directory of test.jar in the current directory
jdk.jar('-tf', './test.jar');
// Equivalent to executing at the terminal => `jar -tf ./test.jar`

// Pack the class files a and b under the class folder into jar packages and place them in the jar directory and name them test.jar
jdk.jar('cf', 'jars/test.jar', ['class/a.class', 'class/b.class']);
// Equivalent to executing at the terminal => `jar cf jars/test.jar class/a.class class/b.class`
```


[child_process.spawn]: https://nodejs.org/docs/latest-v16.x/api/child_process.html#child_processspawncommand-args-options
[child_process.spawnSync]: https://nodejs.org/docs/latest-v16.x/api/child_process.html#child_processspawnsynccommand-args-options
[java]: https://docs.oracle.com/en/java/javase/11/tools/java.html#GUID-3B1CE181-CD30-4178-9602-230B800D4FAE
[javac]: https://docs.oracle.com/en/java/javase/11/tools/javac.html#GUID-AEEC9F07-CB49-4E96-8BC7-BCC2C7F725C9
[jar]: https://docs.oracle.com/en/java/javase/11/tools/jar.html#GUID-51C11B76-D9F6-4BC2-A805-3C847E857867


## Chat

The author [Duskstar](https://github.com/duskstar9623), a leisurely and happy-go-lucky front-end engineer. Occasionally build some open source projects and occasionally write [blogs](https://juejin.cn/user/3963103129121591).

If you have any doubts about this project, or desire to have technical exchange, let's make friends🍻:
  - WeChat --- Duskstar01
  - Email --- duskstar@foxmail.com

Because of fate, we met here by chance. Feel free to leave a Star ⭐ to this repo, greatly appreciate.


## License

[MIT Copyright (c) 2023 Duskstar](LICENSE)
