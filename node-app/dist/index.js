"use strict";
// 即時関数から開始
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// 受け取った値を出力するだけ
// 引数の=trueはタイが引き渡られなかった場合にundefinedを防止するためのデフォルト値
var printline = function (text, breakLine) {
    if (breakLine === void 0) { breakLine = true; }
    process.stdout.write(text + (breakLine ? '\n' : ''));
};
// 入力関数
// asyncとawaitでpromiseからの返り値を扱う
// process.stdin.onceで値を一度のみ受け取る
var promptInput = function (text) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        printline("\n" + text + "\n>", false);
        // Promiseの前のnewは要らないらしい。Promiseは非同期処理用のインタフェースらしい。
        // const input : string = await new Promise((resolve) => process.stdin.once('data',(data) => resolve(data.toString())))
        //return input.trim()
        return [2 /*return*/, readLine()];
    });
}); };
var readLine = function () { return __awaiter(void 0, void 0, void 0, function () {
    var input;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, new Promise(function (resolve) { return process.stdin.once('data', function (data) { return resolve(data.toString()); }); })];
            case 1:
                input = _a.sent();
                return [2 /*return*/, input.trim()];
        }
    });
}); };
// モード選択 ジェネリクスで型指定
var promptSelect = function (text, values) { return __awaiter(void 0, void 0, void 0, function () {
    var input;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                printline("\n" + text);
                // モードの種類を出力し提示
                values.forEach(function (value) {
                    printline("-" + value);
                });
                printline("> ", false);
                return [4 /*yield*/, readLine()];
            case 1:
                input = (_a.sent());
                if (values.includes(input)) {
                    // 正しくmodeが入力された場合
                    return [2 /*return*/, input];
                }
                else {
                    // normalかhard意外が入力された場合
                    return [2 /*return*/, promptSelect(text, values)];
                }
                return [2 /*return*/];
        }
    });
}); };
// as const で readonly の扱いになる。タプル型
var modes = ['normal', 'hard'];
// 上だと可読性的に嬉しいらしい
var HitAndBlow = /** @class */ (function () {
    function HitAndBlow() {
        // 型アノテーション(string[]など)も本来なら不要。ただし、answerについては初期値が空なので必要。
        this.answerSource = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        this.answer = [];
        this.tryCount = 0;
        this.mode = 'normal';
    }
    // コンストラクター。constructorで宣言。インスタンス作成時に実行
    //constructor(mode: Mode){
    //    this.mode = mode
    //}
    // 問題の正解となる数字列を作成する。
    HitAndBlow.prototype.setting = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, answerLength, randNum, selectedItem;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // asで型アサーション
                        //this.mode = await promptInput('normalかhardでモードを入力してください') as Mode
                        _a = this;
                        return [4 /*yield*/, promptSelect('normalかhardでモードを入力してください', modes)
                            // 1.answerSourceからランダムに値を１つ取り出す。
                            // 2.その値がまだ使用されていないものであればanswer配列に追加する。
                            // 3.answer配列が所定の数埋まるまで1~2を繰り返す。
                        ];
                    case 1:
                        // asで型アサーション
                        //this.mode = await promptInput('normalかhardでモードを入力してください') as Mode
                        _a.mode = _b.sent();
                        answerLength = this.getanswerLength();
                        while (this.answer.length < answerLength) {
                            randNum = Math.floor(Math.random() * this.answerSource.length);
                            selectedItem = this.answerSource[randNum];
                            if (!this.answer.includes(selectedItem)) {
                                this.answer.push(selectedItem);
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    // modeによる難易度（正解配列数）の設定
    HitAndBlow.prototype.getanswerLength = function () {
        switch (this.mode) {
            case 'normal':
                return 3;
            case 'hard':
                return 4;
            default:
                throw new Error(this.mode + "\u306F\u7121\u52B9\u306A\u30E2\u30FC\u30C9\u3067\u3059");
        }
    };
    // H&Bの本体部分
    HitAndBlow.prototype.play = function () {
        return __awaiter(this, void 0, void 0, function () {
            var answeLength, inputArr, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        answeLength = this.getanswerLength();
                        return [4 /*yield*/, promptInput("\u300C,\u300D\u533A\u5207\u308A\u3067" + answeLength + "\u3064\u306E\u6570\u5B57\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044")];
                    case 1:
                        inputArr = (_a.sent()).split(',');
                        if (!!this.validate(inputArr)) return [3 /*break*/, 3];
                        printline("\u7121\u52B9\u306A\u5165\u529B\u3067\u3059\u3002");
                        return [4 /*yield*/, this.play()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                    case 3:
                        result = this.check(inputArr);
                        if (!(result.hit !== this.answer.length)) return [3 /*break*/, 5];
                        // 不正解の場合→チェック結果を表示して続行
                        printline("---\nHit: " + result.hit + "\nBlow: " + result.blow + "\n---");
                        this.tryCount += 1;
                        // awaitが無くても動く。何用？
                        return [4 /*yield*/, this.play()];
                    case 4:
                        // awaitが無くても動く。何用？
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        // 正解の場合→終了
                        this.tryCount += 1;
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    // 入力チェック
    HitAndBlow.prototype.validate = function (inputArr) {
        var _this = this;
        // 入力された長さを判定
        var isLengthValid = inputArr.length === this.answer.length;
        // answerSourceに含まれている文字列か（everyはforループみたいなもん）
        var isAllAnsewerSourceOption = inputArr.every(function (val) { return _this.answerSource.includes(val); });
        // それぞれの文字列に重複がないか
        var isAllDifferentValues = inputArr.every(function (val, i) { return inputArr.indexOf(val) === i; });
        return isLengthValid && isAllAnsewerSourceOption && isAllDifferentValues;
    };
    // 回答入力後の正誤判定処理
    HitAndBlow.prototype.check = function (input) {
        var _this = this;
        var hitCount = 0;
        var blowCount = 0;
        input.forEach(function (val, index) {
            if (val === _this.answer[index]) {
                // ヒットの場合
                hitCount += 1;
            }
            else if (_this.answer.includes(val)) {
                // ブローの場合
                blowCount += 1;
            }
        });
        return {
            hit: hitCount,
            blow: blowCount
        };
    };
    // ゲームの終了
    HitAndBlow.prototype.end = function () {
        printline("\u6B63\u89E3\u3067\u3059\uFF01\n\u8A66\u884C\u56DE\u6570" + this.tryCount + "\u56DE");
        process.exit();
    };
    return HitAndBlow;
}());
// 即時関数
// ;は無くても34行目でも動く。要らない。
;
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var hitandBlow;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                hitandBlow = new HitAndBlow();
                return [4 /*yield*/, hitandBlow.setting()];
            case 1:
                _a.sent();
                return [4 /*yield*/, hitandBlow.play()];
            case 2:
                _a.sent();
                hitandBlow.end();
                return [2 /*return*/];
        }
    });
}); })();
