// 即時関数から開始

// 受け取った値を出力するだけ
// 引数の=trueはタイが引き渡られなかった場合にundefinedを防止するためのデフォルト値
const printline = (text : string,breakLine : boolean = true) => {
    process.stdout.write(text + (breakLine ? '\n' : ''))
}

// 入力関数
// asyncとawaitでpromiseからの返り値を扱う
// process.stdin.onceで値を一度のみ受け取る
const promptInput = async(text : string) => {
    printline(`\n${text}\n>`,false)
    const input : string = await new Promise((resolve) => process.stdin.once('data',(data) => resolve(data.toString())))
    return input.trim()
}

// 上だと可読性的に嬉しいらしい
class HitAndBlow {
    // 型アノテーション(string[]など)も本来なら不要。ただし、answerについては初期値が空なので必要。
    answerSource: string[] = ['0','1','2','3','4','5','6','7','8','9']
    answer: string[] = []
    tryCount: number = 0

    // 問題の正解となる数字列を作成する。
    setting(){
        // 1.answerSourceからランダムに値を１つ取り出す。
        // 2.その値がまだ使用されていないものであればanswer配列に追加する。
        // 3.answer配列が所定の数埋まるまで1~2を繰り返す。
        const answerLength = 3

        while(this.answer.length < answerLength){
            const randNum = Math.floor(Math.random() * this.answerSource.length)
            const selectedItem = this.answerSource[randNum]
            if(!this.answer.includes(selectedItem)){
                this.answer.push(selectedItem)
            }
        }
    }

    // H&Bの本体部分
    async play(){
        const inputArr = (await promptInput('「,」区切りで３つの数字を入力してください')).split(',')
        // 入力された回答をチェックする。
        const result = this.check(inputArr)

        if(result.hit !== this.answer.length){
            // 不正解の場合→チェック結果を表示して続行
            printline(`---\nHit: ${result.hit}\nBlow: ${result.blow}\n---`)
            this.tryCount += 1
            // awaitが無くても動く。何用？
            await this.play()
        }else{
            // 正解の場合→終了
            this.tryCount += 1
        }
    }

    check(input : string[]){
        let hitCount = 0
        let blowCount = 0

        input.forEach((val,index) =>{
            if(val === this.answer[index]){
                // ヒットの場合
                hitCount += 1
            }else if(this.answer.includes(val)){
                // ブローの場合
                blowCount += 1
            }
        })

        return{
            hit : hitCount,
            blow : blowCount,
        }
    }
}

// 即時関数
// ;は無くても34行目でも動く。要らない。
;(async () => {
    // const name = await promptInput('名前を入力してください')
    // console.log(name)
    // const age = await promptInput('年齢を入力してください')
    // console.log(age)
    // process.exit()
    // インスタンス
    const hitandBlow = new HitAndBlow()
    hitandBlow.setting()
    await hitandBlow.play()
})()