package utils

import "strings"

// FormatProfileAddress combines street, city, state, and zip into a single
// formatted address string without trailing commas or extra whitespace.
func FormatProfileAddress(street, city, state, zip string) string {
	street = strings.TrimSpace(street)
	city = strings.TrimSpace(city)
	state = strings.TrimSpace(state)
	zip = strings.TrimSpace(zip)

	cityState := strings.TrimSpace(strings.Join([]string{city, state}, ", "))
	cityStateZip := cityState
	if zip != "" {
		if cityStateZip != "" {
			cityStateZip += " " + zip
		} else {
			cityStateZip = zip
		}
	}

	if street != "" && cityStateZip != "" {
		return street + ", " + cityStateZip
	}
	if street != "" {
		return street
	}
	return cityStateZip
}
