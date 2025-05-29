import { Config, Context, Effect, Layer, Schema, type ParseResult } from "effect";
import { type ConfigError } from "effect/ConfigError";
import { FetchError, JsonError } from "./errors";
import { Pokemon } from "./schemas";
import { PokemonCollection } from "./PokemonCollection";
import { BuildPokeApiUrl } from "./BuildPokeApiUrl";

const make = Effect.gen(function* () {
	/// 1️⃣ Extract `PokemonCollection` and `BuildPokeApiUrl` outside of `getPokemon` 
	const pokemonCollection = yield* PokemonCollection;
	const buildPokeApiUrl = yield* BuildPokeApiUrl;

	return {
		getPokemon: Effect.gen(function* () {
			const requestUrl = buildPokeApiUrl({ name: pokemonCollection[0] });

			const response = yield* Effect.tryPromise({
				try: () => fetch(requestUrl),
				catch: () => new FetchError({ customMessage: 'Fetch Error' }),
			});

			if (!response.ok) {
				return yield* new FetchError({ customMessage: 'Fetch Error' });
			}

			const json = yield* Effect.tryPromise({
				try: () => response.json(),
				catch: () => new JsonError({ customMessage: 'JSON Error' }),
			});

			return yield* Schema.decodeUnknown(Pokemon)(json);
		}),
	};
});

export class PokeApi extends Context.Tag("PokeApi")<
	PokeApi,
	/// 2️⃣ Change the definition of the service to `Effect.Effect.Success<typeof make>`
	Effect.Effect.Success<typeof make>
>() {
	static readonly Live = Layer.effect(this, make).pipe(
		// 👇 Remember: provide dependencies directly inside `Live`
		Layer.provide(Layer.mergeAll(PokemonCollection.Live, BuildPokeApiUrl.Live))
	);
}
