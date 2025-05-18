// pages/my-prompts.js
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function MyPrompts() {
  const [prompts, setPrompts] = useState([]);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetchPrompts = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to view your prompts.");
        return;
      }

      try {
        const res = await fetch("/api/prompts/get", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to load prompts.");
        } else {
          setPrompts(data.prompts);
        }
      } catch (err) {
        setError("Something went wrong.");
      }
    };

    fetchPrompts();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Prompts</h1>

        {error && (
          <div className="text-red-600 font-semibold mb-4">{error}</div>
        )}

        {prompts.length === 0 && !error && (
          <p className="text-gray-600">You haven't saved any prompts yet.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {prompts.map((entry, index) => (
            <div key={entry._id} className="bg-white shadow rounded-xl overflow-hidden">
              {entry.prompt_result.image && (
                <img
                  src={entry.prompt_result.image}
                  alt="Prompt Visual"
                  className="w-full h-52 object-cover"
                />
              )}
              <div className="p-4">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setExpanded(expanded === index ? null : index)}
                >
                  <h2 className="text-lg font-bold text-gray-900">
                    {entry.prompt_result.product_name || "Untitled Product"}
                  </h2>
                  <span
                    className="text-xl text-black transform transition-transform duration-200"
                    style={{ transform: expanded === index ? "rotate(180deg)" : "rotate(0deg)" }}
                  >
                    ▼
                  </span>
                </div>

                {expanded === index && (
                  <div className="mt-4 text-sm text-gray-800 space-y-2">
                    <p>{entry.prompt_result.description}</p>

                    <div>
                      <strong>SEO Keywords:</strong>
                      <p className="text-gray-600">
                        {Array.isArray(entry.prompt_result.seo_keywords)
                          ? entry.prompt_result.seo_keywords.join(", ")
                          : entry.prompt_result.seo_keywords}
                      </p>
                    </div>

                    <div>
                      <strong>Marketing Bullets:</strong>
                      <ul className="list-disc list-inside text-gray-600">
                        {entry.prompt_result.marketing_bullets?.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <strong>Hashtags:</strong>
                      <p className="text-gray-600">
                        {entry.prompt_result.hashtags?.join(" ")}
                      </p>
                    </div>

                    <div>
                      <strong>Target Audience:</strong>
                      <p className="text-gray-600">
                        {entry.prompt_result.target_audience?.join(", ")}
                      </p>
                    </div>

                    <div>
                      <strong>Use Cases:</strong>
                      <ul className="list-disc list-inside text-gray-600">
                        {entry.prompt_result.use_cases?.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <strong>Call to Action:</strong>
                      <p className="text-gray-600">
                        {entry.prompt_result.call_to_action}
                      </p>
                    </div>

                    <div>
                      <strong>Price Estimate:</strong>
                      <p className="text-gray-600">
                        {entry.prompt_result.price_estimate}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
