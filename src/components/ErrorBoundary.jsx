// components/ui/ErrorBoundary.jsx
import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-lg border border-red-300 bg-red-50 p-6 text-red-900">
          <h2 className="mb-2 text-lg font-semibold">
            Something went wrong
          </h2>

          <p className="mb-4 text-sm">
            This page crashed, but the rest of the app is still running.
          </p>

          {this.state.error && (
            <pre className="mb-4 overflow-auto rounded bg-white p-3 text-xs">
              {this.state.error.message}
            </pre>
          )}

          <button
            onClick={this.handleReset}
            className="rounded bg-red-700 px-4 py-2 text-sm text-white hover:bg-red-800"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}