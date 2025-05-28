import { Console, Effect, pipe } from "effect";

interface FetchError {
	readonly _tag: "FetchError"
}

interface JsonError {
	readonly _tag: "JsonError"
}

const fetchRequest = Effect.tryPromise(
	{
		try: () => fetch("https://pokeapi.co/api/v2/pokemon/garchom/"),
		catch: (): FetchError => ({ _tag: "FetchError" })
	}
)

const jsonResponse = (response: Response) => Effect.tryPromise(
	{
		try: () => response.json(),
		catch: (): JsonError => ({ _tag: "JsonError" })
	}
)

const savePokemon = (pokemon: string) => Effect.tryPromise(
	{
		try: () => fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}/`),
		catch: (): FetchError => ({ _tag: 'FetchError' })
	}
)


const main = pipe(
	fetchRequest,
	Effect.flatMap(jsonResponse),
	Effect.tap((res) => Console.log(res)),
	Effect.catchTag(
		"JsonError",
		() => savePokemon("pikachu").pipe(Effect.flatMap(jsonResponse))
	),
	Effect.tap((res) => Console.log(res)),


)

Effect.runPromise(main)
