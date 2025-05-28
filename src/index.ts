import { Console, Effect } from "effect";


const main = Console.log("Hi mom");

Effect.runSync(main)
