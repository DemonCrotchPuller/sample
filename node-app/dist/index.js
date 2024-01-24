"use strict";
var sayHello = function (name) {
    // return 'Hello, ${name}!'
    return "Hello, " + name + "!";
};
// Node.jsのconsole.logは内部的にprocess.stdout.writeが実行されている。
// console.log(sayHello('デーモン閣下'))
process.stdout.write(sayHello('デーモン小暮'));
