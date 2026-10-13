import { Text, View } from "react-native";
import type { CityDTO, CountryDTO, HotelCardDataDTO, HotelDTO } from "../../Models/dto";
import { HotelCard } from "./HotelCard";

type Props = {
    hotels: HotelDTO[];
    cities: CityDTO[];
    countries: CountryDTO[];
    hotelCards: Record<number, HotelCardDataDTO>;
    onHotelPress: (hotel: HotelDTO) => void;
    emptyMessage?: string;
};

export const HotelList = ({ hotels, cities, countries, hotelCards, onHotelPress, emptyMessage = "No stays found." }: Props) => (
    <View>
        {hotels.length === 0 ? <Text style={{ marginHorizontal: 18, color: "#777", paddingVertical: 18 }}>{emptyMessage}</Text> : null}
        {hotels.map((hotel) => {
            const city = cities.find((item) => item.id === hotel.city);
            const country = countries.find((item) => item.id === city?.country);
            return (
                <HotelCard
                    key={hotel.id}
                    hotel={hotel}
                    cityName={city?.name}
                    countryName={country?.name}
                    cardData={hotelCards[hotel.id]}
                    onPress={() => onHotelPress(hotel)}
                />
            );
        })}
    </View>
);
