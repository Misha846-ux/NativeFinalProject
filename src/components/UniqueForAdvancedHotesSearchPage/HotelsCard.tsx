import type { HotelDTO } from "../../Models/dto";
import { HotelCardBase } from "../GeneralComponents/HotelCardBase";

type Props = {
    hotel: HotelDTO;
    cityName?: string;
    countryName?: string;
    onPress: () => void;
};

export const HotelsCard = (props: Props) => <HotelCardBase {...props} />;