import { Config, Context, Effect, Schema, type ParseResult } from "effect";
import { type ConfigError } from "effect/ConfigError";
import { FetchError, JsonError } from "./errors";
import { Pokemon } from "./schemas";

export interface PokeApiImpl {
	readonly getPokemon: Effect.Effect<Pokemon,
		FetchError | JsonError | ParseResult.ParseError | ConfigError>;

}

export class PokeApi extends Context.Tag("PokeApi")<PokeApi, PokeApiImpl>() {
	static readonly Live = PokeApi.of({
		getPokemon: Effect.gen(function* () {
			const baseUrl = yield* Config.string("BASE_URL");

			const response = yield* Effect.tryPromise({
				try: () => fetch(`${baseUrl}/api/v2/pokemon/garchomp/`),
				catch: () => new FetchError({ customMessage: 'Fetch error' }),
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
