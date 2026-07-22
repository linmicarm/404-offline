import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "3rem 2.5rem", maxWidth: "600px", margin: "4rem auto", textAlign: "center" }}>
          <div style={{ fontFamily: "'Dela Gothic One', sans-serif", fontSize: "64px", color: "#FFAA7F", lineHeight: 1, marginBottom: "1rem" }}>
            500
          </div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", color: "#B89880", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "1.5rem" }}>
            Something went wrong
          </div>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "16px", color: "#7A5C48", lineHeight: 1.7, marginBottom: "2rem" }}>
            A component crashed. This has been logged. Try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{ fontFamily: "'Space Mono', monospace", fontSize: "12px", fontWeight: "700", background: "#FFAA7F", color: "#6B3218", border: "none", padding: "12px 24px", borderRadius: "100px", cursor: "pointer" }}
          >
            Refresh page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}