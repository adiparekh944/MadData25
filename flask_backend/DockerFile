FROM python:3.9-slim

# Install system dependencies required for OpenCV
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /MadData/flask_backend

COPY . /MadData/flask_backend

# Install Python dependencies from requirements file
RUN pip install -r requirements-lite.txt

CMD python rest_api.py




