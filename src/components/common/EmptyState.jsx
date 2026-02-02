import { Link } from "react-router-dom";

export default function EmptyState({ 
    title = "No Data Available", 
    message = "There's nothing to show here yet.", 
    actionText = null, 
    actionLink = null,
    icon = "fas fa-inbox"
}) {
    return (
        <div className="text-center py-5">
            <div className="mb-4">
                <i className={`${icon} fa-4x text-muted`}></i>
            </div>
            <h4 className="text-muted mb-3">{title}</h4>
            <p className="text-muted mb-4">{message}</p>
            {actionText && actionLink && (
                <Link to={actionLink} className="btn btn-primary">
                    {actionText}
                </Link>
            )}
        </div>
    );
}