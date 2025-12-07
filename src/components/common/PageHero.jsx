import React from "react";

export default function PageHero({ title, subtitle, children }) {
    return (
        <div className="bg-primary text-white py-5 mb-5 shadow-sm" style={{ background: "linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)" }}>
            <div className="container text-center">
                <h1 className="display-4 fw-bold mb-3">{title}</h1>
                {subtitle && <p className="lead opacity-75 mb-4">{subtitle}</p>}
                {children && <div className="mt-4">{children}</div>}
            </div>
        </div>
    );
}
