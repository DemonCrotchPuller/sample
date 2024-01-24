const sayHello = (name : string) => {
    // return 'Hello, ${name}!'
    return `Hello, ${name}!`
}

// Node.jsのconsole.logは内部的にprocess.stdout.writeが実行されている。
// processモジュールを使用するためにnpm install -D @types/node@16.4.13で定義型ファイルをインストール
// console.log(sayHello('デーモン閣下'))
process.stdout.write(sayHello('デーモン小暮'))