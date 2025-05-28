import { Console, Data, Effect, pipe } from "effect";

class FetchError extends Data.TaggedError("FetchError")<
	{
		customMessage: string
	}
> { }

class JsonError extends Data.TaggedError("JsonError")<
	{
		customMessage: string
	}
> { }

const fetchRequest = Effect.tryPromise(
	{
		try: () => fetch("https://pokeapi.co/api/v2/pokemon/garchomp/"),
		catch: () => new FetchError({ customMessage: "Fetch failed" })
	}
)

const jsonResponse = (response: Response) => Effect.tryPromise(
	{
		try: () => response.json(),
		catch: () => new JsonError({ customMessage: 'Json error' })
	}
)

const savePokemon = (pokemon: string) => Effect.tryPromise(
	{
		try: () => fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}/`),
		catch: () => new FetchError({ customMessage: "Fetch failed" })
	}
)


const program = Effect.gen(function* () {
	const response = yield* fetchRequest;

	if (!response.ok) {
		throw new FetchError({ customMessage: 'fetchError' })
	}

	return yield* jsonResponse(response)

})

const main = program.pipe(
	Effect.tap((res) => Console.log(res)),
	Effect.catchTags({
		FetchError: () => Effect.succeed("Fetch error"),
		JsonError: () => Effect.succeed('Json error')
	})
)


Effect.runPromise(main)
