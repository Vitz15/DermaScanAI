import tensorflow as tf
import numpy as np
import cv2
from PIL import Image
import io


def make_gradcam_heatmap(img_array, model, last_conv_layer_name, pred_index=None):
    last_conv_layer = model.get_layer(last_conv_layer_name)

    grad_model = tf.keras.models.Model(
        inputs=model.input,
        outputs=[last_conv_layer.output, model.output]
    )

    with tf.GradientTape() as tape:
        conv_outputs, predictions = grad_model(img_array)
        if pred_index is None:
            pred_index = tf.argmax(predictions[0])
        loss = predictions[:, pred_index]

    grads = tape.gradient(loss, conv_outputs)
    if grads is None:
        raise ValueError(
            f"Gradient None -- layer '{last_conv_layer_name}' kemungkinan "
            "tidak terhubung secara differentiable ke output."
        )

    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
    conv_outputs = conv_outputs[0]
    heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)
    heatmap = tf.maximum(heatmap, 0) / (tf.math.reduce_max(heatmap) + 1e-8)
    return heatmap.numpy()


def overlay_heatmap(heatmap, original_image_bytes: bytes, img_size: int = 224, alpha: float = 0.6):
    original = Image.open(io.BytesIO(original_image_bytes)).convert("RGB").resize((img_size, img_size))
    original_np = np.array(original)

    heatmap_resized = cv2.resize(heatmap, (img_size, img_size), interpolation=cv2.INTER_CUBIC)
    heatmap_uint8 = np.uint8(255 * heatmap_resized)
    heatmap_color = cv2.applyColorMap(heatmap_uint8, cv2.COLORMAP_JET)
    heatmap_color_rgb = cv2.cvtColor(heatmap_color, cv2.COLOR_BGR2RGB)

    overlaid = cv2.addWeighted(original_np, 1 - alpha, heatmap_color_rgb, alpha, 0)
    return Image.fromarray(overlaid)