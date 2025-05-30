import { afterAll, afterEach, beforeAll, expect, it } from 'vitest'
import { PokeApi } from '../PokeApi';
import { Effect, Layer, ManagedRuntime } from 'effect';
import { server } from './node';
import { ConfigProviderLayer } from './configProvider';


beforeAll(() => server.listen());
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const MainLayer = PokeApi.Default.pipe(
	// 👇 Provide the `ConfigProvider` layer to `PokeApi.Live`
	Layer.provide(ConfigProviderLayer),
);
const TestRuntime = ManagedRuntime.make(MainLayer)



const program = Effect.gen(function* () {
	const pokeApi = yield* PokeApi;
	return yield* pokeApi.getPokemon;
});


it("returns a valid pokemon", async () => {
	const response = await TestRuntime.runPromise(program)
	expect(response).toEqual({
		id: 1,
		height: 10,
		weight: 10,
		order: 1,
		name: "name",
	});
});
