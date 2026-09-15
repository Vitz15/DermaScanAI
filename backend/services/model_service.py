import os
import base64
import io
import numpy as np
from PIL import Image
from tensorflow.keras.applications.efficientnet import preprocess_input

CLASS_LABELS = {
    "akiec": "Actinic Keratosis",
    "bcc": "Basal Cell Carcinoma",
    "bkl": "Benign Keratosis",
    "df": "Dermatofibroma",
    "mel": "Melanoma",
    "nv": "Nevus",
    "vasc": "Vascular Lesion",
}

IMG_SIZE = 224
LAST_CONV_LAYER = "top_activation"

_model = None


def load_model_if_needed():
    global _model
    if _model is None:
        import tensorflow as tf
        model_path = os.getenv("MODEL_PATH")
        _model = tf.keras.models.load_model(model_path)
    return _model


def _preprocess(image_bytes: bytes) -> np.ndarray:
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB").resize((IMG_SIZE, IMG_SIZE))
    arr = np.array(img).astype("float32")
    arr = preprocess_input(arr)
    return np.expand_dims(arr, axis=0)


def predict(image_bytes: bytes) -> dict:
    model = load_model_if_needed()
    arr = _preprocess(image_bytes)
    preds = model.predict(arr)[0]

    keys = list(CLASS_LABELS.keys())
    probs = {cls: float(p) for cls, p in zip(keys, preds)}

    top_class = max(probs, key=probs.get)
    return {
        "class": top_class,
        "class_label_readable": CLASS_LABELS[top_class],
        "confidence": probs[top_class],
        "all_probabilities": probs,
    }


def generate_gradcam(image_bytes: bytes, predicted_class: str) -> str:
    from services.gradcam import make_gradcam_heatmap, overlay_heatmap

    model = load_model_if_needed()
    arr = _preprocess(image_bytes)

    heatmap = make_gradcam_heatmap(arr, model, last_conv_layer_name=LAST_CONV_LAYER)
    overlaid = overlay_heatmap(heatmap, image_bytes, img_size=IMG_SIZE)

    buf = io.BytesIO()
    overlaid.save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode("utf-8")