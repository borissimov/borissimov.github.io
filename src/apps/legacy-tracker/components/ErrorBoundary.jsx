import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("Uncaught Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-white bg-black h-screen flex flex-col items-center justify-center text-center">
          <h1 className="text-xl font-bold text-red-500 mb-4">Something went wrong.</h1>
          <pre className="text-xs bg-[#111] p-4 rounded text-left overflow-auto max-w-full">
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-4 py-2 bg-[#333] rounded text-white font-bold"
          >
            Reload App
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
