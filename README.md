<p align="left">
    <b>Language: &nbsp 中文 &nbsp ｜ &nbsp <a href="README-en.md">English</a></b>
</p>

# nodejs-jre

<p>
  <a href="https://www.npmjs.com/package/nodejs-jre"><img alt="npm" src="https://img.shields.io/npm/v/nodejs-jre?logo=npm"></a>
  <a href="https://github.com/duskstar9623/nodejs-jre/blob/main/LICENSE"><img alt="GitHub" src="https://img.shields.io/github/license/duskstar9623/nodejs-jre?color=%23E2492F"></a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"><img alt="Static Badge" src="https://img.shields.io/badge/language-javascript-%23F1E05A"></a>
  <a href="https://github.com/duskstar9623/nodejs-jre"><img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/duskstar9623/nodejs-jre?logo=github&label=repo-size"></a>
  <a href="https://github.com/duskstar9623"><img alt="Static Badge" src="https://img.shields.io/badge/author-Duskstar-%23008c8c?logo=github"></a>
  
</p>

> 警告：该库高度依赖下载源的稳定性，因此随时可能工作异常。

> 如果出现工作异常，请在[这里](https://github.com/duskstar9623/nodejs-jre/issues)创建 issue。

*Nodejs-jre* 可以从开源镜像网站下载 Java 运行时环境（JRE）或 Java 开发工具包（JDK）嵌入你的 node.js 应用并提供使用方法。

在当前版本中，提供下载资源的镜像站是 [https://mirrors.tuna.tsinghua.edu.cn](https://mirrors.tuna.tsinghua.edu.cn)。  
当前支持的 JRE、JDK 版本：*`8`*、*`11`*、*`17`*。


## 安装

```bash
npm install --save nodejs-jre
```


## 使用

安装 *nodejs-jre*，会自动下载 `jre8`。若这不是你想要的资源类型或版本，可调用 `install` API 下载对应资源。（同种资源类型的下载会进行覆盖，不同种的可以共存，例如：你不能同时拥有 `jre8` 和 `jre11`，但你可以同时拥有 `jre8` 和 `jdk11`）

```javascript
const { install } = require('nodejs-jre');

// 安装 jre17
install('jre', 17);

// 安装 jdk11，并在安装完成后输出：jdk11 安装成功
install('jdk', 11, () => {
    console.log('jdk11 安装成功');
});
```

需要注意的是，除 `install` 外 *nodejs-jre* 的其他 API 都需要有对应资源才能使用。例如，要用 `jre.java` 就需确保安装 JRE，要用 `jdk.javac` 就需确保安装 JDK。  

接下来我们通过 Java 的 “Hello World” 程序了解 *nodejs-jre* 的基本用法。首先我们在根目录下的 `test` 文件夹中准备一个原始的 Java 文件，`test/Hello.java`。

```java
public class Hello {
    public static void main(String[] args) {
        System.out.print("Hello " + args[0] + "!");
    }
}
```

通过运行如下代码，将 `test/Hello.java` 编译成 `class` 文件并运行。

```javascript
const { jre, jdk } = require('nodejs-jre');

// 同步编译
jdk.javacSync('test/Hello.java');

// 异步运行并取得结果
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

*Nodejs-jre* 的 API 基本都是基于 [child_process.spawn] 和 [child_process.spawnSync] 的包装。除 `install` 外，所有 API 都有同步执行和异步执行两个版本，它们拥有同样的功能和参数。故同步 API 不再过多阐述，具体使用可参考 [child_process.spawnSync]。

- [install](#installdriver-version-callback)
- jre
  - [java](#jrejavasource-args-execargs-options)
  - javaSync
- jdk
  - [javac](#jdkjavacsourcefile-args-options)
  - javacSync

### install(driver, version[, callback])
异步地下载指定版本的 JRE 或 JDK 集成到项目中去，并在完成时执行回调函数。在 `npm i` *nodejs-jre* 时，会自动调用 `install('jre', 8)` 下载安装 `jre8`。

**_参数_**: 
- `driver` {String} — 资源类型
  - 必填，仅支持 `'jre'` 或 `'jdk'`
- `version` {String | Number} — 资源版本
  - 必填，目前仅支持 *`8`*、*`11`*、*`17`*
- `callback` {Function} — 回调函数
  - 选填，默认：`() => {}`


### jre.java(source[, args][, execArgs][, options])
开启子进程，加载指定的类或文件，运行 Java 程序。本质是在终端调用 `java` 命令，具体用法可参考[官方文档][java]。

**_参数_**: 
- `source` {String} — 要启动的类名或 `jar` 文件，需搭配不同的 `args` 使用
  - 必填，例如：`'Hello'`、`'xxx.jar'`
- `args` {String[]} — `java` 使用的命令行选项
  - 选填，默认：`[]`
  - 例如：`['-cp', 'test']`、`['-jar', 'xxx.jar']`、...
  - 查看所有可使用的[选项列表](https://docs.oracle.com/en/java/javase/11/tools/java.html#GUID-3B1CE181-CD30-4178-9602-230B800D4FAE__CBBIJCHG)
- `execArgs` {String[]} — 传递给主类的参数
  - 选填，默认：`[]`
  - 例如：`['world']`、...
- `options` {Object} — 传递给 `child_process.spawn` 的 `options` 部分使用的选项
  - 选填，默认：`{ encoding: 'utf-8' }`
  - 查看所有可使用的[选项列表][child_process.spawn]

该函数返回一个 [ChildProcess 实例](https://nodejs.org/docs/latest-v16.x/api/child_process.html#class-childprocess)，用以处理进程的执行结果和错误信息，具体可参考 [child_process.spawn] 和 [Event:'spawn'](https://nodejs.org/docs/latest-v16.x/api/child_process.html#event-spawn)。

```javascript
const { jre } = require('nodejs-jre');

/*** Some Examples ***/

// 合并父进程与子进程的环境变量，运行 Hello.class 文件
jre.java('Hello', [], [], { env: ...process.env });  
// 等同于在终端执行 => `java Hello`

// 运行 Test.jar 文件
jre.java('Test.jar', ['-jar']);
// 等同于在终端执行 => `java -jar Test.jar`

// windows 中运行 a.jar 文件中的 org.xxx.yyy.ZZZ 这个类，同时传递 '12'、'34' 两个参数给它
jre.java('org.xxx.yyy.ZZZ', ['-cp', ';.jar/a.jar'], ['12', '34']);  
// 等同于在终端执行 => `java -cp ;.jar/a.jar org.xxx.yyy.ZZZ '12' '34'`
```


### jdk.javac(sourceFile[, args][, options])
开启子进程，读取 Java 类和接口定义，并将它们编译为字节码和类文件。其本质是在终端调用 `javac` 命令，具体用法可参考[官方文档][javac]。

**_参数_**: 
- `sourceFile` {String | String[]} — 一个或多个要编译的源文件，有多个时以数组形式传入
  - 必填，例如：`'Hello.java'`、`['Hello.java', 'World.java']`
- `args` {String[]} — `javac` 使用的命令行选项
  - 选填，默认：`[]`
  - 例如：`['-d', 'test']`
  - 查看所有可使用的[选项列表](https://docs.oracle.com/en/java/javase/11/tools/javac.html#GUID-AEEC9F07-CB49-4E96-8BC7-BCC2C7F725C9__BHCGAJDC)
- `options` {Object} — 传递给 `child_process.spawn` 的 `options` 部分使用的选项
  - 选填，默认：`{ encoding: 'utf-8' }`
  - 查看所有可使用的[选项列表][child_process.spawn]

该函数返回一个 [ChildProcess 实例](https://nodejs.org/docs/latest-v16.x/api/child_process.html#class-childprocess)，用以处理进程的执行结果和错误信息，具体可参考 [child_process.spawn] 和 [Event:'spawn'](https://nodejs.org/docs/latest-v16.x/api/child_process.html#event-spawn)。

```javascript
const { jdk } = require('nodejs-jre');

/*** Some Examples ***/

// 合并父进程与子进程的环境变量，编译 test 文件夹下的 Hello.java 文件
jdk.javac('test/Hello.java', [], { env: ...process.env });  
// 等同于在终端执行 => `javac test/Hello.java`

// 编译 test 文件夹下的 Hello.java 和当前目录下的 World.java 文件，并在 class 文件夹下生成编译好的文件
jdk.javac(['test/Hello.java', 'World.java'], ['-d', 'class']);
// 等同于在终端执行 => `javac -d class test/Hello.java World.java`
```


[child_process.spawn]: https://nodejs.org/docs/latest-v16.x/api/child_process.html#child_processspawncommand-args-options
[child_process.spawnSync]: https://nodejs.org/docs/latest-v16.x/api/child_process.html#child_processspawnsynccommand-args-options
[java]: https://docs.oracle.com/en/java/javase/11/tools/java.html#GUID-3B1CE181-CD30-4178-9602-230B800D4FAE
[javac]: https://docs.oracle.com/en/java/javase/11/tools/javac.html#GUID-AEEC9F07-CB49-4E96-8BC7-BCC2C7F725C9


## 闲聊

作者 [Duskstar](https://github.com/duskstar9623)，一个闲云野鹤般的前端攻城狮。偶尔玩玩开源项目，也偶尔写写[博客](https://juejin.cn/user/3963103129121591)。

若对该项目有疑惑，或有心交流技术，不妨交个朋友🍻：
  - 微信 --- Duskstar01
  - 邮箱 --- duskstar@foxmail.com

人生难得，因缘际会，便随缘乐助留下 Star ⭐，不胜感激。


## License

[MIT Copyright (c) 2023 Duskstar](LICENSE)
