import type { CountryDTO } from "../Models/dto";
import { apiRequest } from "./apiRequest";

export async function getCountries(): Promise<CountryDTO[]> {
    return apiRequest<CountryDTO[]>("/countries/", {
        method: "GET",
    });
}