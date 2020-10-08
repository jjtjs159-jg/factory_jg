let looselyTyped: any = 4;
// OK, ifItExists might exist at runtime
looselyTyped.ifItExists();
// OK, toFixed exists (but the compiler doesn't check)
looselyTyped.toFixed();


let unusable: void = undefined;
// unusable = null

// Not much else we can assign to these variables!
let u: undefined = undefined;
let n: null = null;

// Function returning never must not have a reachable end point
function error(message: string): never {
    throw new Error(message);
}

function fail() {
    return error("Something failed");
}

function infiniteLoop(): never {
    while (true) {

    }
}

let someValue: unknown = 'this is a string';
let strLength: number = (someValue as string).length;
let strLength2: number = (<string>someValue).length;

interface LabeledValue {
    label: string;
}

function printLabel(labeledObj: LabeledValue) {
    console.log(labeledObj.label);
}

let myObj = { size: 10, label: "Size 10 Object" };
printLabel(myObj);
printLabel({ size: 10, label: "Size 10 Object" } as LabeledValue);

interface Point {
	readonly x: number;
	readonly y: number;
}

let p1: Point = {
	x: 10,
	y: 20,
};

// p1.x = 5; // Error

let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;

// ro[0] = 12; // Error
// ro.push(5); // Error
// ro.length = 100; // Error
// a = ro; // Error

a = ro as number[]; // OK

interface SquareConfig {
    color?: string;
    width?: number;
}

function createSquare(config: SquareConfig): void {
    // ...
}

// let mySquare = createSquare({ colour: "red", width: 100 });


// interface IClock {
//     currentTime: Date;
//     setTime(d: Date): void;
// }

// class Clock implements IClock {
//     currentTime: Date = new Date();
//     setTime(d: Date) {
//         this.currentTime = d;
//     }

//     constructor(h: number, m: number) {

//     }
// }

// class Control {
//     private state: any;
// }

// interface Shape extends Control {
//     color: string;
// }

// interface PenStroke {
//     penWidth: number;
// }

// class Button extends Control implements Shape {
//     select() { }
//     color: 'red';
// }

// interface Square extends Shape, PenStroke {
//     sideLength: number;
// }

// let square = {} as Square;
// square.color = "blue";
// square.sideLength = 10;
// square.penWidth = 5;
interface Card {
    suit: string;
    card: number;
}
interface Deck {
    suits: string[];
    cards: number[];
    createCardPicker(this: Deck): () => Card;
}
let deck: Deck = {
    suits: ["hearts", "spades", "clubs", "diamonds"],
    cards: Array(52),
    // NOTE: 아래 함수는 이제 callee가 반드시 Deck 타입이어야 함을 명시적으로 지정합니다.
    createCardPicker: function(this) {
        return () => {
            let pickedCard = Math.floor(Math.random() * 52);
            let pickedSuit = Math.floor(pickedCard / 13);

            return {suit: this.suits[pickedSuit], card: pickedCard % 13};
        }
    }
}

let cardPicker = deck.createCardPicker();
let pickedCard = cardPicker();

const helloWorld = "Hello World";

// 반면, let은 변경될 수 있으므로 컴파일러는 문자열이라고 선언할 것입니다.
let hiWorld = "Hi World";