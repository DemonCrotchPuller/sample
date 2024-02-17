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
    // Promiseの前のnewは要らないらしい。Promiseは非同期処理用のインタフェースらしい。
    // const input : string = await new Promise((resolve) => process.stdin.once('data',(data) => resolve(data.toString())))
    //return input.trim()
    return readLine()
}

const readLine = async () => {
    const input:string = await new Promise((resolve) => process.stdin.once('data',(data) => resolve(data.toString())))
    return input.trim()
}

// モード選択 ジェネリクスで型指定
const promptSelect = async<T extends string>(text: string, values: readonly T[]): Promise<T> =>{
    printline(`\n${text}`)
    // モードの種類を出力し提示
    values.forEach((value) => {
        printline(`-${value}`)
    })
    printline(`> `,false)

    const input  = (await readLine()) as T
    if(values.includes(input)){
        // 正しくmodeが入力された場合
        return input
    }else{
        // normalかhard意外が入力された場合
        return promptSelect<T>(text, values)
    }
}

// as const で readonly の扱いになる。タプル型
const modes = ['normal','hard'] as const
// numberですべての配列を対象にしてtypeofで型を呼び出す
type Mode = typeof modes[number]


// 上だと可読性的に嬉しいらしい
class HitAndBlow {
    // 型アノテーション(string[]など)も本来なら不要。ただし、answerについては初期値が空なので必要。
    private readonly answerSource: string[] = ['0','1','2','3','4','5','6','7','8','9']
    private answer: string[] = []
    private tryCount: number = 0
    private mode: Mode = 'normal'

    // コンストラクター。constructorで宣言。インスタンス作成時に実行
    //constructor(mode: Mode){
    //    this.mode = mode
    //}

    // 問題の正解となる数字列を作成する。
    async setting(){
        // asで型アサーション
        //this.mode = await promptInput('normalかhardでモードを入力してください') as Mode
        this.mode = await promptSelect<Mode>('normalかhardでモードを入力してください', modes)
        // 1.answerSourceからランダムに値を１つ取り出す。
        // 2.その値がまだ使用されていないものであればanswer配列に追加する。
        // 3.answer配列が所定の数埋まるまで1~2を繰り返す。
        const answerLength = this.getanswerLength()

        while(this.answer.length < answerLength){
            const randNum = Math.floor(Math.random() * this.answerSource.length)
            const selectedItem = this.answerSource[randNum]
            if(!this.answer.includes(selectedItem)){
                this.answer.push(selectedItem)
            }
        }
    }

    // modeによる難易度（正解配列数）の設定
    private getanswerLength(){
        switch (this.mode){
            case 'normal':
                return 3
            case 'hard':
                return 4
            default:
                throw new Error(`${this.mode}は無効なモードです`);
        }            
    }

    // H&Bの本体部分
    async play(){
        const answeLength = this.getanswerLength()
        const inputArr = (await promptInput(`「,」区切りで${answeLength}つの数字を入力してください`)).split(',')

        // 入力チェック
        if(!this.validate(inputArr)){
            printline(`無効な入力です。`)
            await this.play()
            return
        }

        // 入力された回答の正誤判定をする。
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

    // 入力チェック
    private validate(inputArr : string[]){
        // 入力された長さを判定
        const isLengthValid = inputArr.length === this.answer.length
        // answerSourceに含まれている文字列か（everyはforループみたいなもん）
        const isAllAnsewerSourceOption = inputArr.every((val) => this.answerSource.includes(val))
        // それぞれの文字列に重複がないか
        const isAllDifferentValues = inputArr.every((val, i) => inputArr.indexOf(val) === i)
        return isLengthValid && isAllAnsewerSourceOption && isAllDifferentValues
    }

    // 回答入力後の正誤判定処理
    private check(input : string[]){
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

    // ゲームの終了
    end(){
        printline(`正解です！\n試行回数${this.tryCount}回`)
        process.exit()
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
    await hitandBlow.setting()
    await hitandBlow.play()
    hitandBlow.end()
})()