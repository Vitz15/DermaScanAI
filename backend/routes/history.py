from fastapi import APIRouter, Depends, HTTPException
from db.models import User
from routes.deps import get_current_user
from sqlalchemy.orm import Session
from sqlalchemy import desc
from db.session import get_db
from db.models import AnalysisHistory
from schemas.response_models import (
    HistoryListResponse,
    HistoryItemSummary,
    HistoryItemDetail,
)

router = APIRouter()


@router.get("/api/history", response_model=HistoryListResponse)
def list_history(limit: int = 20, offset: int = 0, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(AnalysisHistory).filter(AnalysisHistory.user_id == current_user.id).order_by(desc(AnalysisHistory.created_at))
    total = query.count()
    items = query.offset(offset).limit(limit).all()

    return HistoryListResponse(
        items=[
            HistoryItemSummary(
                id=item.id,
                predicted_class=item.predicted_class,
                class_label_readable=item.class_label_readable,
                confidence=item.confidence,
                created_at=item.created_at,
            )
            for item in items
        ],
        total=total,
    )


@router.get("/api/history/{history_id}", response_model=HistoryItemDetail)
def get_history_detail(
    history_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = (
        db.query(AnalysisHistory)
        .filter(
            AnalysisHistory.id == history_id,
            AnalysisHistory.user_id == current_user.id,
        )
        .first()
    )
    if not item:
        raise HTTPException(
            status_code=404,
            detail={"error": "not_found", "message": "History item not found."},
        )

    return HistoryItemDetail(
        id=item.id,
        predicted_class=item.predicted_class,
        class_label_readable=item.class_label_readable,
        confidence=item.confidence,
        created_at=item.created_at,
        all_probabilities=item.all_probabilities,
        original_image=item.original_image,
        gradcam_heatmap=item.gradcam_heatmap,
        llm_explanation=item.llm_explanation,
        processing_time_ms=item.processing_time_ms,
    )


@router.delete("/api/history/{history_id}")
def delete_history_item(
    history_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = (
        db.query(AnalysisHistory)
        .filter(
            AnalysisHistory.id == history_id,
            AnalysisHistory.user_id == current_user.id,
        )
        .first()
    )
    if not item:
        raise HTTPException(
            status_code=404,
            detail={"error": "not_found", "message": "History item not found."},
        )
    db.delete(item)
    db.commit()
    return {"status": "deleted", "id": history_id}