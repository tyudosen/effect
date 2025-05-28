import { Schema } from "effect";

export class Pokemon extends Schema.Class<Pokemon>("Pokemon")({
	// 👇 Parameters are the same as `Schema.Struct`
	id: Schema.Number,
	order: Schema.Number,
	name: Schema.String,
	height: Schema.Number,
	weight: Schema.Number,
}) { }


