import { Context } from "effect";

export class BuildPokeUrl extends Context.Tag("BuildPokeUrl")<BuildPokeUrl, (props: { name: string }) => string>() { }
