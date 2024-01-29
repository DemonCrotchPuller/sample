// 受け取った値を出力するだけ
// 引数の=trueはタイが引き渡られなかった場合にundefinedを防止するためのデフォルト値
const printline = (text : string,breakLine : boolean = true) => {
    process.stdout.write(text + (breakLine ? '\n' : ''))
}

// printlineと同じ内容
const printLine2 = (text : string,breakLine : boolean = true) => {
    // デフォルト値を設定するのと同義の処理
    if(breakLine === undefined){
        breakLine = true
    }
    process.stdout.write(text + (breakLine ? '/n' : ''))
}

// 入力関数
// asyncとawaitでpromiseからの返り値を扱う
// process.stdin.onceで値を一度のみ受け取る
const promptInput = async(text : string) => {
    printline(`\n${text}\n>`,false)
    const input : string = await new Promise((resolve) => process.stdin.once('data',(data) => resolve(data.toString())))
    return input.trim()
}

// 即時関数
// ;はなくても、34行目でも動く。いらない。
;(async () => {
    const name = await promptInput('名前を入力してください')
    console.log(name)
    const age = await promptInput('年齢を入力してください')
    console.log(age)
    process.exit()
})()