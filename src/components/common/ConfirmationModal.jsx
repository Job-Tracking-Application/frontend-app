import React from "react";

const ConfirmationModal = ({
    show,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = "Confirm",
    cancelText = "Cancel",
    confirmVariant = "danger",
    loading = false
}) => {
    if (!show) return null;

    return (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow">
                    <div className={`modal-header bg-${confirmVariant} text-white border-0`}>
                        <h5 className="modal-title">{title}</h5>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            onClick={onCancel}
                            disabled={loading}
                        />
                    </div>
                    <div className="modal-body">
                        <p className="mb-0">{message}</p>
                    </div>
                    <div className="modal-footer border-top">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            {cancelText}
                        </button>
                        <button
                            type="button"
                            className={`btn btn-${confirmVariant}`}
                            onClick={onConfirm}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Loading...
                                </>
                            ) : (
                                confirmText
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
