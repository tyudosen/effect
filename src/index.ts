import { Console, Effect, pipe } from "effect";

interface FetchError {
	readonly _tag: "FetchError"
}

interface JsonError {
	readonly _tag: "JsonError"
}

const fetchRequest = Effect.tryPromise(
	{
		try: () => fetch("https://pokeapi.co/api/v2/pokemon/garchomp/"),
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
	Effect.filterOrFail(
		(response) => response.ok,
		(): FetchError => ({
			_tag: "FetchError"
		})
	),
	Effect.flatMap(jsonResponse),
	Effect.tap((res) => Console.log(res)),
	Effect.catchTags({
		FetchError: () => Effect.succeed("Fetch error"),
		JsonError: () => Effect.succeed('Json error')
	}),
	Effect.tap((res) => Console.log(res)),


)

Effect.runPromise(main)
