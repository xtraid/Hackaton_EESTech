import gpxpy
import pandas as pd

# Parse the GPX file
with open('data/ebike_data.gpx', 'r') as gpx_file:
    gpx = gpxpy.parse(gpx_file)

# Extract data points
data = []
for track in gpx.tracks:
    for segment in track.segments:
        for point in segment.points:
            data.append({
                'latitude': point.latitude,
                'longitude': point.longitude,
                'elevation': point.elevation,
                'time': point.time,
            })

# Create a DataFrame
df = pd.DataFrame(data)

# Calculate additional metrics (distance, speed, gradient)
# [Add calculation code as needed]

# Save to CSV
df.to_csv('data/ebike_data.csv', index=False)