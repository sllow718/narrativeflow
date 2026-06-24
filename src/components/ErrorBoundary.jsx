import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'DM Sans', sans-serif",
            background: "#f8f7f5",
            padding: 32,
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
              <path d="M3 14 L9 4 L15 14" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5.5 10 H12.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "#111", marginBottom: 8 }}>
            Something went wrong
          </h1>
          <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 24 }}>
            Please refresh the page to try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              border: "none",
              borderRadius: 10,
              padding: "12px 24px",
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Refresh
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
