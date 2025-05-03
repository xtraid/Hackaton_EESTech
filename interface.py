import streamlit as st
import pandas as pd
import googlemaps # type: ignore

def parse_url(url):
    """
    Parse the Google Maps URL to extract path data.
    """
    # For demonstration purposes, we will use a sample data.
    # Obtaining the csv file from local
    path_data = pd.read_csv("data/ebike_data.csv")
    return path_data

def main():
    st.title("E-Bike Battery Optimizer")
    st.write("Enter a Google Maps URL to optimize your e-bike battery performance.")

    # Google Maps URL input
    url = st.text_input("Google Maps URL", "")

    # Button to trigger optimization
    if st.button("Fetch data"):
        if url:
            path_data = parse_url(url)
            if path_data is not None:
                st.success("Data fetched successfully.")
                st.write(path_data.head())
            else:
                st.error("Failed to fetch data. Please check the URL.")
        else:
            st.warning("Please enter a valid Google Maps URL.")

    # User data inputs
    st.subheader("User Data (Optional)")
    age = st.number_input("Age", min_value=0, max_value=120, value=30)
    weight = st.number_input("Weight (kg)", min_value=0.0, value=70.0)
    height = st.number_input("Height (cm)", min_value=0, value=175)

    # Fatigue preference
    fatigue_level = st.slider("Desired Fatigue Level", min_value=1, max_value=5, value=3)
    # Sportivity level (eco, city, sport) with bullet points
    sportivity_level = st.select_slider(
        "Sportivity Level",
        options=["Eco", "City", "Sport"],
        value="Eco",
        format_func=lambda x: f"• {x}"
    )

if __name__ == "__main__":
    main()