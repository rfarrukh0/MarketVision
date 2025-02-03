// pages/index.js
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

// cards
const FieldCard = ({ title, value }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
  };

  return (
    <div className="relative border p-4 rounded-xl shadow-md bg-white">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation(); // prevent click from propagating
          copyToClipboard();
        }}
        className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 text-gray-700 hover:text-gray-900"
        title="Copy to clipboard"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8h2a2 2 0 012 2v8a2 2 0 01-2 2h-2" />
        </svg>
      </button>
      <h3 className="text-sm font-bold text-black mb-1">{title}</h3>
      <p className="text-sm text-gray-800">{value}</p>
    </div>
  );
};

export default function Home() {
  // variables to manage input fields, image preview etc
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [preview, setPreview] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // dismiss error after 5s
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // validate filetype
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (file && !allowedTypes.includes(file.type)) {
      setError("Invalid file type. Please upload PNG, JPG, or GIF.");
      return;
    }
    setSelectedFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // clear uploaded image
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  // send file to backend
  const handleAnalyzeFile = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);
    setResults(null);

    // prepare form data
    const formData = new FormData();
    formData.append('image', selectedFile);
    try {
      const res = await fetch('http://localhost:8080/generate', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        throw new Error('Failed to fetch marketing suggestions');
      }
      const data = await res.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // send URL to backend
  const handleUrlSubmit = async () => {
    if (!imageUrl) return;
    setLoading(true);
    setError(null);
    setResults(null);
    
    // prepare formdata
    const formData = new FormData();
    formData.append("url", imageUrl);
    try {
      const res = await fetch('http://localhost:8080/generate', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        throw new Error('Failed to fetch marketing suggestions');
      }
      const data = await res.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // checks whether to analyze url or image
  const handleAnalyze = async () => {
    setError(null);
    // if both error
    if (selectedFile && imageUrl) {
      setError("Please provide only one input: either upload an image or enter an image URL, not both.");
      return;
    }
    if (selectedFile) {
      await handleAnalyzeFile();
    } else if (imageUrl) {
      await handleUrlSubmit();
    } else {
      setError("Please upload an image or enter an image URL.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 pb-32">
        {/* header section */}
        <div className="text-center max-w-xl mb-8">
          <h1 className="text-4xl font-bold text-gray-900 leading-snug">
            Discover Hidden Insights
          </h1>
          <p className="mt-3 text-base text-gray-600">
            Upload an image to generate a complete product profile.<br />
            Experience clarity and speed.
          </p>
        </div>

        {/* drag and drop section */}
        <div className="mt-4 w-full max-w-xs">
          <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 w-100 h-64 mx-auto">
            <div className="absolute top-2 left-2">
              <span className="text-gray-600 font-semibold text-sm">Upload Image</span>
            </div>
            {preview && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}
                className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 text-gray-700 hover:text-gray-900"
                title="Remove image"
              >
                &times;
              </button>
            )}
            <div className="flex flex-col items-center justify-center h-full">
              {preview ? (
                <img src={preview} alt="Preview" className="max-h-full max-w-full object-contain" />
              ) : (
                <>
                  <p className="text-gray-500 text-sm text-center">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
                </>
              )}
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>

        {/* seperator */}
        <div className="mt-8 flex items-center justify-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.59 8.59a2 2 0 00-2.83 0L7 12.34a2 2 0 000 2.83l3.76 3.76a2 2 0 002.83 0l3.76-3.76a2 2 0 000-2.83l-3.76-3.76z" />
          </svg>
          <p className="text-gray-500 text-sm">Or enter image URL</p>
        </div>

        {/* url input section*/}
        <div className="mt-4 w-full max-w-xs">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-black"
          />
        </div>

        {/* url preview */}
        {imageUrl && (
          <div className="mt-4 w-full max-w-xs">
            <img src={imageUrl} alt="URL Preview" className="w-full h-auto rounded shadow" />
          </div>
        )}

        {/* analyze button */}
        <button
          onClick={handleAnalyze}
          className={`mt-6 w-full max-w-xs bg-blue-600 text-white py-2 rounded font-semibold transition-colors ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Analyzing...
            </span>
          ) : (
            'Analyze Image'
          )}
        </button>

        {/* results and grid */}
        {results && (
          <>
            <div className="mt-8 w-full max-w-4xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis Result</h2>
              <p className="text-gray-600">Here are the insights from your content:</p>
            </div>
            <div className="mt-4 mx-auto w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4">
              <FieldCard title="Product Name" value={results.product_name} />
              <FieldCard title="Description" value={results.description} />
              <FieldCard
                title="SEO Keywords"
                value={
                  Array.isArray(results.seo_keywords)
                    ? results.seo_keywords.join(", ")
                    : results.seo_keywords
                }
              />
              <FieldCard
                title="Marketing Bullets"
                value={
                  Array.isArray(results.marketing_bullets)
                    ? results.marketing_bullets.join(", ")
                    : results.marketing_bullets
                }
              />
              <FieldCard
                title="Hashtags"
                value={
                  Array.isArray(results.hashtags)
                    ? results.hashtags.join(", ")
                    : results.hashtags
                }
              />
              <FieldCard
                title="Target Audience"
                value={
                  Array.isArray(results.target_audience)
                    ? results.target_audience.join(", ")
                    : results.target_audience
                }
              />
              <FieldCard
                title="Use Cases"
                value={
                  Array.isArray(results.use_cases)
                    ? results.use_cases.join(", ")
                    : results.use_cases
                }
              />
              <FieldCard title="Call To Action" value={results.call_to_action} />
              <FieldCard title="Price Estimate" value={results.price_estimate} />
            </div>
          </>
        )}
      </div>

      {/* footer */}
      <footer className="mt-8 text-center text-gray-500 text-xs w-full max-w-4xl mx-auto">
        <p className="font-semibold">MarketVision</p>
        <p>This Product is a basic prototype. Features may change, and some may not work as expected.</p>
        <p>© 2025 MarketVision. All rights reserved.</p>
      </footer>

      {/* error notification*/}
      {error && (
        <div className="fixed bottom-4 left-4 bg-red-600 text-white p-4 rounded shadow-lg transition transform duration-300">
          {error}
        </div>
      )}
    </>
  );
}
