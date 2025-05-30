import { ConfigProvider, Layer } from "effect";

const TestConfigProvider = ConfigProvider.fromMap(
	new Map([
		["BASE_URL", "http://localhost:3000"]
	])
)

export const ConfigProviderLayer = Layer.setConfigProvider(TestConfigProvider)
