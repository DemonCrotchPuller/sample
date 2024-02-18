// 即時関数から開始

// 受け取った値を出力するだけ
// 引数の=trueはタイが引き渡られなかった場合にundefinedを防止するためのデフォルト値
const printLine = (text : string,breakLine : boolean = true) => {
    process.stdout.write(text + (breakLine ? '\n' : ''))
}

// 入力関数
// asyncとawaitでpromiseからの返り値を扱う
// process.stdin.onceで値を一度のみ受け取る
const promptInput = async(text : string) => {
    printLine(`\n${text}\n>`,false)
    // Promiseの前のnewは要らないらしい。Promiseは非同期処理用のインタフェースらしい。
    // const input : string = await new Promise((resolve) => process.stdin.once('data',(data) => resolve(data.toString())))
    //return input.trim()
    return readLine()
}

const readLine = async () => {
    const input:string = await new Promise((resolve) => process.stdin.once('data',(data) => resolve(data.toString())))
    return input.trim()
}

// ゲームのモード選択だけでなく、NextActionを使用し継続中断の選択にも使用
// モード選択 ジェネリクスで型指定
const promptSelect = async<T extends string>(text: string, values: readonly T[]): Promise<T> =>{
    printLine(`\n${text}`)
    // モードの種類を出力し提示
    values.forEach((value) => {
        printLine(`-${value}`)
    })
    printLine(`> `,false)

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

const nextActions = ['play again','exit'] as const
type NextAction = typeof nextActions[number]

const gameTitles = ['hit and blow','janken'] as const
type GameTitle = typeof gameTitles[number]

type GameStore = {
    'hit and blow':HitAndBlow
    'janken':Janken
}

class GameProcedure{
    private currentGameTitle : GameTitle|'' = ''
    private currentGame : HitAndBlow | Janken | null = null 

    // 何も記載されていないコンストラクタだが、これで良い。
    // gameStoreプロパティがセットされる
    constructor(private readonly gameStore:GameStore){}

    public async start(){
        await this.select()
        await this.play()
    }

    private async select(){
        this.currentGameTitle = await promptSelect<GameTitle>('ゲームのタイトルを入力してください。', gameTitles)
        this.currentGame = this.gameStore[this.currentGameTitle]
    }

    private async play(){
        if(!this.currentGame)throw new Error('ゲームが選択されていません')
        printLine(`===\n${this.currentGameTitle}を開始します。\n===`)
        await this.currentGame.setting()
        await this.currentGame.play()
        this.currentGame.end()
        // this.end()
        const action = await promptSelect<NextAction>('ゲームを続けますか？',nextActions)
        if(action === 'play again'){
            await this.play()
        }else if(action === 'exit'){
            this.end()
        }else{
            const neverValue: never = action
            throw new Error(`${neverValue} is an invalid acton.`)
        }
    }

    private end(){
        printLine('ゲームを終了しました')
        process.exit()
    }
}

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
            printLine(`無効な入力です。`)
            await this.play()
            return
        }

        // 入力された回答の正誤判定をする。
        const result = this.check(inputArr)

        if(result.hit !== this.answer.length){
            // 不正解の場合→チェック結果を表示して続行
            printLine(`---\nHit: ${result.hit}\nBlow: ${result.blow}\n---`)
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
        printLine(`正解です！\n試行回数${this.tryCount}回`)
        // process.exit()
        this.reset()
    }

    private reset(){
        this.answer = []
        this.tryCount = 0
    }

}

// ジャンケン機能（コピー）
const jankenOptions = ['rock', 'paper', 'scissors'] as const
type JankenOption = typeof jankenOptions[number]

class Janken {
  private rounds = 0
  private currentRound = 1
  private result = {
    win: 0,
    lose: 0,
    draw: 0,
  }

  async setting() {
    const rounds = Number(await promptInput('何本勝負にしますか？'))
    if (Number.isInteger(rounds) && 0 < rounds) {
      this.rounds = rounds
    } else {
      await this.setting()
    }
  }

  async play() {
    const userSelected = await promptSelect(`【${this.currentRound}回戦】選択肢を入力してください。`, jankenOptions)
    const randomSelected = jankenOptions[Math.floor(Math.random() * 3)]
    const result = Janken.judge(userSelected, randomSelected)
    let resultText: string

    switch (result) {
      case 'win':
        this.result.win += 1
        resultText = '勝ち'
        break
      case 'lose':
        this.result.lose += 1
        resultText = '負け'
        break
      case 'draw':
        this.result.draw += 1
        resultText = 'あいこ'
        break
    }
    printLine(`---\nあなた: ${userSelected}\n相手${randomSelected}\n${resultText}\n---`)

    if (this.currentRound < this.rounds) {
      this.currentRound += 1
      await this.play()
    }
  }

  end() {
    printLine(`\n${this.result.win}勝${this.result.lose}敗${this.result.draw}引き分けでした。`)
    this.reset()
  }

  private reset() {
    this.rounds = 0
    this.currentRound = 1
    this.result = {
      win: 0,
      lose: 0,
      draw: 0,
    }
  }

  static judge(userSelected: JankenOption, randomSelected: JankenOption) {
    if (userSelected === 'rock') {
      if (randomSelected === 'rock') return 'draw'
      if (randomSelected === 'paper') return 'lose'
      return 'win'
    } else if (userSelected === 'paper') {
      if (randomSelected === 'rock') return 'win'
      if (randomSelected === 'paper') return 'draw'
      return 'lose'
    } else {
      if (randomSelected === 'rock') return 'lose'
      if (randomSelected === 'paper') return 'win'
      return 'draw'
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
    // const hitandBlow = new HitAndBlow()
    // await hitandBlow.setting()
    // await hitandBlow.play()
    // hitandBlow.end()
    // GameStore型に対応するものを記載
    new GameProcedure({
        'hit and blow':new HitAndBlow(),
        'janken':new Janken()
    }).start()
})()