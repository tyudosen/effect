import { Config, Context, Effect, Schema, type ParseResult } from "effect";
import { type ConfigError } from "effect/ConfigError";
import { FetchError, JsonError } from "./errors";
import { Pokemon } from "./schemas";
import { PokemonCollection } from "./PokemonCollection";
import { BuildPokeApiUrl } from "./BuildPokeApiUrl";

export interface PokeApiImpl {
	readonly getPokemon: Effect.Effect<Pokemon,
		FetchError | JsonError | ParseResult.ParseError | ConfigError>;

}

export class PokeApi extends Context.Tag("PokeApi")<PokeApi, PokeApiImpl>() {
	static readonly Live = PokeApi.of({
		getPokemon: Effect.gen(function* () {
			const pokemonCollection = yield* PokemonCollection;
			const buildPokeUrl = yield* BuildPokeApiUrl;

			const requestUrl = buildPokeUrl({
				name: pokemonCollection[0]
			})

			const response = yield* Effect.tryPromise({
				try: () => fetch(requestUrl),
				catch: () => new FetchError({ customMessage: 'Fetch Error' }),
			});


			if (!response.ok) {
				return yield* new FetchError({ customMessage: 'Fetch error' });
			}

			const json = yield* Effect.tryPromise({
				try: () => response.json(),
				catch: () => new JsonError({ customMessage: 'Json error' }),
			});

			return yield* Schema.decodeUnknown(Pokemon)(json);
		}),
	});
}
