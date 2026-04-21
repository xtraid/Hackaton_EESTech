import pandas as pd
import numpy as np
import math

# Load your Strava data (replace with your actual file path)
strava_df = pd.read_csv('data/ebike_data.csv')

# Print the actual columns for debugging
print("Available columns in your CSV:", strava_df.columns.tolist())

# First, let's clean and prepare the Strava data
# Standardize column names
if 'lat' not in strava_df.columns and 'latitude' in strava_df.columns:
    strava_df['lat'] = strava_df['latitude']
    
if 'lng' not in strava_df.columns and 'longitude' in strava_df.columns:
    strava_df['lng'] = strava_df['longitude']

if 'altitude' in strava_df.columns and 'elevation' not in strava_df.columns:
    strava_df['elevation'] = strava_df['altitude']
elif 'ele' in strava_df.columns and 'elevation' not in strava_df.columns:
    strava_df['elevation'] = strava_df['ele']

# IMPORTANT: Make sure we have distance in meters (Google Maps uses meters)
# Check which distance column exists and create distance_m
if 'distance' in strava_df.columns:
    # Check if distance is likely in km (small values) and convert to meters
    if strava_df['distance'].max() < 1000:  # Likely in km
        strava_df['distance_m'] = strava_df['distance'] * 1000
    else:  # Already in meters
        strava_df['distance_m'] = strava_df['distance']
elif 'dist' in strava_df.columns:
    if strava_df['dist'].max() < 1000:  # Likely in km
        strava_df['distance_m'] = strava_df['dist'] * 1000
    else:  # Already in meters
        strava_df['distance_m'] = strava_df['dist']
else:
    # If no distance column exists, create one based on coordinates
    print("No distance column found - calculating distances from coordinates")
    strava_df['distance_m'] = 0
    
    # Function to calculate distance between points
    def haversine(lat1, lon1, lat2, lon2):
        R = 6371000  # Earth radius in meters
        phi1 = math.radians(lat1)
        phi2 = math.radians(lat2)
        delta_phi = math.radians(lat2 - lat1)
        delta_lambda = math.radians(lon2 - lon1)
        
        a = math.sin(delta_phi/2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda/2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
        return R * c
    
    # Calculate cumulative distance
    for i in range(1, len(strava_df)):
        prev_lat = strava_df['lat'].iloc[i-1]
        prev_lng = strava_df['lng'].iloc[i-1]
        curr_lat = strava_df['lat'].iloc[i]
        curr_lng = strava_df['lng'].iloc[i]
        
        segment_dist = haversine(prev_lat, prev_lng, curr_lat, curr_lng)
        strava_df.at[i, 'distance_m'] = strava_df['distance_m'].iloc[i-1] + segment_dist

# Calculate gradient if not present
if 'grade_percent' not in strava_df.columns and 'elevation' in strava_df.columns:
    # Convert distance to km for gradient calculation if needed
    distance_km = strava_df['distance_m'] / 1000
    # Use numpy gradient function to calculate the gradient
    strava_df['grade_percent'] = np.gradient(strava_df['elevation'], distance_km) * 100

# Check that we have all required columns before proceeding
required_cols = ['lat', 'lng', 'elevation', 'distance_m']
for col in required_cols:
    if col not in strava_df.columns:
        print(f"WARNING: Missing required column: {col}")

# Print the max distance for verification
print(f"Route distance: {strava_df['distance_m'].max() / 1000:.2f} km")

# Create Google Maps API-like structure
google_directions = {
    'status': 'OK',
    'geocoded_waypoints': [
        {
            'geocoder_status': 'OK',
            'place_id': 'start_place',
            'types': ['route']
        },
        {
            'geocoder_status': 'OK',
            'place_id': 'end_place',
            'types': ['route']
        }
    ],
    'routes': [
        {
            'summary': 'Strava Route',
            'legs': [
                {
                    'distance': {
                        'text': f"{strava_df['distance_m'].max() / 1000:.1f} km",
                        'value': int(strava_df['distance_m'].max())
                    },
                    'duration': {
                        'text': '30 mins',  # Placeholder - adjust if you have time data
                        'value': 1800       # Seconds
                    },
                    'start_location': {
                        'lat': float(strava_df['lat'].iloc[0]),
                        'lng': float(strava_df['lng'].iloc[0])
                    },
                    'end_location': {
                        'lat': float(strava_df['lat'].iloc[-1]),
                        'lng': float(strava_df['lng'].iloc[-1])
                    },
                    'start_address': 'Starting Point',
                    'end_address': 'Ending Point',
                    'steps': []
                }
            ],
            'overview_polyline': {
                'points': 'encoded_polyline_would_go_here'  # Placeholder
            },
            'warnings': [],
            'waypoint_order': []
        }
    ]
}

# Add elevation data (similar to what you'd get from the Elevation API)
elevation_data = []
for i, row in strava_df.iterrows():
    elevation_data.append({
        'location': {
            'lat': float(row['lat']),
            'lng': float(row['lng'])
        },
        'elevation': float(row['elevation']),
        'resolution': 10.0  # Typical resolution value from Google API
    })

# Create steps (breaking the route into logical segments)
# For simplicity, we'll create steps every 1km
step_distance = 1000  # 1km in meters
current_distance = 0
last_step_index = 0

for i, row in strava_df.iterrows():
    if row['distance_m'] - current_distance >= step_distance or i == len(strava_df) - 1:
        # Create a step
        step = {
            'distance': {
                'text': f"{(row['distance_m'] - current_distance) / 1000:.1f} km",
                'value': int(row['distance_m'] - current_distance)
            },
            'duration': {
                'text': '10 mins',  # Placeholder
                'value': 600        # Seconds
            },
            'start_location': {
                'lat': float(strava_df['lat'].iloc[last_step_index]),
                'lng': float(strava_df['lng'].iloc[last_step_index])
            },
            'end_location': {
                'lat': float(row['lat']),
                'lng': float(row['lng'])
            },
            'html_instructions': f"Continue for {(row['distance_m'] - current_distance) / 1000:.1f} km",
            'travel_mode': 'BICYCLING',
            'polyline': {
                'points': 'segment_polyline_would_go_here'  # Placeholder
            }
        }
        
        google_directions['routes'][0]['legs'][0]['steps'].append(step)
        current_distance = row['distance_m']
        last_step_index = i

# Combine into a complete response that includes both directions and elevations
combined_response = {
    'directions_response': google_directions,
    'elevation_response': {
        'results': elevation_data,
        'status': 'OK'
    }
}

# Convert to desired output format (JSON or CSV)
import json
with open('google_maps_format.json', 'w') as f:
    json.dump(combined_response, f, indent=2)

# For CSV format with the most important data (similar to what we'd extract from the JSON)
csv_data = []

for i, point in enumerate(elevation_data):
    entry = {
        'latitude': point['location']['lat'],
        'longitude': point['location']['lng'],
        'elevation': point['elevation'],
        'distance_m': strava_df['distance_m'].iloc[i] if i < len(strava_df) else None,
    }
    
    # Add gradient if available
    if 'grade_percent' in strava_df.columns and i < len(strava_df):
        entry['gradient_percent'] = strava_df['grade_percent'].iloc[i]
    
    csv_data.append(entry)

# Save to CSV
pd.DataFrame(csv_data).to_csv('data/google_maps_format.csv', index=False)

print("Conversion complete. Files created: google_maps_format.json and google_maps_format.csv")