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