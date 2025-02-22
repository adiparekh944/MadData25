import boto3
import json

rekognition = boto3.client("rekognition")

def detect_objects(image_path):
    with open(image_path, "rb") as image:
        response = rekognition.detect_labels(
            Image={"Bytes": image.read()},
            MaxLabels=10,
            MinConfidence=75
        )

    # Extract detected items
    detected_items = {
        label["Name"]: label["Confidence"] for label in response["Labels"]
    }

    return detected_items

image_path = "pics/applepics.jpg"  # Change to your actual image path
print(json.dumps(detect_objects(image_path), indent=2))
