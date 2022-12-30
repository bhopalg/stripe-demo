export interface GoogleAddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
}
export interface GooglePlaceResult {
    address_components: GoogleAddressComponent[];
    formatted_address: string;
    geometry: {
        location: {
            lat: number;
            lng: number;
        };
    };
    place_id: string;
    html_attributions: string[];
}
