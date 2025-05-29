import { Effect, Layer } from "effect";
import { PokeApi } from "./PokeApi";

const MainLayer = Layer.mergeAll(
	PokeApi.Default,
);


const program = Effect.gen(function* () {
	const pokeApi = yield* PokeApi;
	return yield* pokeApi.getPokemon;
});

const runnable = program.pipe(Effect.provide(MainLayer));

const main = runnable.pipe(
	Effect.catchTags({
		FetchError: () => Effect.succeed("Fetch error"),
		JsonError: () => Effect.succeed("Json error"),
		ParseError: () => Effect.succeed("Parse error"),
	})
);

Effect.runPromise(main).then(console.log);
