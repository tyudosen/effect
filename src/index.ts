import { Console, Effect, pipe } from "effect";

const fetchRequest = Effect.tryPromise(
	() => fetch("https://pokeapi.co/api/v2/pokemon/garchom/")
)

const jsonResponse = (response: Response) => Effect.tryPromise(
	() => response.json()
)

const savePokemon = (pokemon: string) => Effect.tryPromise(
	() => fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}/`)
)


const main = pipe(
	fetchRequest,
	Effect.flatMap(jsonResponse),
	Effect.tap((res) => Console.log(res)),
	Effect.catchTag(
		"UnknownException",
		() => savePokemon("pikachu").pipe(Effect.flatMap(jsonResponse))
	),
	Effect.tap((res) => Console.log(res)),


)

Effect.runPromise(main)
