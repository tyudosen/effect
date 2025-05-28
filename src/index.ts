import { Console, Effect } from "effect";

const fetchRequest = Effect.promise(
	() => fetch("https://pokeapi.co/api/v2/pokemon/garchomp/")
)

const jsonResponse = (response: Response) => Effect.promise(
	() => response.json()
)


const main = Effect.flatMap(
	fetchRequest,
	jsonResponse
).pipe(Effect.tap((res) => Console.log(res))
)

Effect.runPromise(main)
