import { Context, Effect } from "effect";
import { PokeApiUrl } from "./PokeApiUrl";

export class BuildPokeApiUrl extends Context.Tag("BuildPokeUrl")<BuildPokeApiUrl, (props: { name: string }) => string>() {
	static readonly Live = Effect.gen(function* () {
		const pokeApiUrl = yield* PokeApiUrl;
		return BuildPokeApiUrl.of(({ name }) => `${pokeApiUrl}/${name}`);
	})
}
