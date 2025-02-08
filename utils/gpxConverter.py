from geojson_transformer import GeoJsonTransformer
import json
# GPX to GeoJSON converter
class GpxConverter:

    @staticmethod
    def gpx_to_geojson_lib(input_file, output_file):
        gpxfile = GeoJsonTransformer(path=input_file)
        # why do you overwrite my filetype you little shit, i specify geojson and you return json
        # probably because this is a noname library, author even has his reminder to rework still left in
        return gpxfile.save_geojson(filepath=output_file, save_file=True)


#acjnficlocl eicja lle iocj löasse das kaej so stheetn es rihc tmit du scheis smneitho
    @staticmethod
    def gpx_to_geojson(input_file, output_file):
        gpxfile = GeoJsonTransformer(path=input_file)
        # why do you overwrite my filetype you little shit, i specify geojson and you return json
        # probably because this is a noname library, author even has his reminder to rework still left in
        return gpxfile.save_geojson(filepath=output_file, save_file=True)

    def save_geojson(input_file, output_file, save_file=True, bytes_like=False):
        """Creates a GeoJson file at the specified filepath."""
        gpxfile = GeoJsonTransformer(path=input_file)

        with open(output_file, 'w') as outfile:
            json.dump(gpxfile._make_geojson(), outfile)
            return outfile




    @staticmethod
    def split_geojson(input_geojson, n, connect_parts=False):
        with open(input_geojson, 'r') as f:
            geojson_data = json.load(f)
        coordinates = geojson_data['features'][0]['geometry']['coordinates']
        part_size = len(coordinates) // n
        parts = [coordinates[i * part_size:(i + 1) * part_size] for i in range(n)]
        if len(coordinates) % n != 0:
            parts[-1].extend(coordinates[n * part_size:])

        if connect_parts:
            for i in range(1, len(parts)):
                parts[i].insert(0, parts[i-1][-1])

        new_geojsons = []
        for i, part in enumerate(parts):
            new_geojson = {
                "type": "FeatureCollection",
                "features": [
                    {
                        "type": "Feature",
                        "properties": geojson_data['features'][0]['properties'],
                        "geometry": {
                            "type": "LineString",
                            "coordinates": part
                        }
                    }
                ]
            }
            new_geojsons.append(new_geojson)

        return new_geojsons

    @staticmethod
    def write_split_json(input_geojson, n=3, output_geojson=None, connect_parts=False):
        if output_geojson is None:
            output_geojson = input_geojson
        new_geojsons = GpxConverter.split_geojson(input_geojson, n, connect_parts)
        for i, geojson in enumerate(new_geojsons):
            with open(f"{output_geojson.split('.')[0]}_{i}.{output_geojson.split('.')[1]}", 'w') as f:
                json.dump(geojson, f)
    @staticmethod
    def count_points(input_geojson):
        with open(input_geojson, 'r') as f:
            geojson_data = json.load(f)
        return len(geojson_data['features'][0]['geometry']['coordinates'])