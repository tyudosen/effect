import { Config, Console, Data, Effect, Schema } from "effect";
import { Pokemon } from "./schemas";

const config = Config.string('BASE_URL');


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



const program = Effect.gen(function* () {
	const baseUrl = yield* config;
	const response = yield* Effect.tryPromise(
		{
			try: () => fetch(`${baseUrl}/api/v2/pokemon/garchomp/`),
			catch: () => new FetchError({ customMessage: "Fetch failed" })
		}
	)


	if (!response.ok) {
		throw new FetchError({ customMessage: 'fetchError' })
	}

	const json = yield* Effect.tryPromise(
		{
			try: () => response.json(),
			catch: () => new JsonError({ customMessage: 'Json error' })
		}
	)

	return yield* Schema.decodeUnknown(Pokemon)(json)

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
