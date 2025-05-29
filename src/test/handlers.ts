import type { Pokemon } from "../schemas";
import { HttpResponse, http } from 'msw'

const mockPokemon: Pokemon = {
	id: 1,
	order: 1,
	name: "name",
	height: 10,
	weight: 10
}


export const handlers = [
	http.get(
		"http://localhost:3000/api/v2/pokemon/*", () => {
			return HttpResponse.json(mockPokemon)
		}
	)
]
