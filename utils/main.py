import os

from gpxConverter import GpxConverter as GC
import sys
import pathlib

#split_geojsons = GC.write_split_json(input_geojson=output, n=6, connect_parts=True)

files = [
    r'\Downloads\gps-data-e5-long-distance-hiking-trail.geojson',
    r'\Downloads\gps-data-e5-long-distance-hiking-trail_0.geojson',
    r'\Downloads\gps-data-e5-long-distance-hiking-trail_1.geojson',
    r'\Downloads\gps-data-e5-long-distance-hiking-trail_2.geojson',
    r'\Downloads\gps-data-e5-long-distance-hiking-trail_3.geojson',
    r'\Downloads\gps-data-e5-long-distance-hiking-trail_4.geojson',
    r'\Downloads\gps-data-e5-long-distance-hiking-trail_5.geojson'
]

#for f in files:
    #print(f, GC.count_points(f))


#pathIn = r'\WebstormProjects\3D-Route\public\geodata\gpx'
#pathOut = r'\WebstormProjects\3D-Route\public\geodata\geoJson'
"""
#open folder and for loop every file
for filenames in os.listdir(pathIn):
    input = pathIn + "\\"+filenames
    output = pathOut+"\\"+filenames.replace(".gpx", ".geojson")
    print(output, input)
    print(GC.gpx_to_geojson(input, output))
    try:
        pathlib.Path(str(output).replace('.geojson', '.json')).rename(output)  # dumb ass library
    except:
        pathlib.Path(str(output).replace('.geojson', '.json')).replace(output)  # dumb ass library
"""

path = r'\WebstormProjects\3D-Route\public\geodata\geoJson'
remove =  r"\WebstormProjects\3D-Route\public"
""""
for filenames in os.listdir(path):
    concat = path+"\\"+filenames
    print(concat.replace(remove, "")., concat)
"""

print(GC.gpx_to_geojson(r'\WebstormProjects\AlpenX\geodata\gpx\Day1-2-Main.gpx', r'\WebstormProjects\AlpenX\geodata\geoJson\Day1-2-Main.geojson'))
