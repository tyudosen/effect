import { Config, Console, Data, Effect, pipe, Schema } from "effect";

const config = Config.string('BASE_URL');

class Pokemon extends Schema.Class<Pokemon>("Pokemon")({
	// 👇 Parameters are the same as `Schema.Struct`
	id: Schema.Number,
	order: Schema.Number,
	name: Schema.String,
	height: Schema.Number,
	weight: Schema.Number,
}) { }

const decodePokemon = Schema.decodeUnknown(Pokemon)

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

const fetchRequest = (baseUrl: string) => Effect.tryPromise(
	{
		try: () => fetch(`${baseUrl}/api/v2/pokemon/garchomp/`),
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
	const baseUrl = yield* config;
	const response = yield* fetchRequest(baseUrl);

	if (!response.ok) {
		throw new FetchError({ customMessage: 'fetchError' })
	}

	const json = yield* jsonResponse(response)
	return yield* decodePokemon(json)

})

const main = program.pipe(
	Effect.tap((res) => Console.log(res)),
	Effect.catchTags({
		FetchError: () => Effect.succeed("Fetch error"),
		JsonError: () => Effect.succeed('Json error'),
		ParseError: () => Effect.succeed('Parse error'),
	})
)


Effect.runPromise(main)
