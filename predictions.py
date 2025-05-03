import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers # type: ignore
import pandas as pd
import pickle

# Assume the data is loaded into a pandas DataFrame called 'data'
input_features = ['Voltage_measured', 'Current_measured', 'Temperature_measured', 
                  'SoC', 'cycle_number']
target = 'SoH'

data = pd.read_csv("data/battery_health_dataset.csv")  # Load your dataset

# Split into input (X) and output (y) variables
X = data[input_features]
y = data[target]

# Build the model
model = keras.Sequential([
    layers.Dense(64, activation='relu', input_shape=[len(input_features)]),
    layers.Dense(64, activation='relu'),
    layers.Dense(1)
])

# Compile the model 
model.compile(loss='mse', # Mean squared error
              optimizer=tf.keras.optimizers.RMSprop(0.001),
              metrics=['mae', 'mse'])  # Mean absolute error

# Train the model
history = model.fit(X, y, epochs=100, validation_split=0.2)

# Save model architecture to JSON
model_json = model.to_json()

# Save model weights
model_weights = model.get_weights()

# Pickle the model architecture and weights
with open('soh_model.pkl', 'wb') as f:
    pickle.dump((model_json, model_weights), f)

# To load the model later:
# with open('soh_model.pkl', 'rb') as f:
#     model_json, model_weights = pickle.load(f)
#
# loaded_model = keras.models.model_from_json(model_json)
# loaded_model.set_weights(model_weights)

# To make predictions with the loaded model:
# predictions = loaded_model.predict(new_data)