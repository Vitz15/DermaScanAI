export interface PredictionDetail {
  class: string;
  class_label_readable: string;
  confidence: number;
  all_probabilities: Record<string, number>;
}

export interface PredictResponse {
  prediction: PredictionDetail;
  gradcam_heatmap: string;
  llm_explanation: string;
  disclaimer: string;
  processing_time_ms: number;
}

export interface ApiError {
  error: string;
  message: string;
}

export function getRiskTier(className: string): {
  tone: "teal" | "coral";
  label: string;
} {
  return HIGH_RISK_CLASSES.has(className)
    ? { tone: "coral", label: "Waspada Tinggi" }
    : { tone: "teal", label: "Risiko Lebih Rendah" };
}

export const HIGH_RISK_CLASSES = new Set(["mel", "bcc", "akiec"]);
