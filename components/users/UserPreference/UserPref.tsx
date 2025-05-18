"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/AuthStore";
import { fetchMe } from "@/lib/api/auth";

const steps = [
  {
    key: "learningTopics",
    question: "What do you want to learn about?",
    options: [
      "Web development", "Data science",
      "Computer science", "Web design",
      "Artificial intelligence", "Machine learning",
      "Game development", "Mobile development",
      "Data visualization", "Cloud computing",
      "Cybersecurity", "Not sure yet"
    ]
  },
];

export default function UserPreferenceForm({
  initialPreference,
  onSuccess,
}: {
  initialPreference?: string;
  onSuccess?: () => Promise<void>; // <-- Promise sekarang
}) {
  const ModelUrl = process.env.NEXT_PUBLIC_API_URL!;
  const token = useAuthStore((state) => state.token);
  const setAuth = useAuthStore((state) => state.setAuth); // ✅ ambil setAuth dari zustand
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [preferences, setPreferences] = useState<{ [key: string]: string | null }>({
    learningTopics: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialPreference) {
      setPreferences({ learningTopics: initialPreference });
    }
  }, [initialPreference]);

  const handleSelect = (option: string) => {
    setPreferences({ learningTopics: option });
    if (step < steps.length - 1) {
      setTimeout(() => setStep(step + 1), 300);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!token) {
      router.push("/register");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const method = initialPreference ? "PUT" : "POST";

      const response = await fetch(`${ModelUrl}/user_pref`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category_preference: preferences["learningTopics"],
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Gagal menyimpan preferensi");
      }

      // ✅ Ambil ulang data user
      const updatedUser = await fetchMe(token);
      setAuth(token, updatedUser); // ✅ update store biar sinkron

      if (onSuccess) {
        onSuccess();
      }

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 w-full rounded-lg shadow-lg border">
      <div className="text-center font-bold text-2xl pt-2">
        <h1>User Preference</h1>
      </div>

      <div className="flex space-x-2 mb-4">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`w-6 h-6 flex items-center justify-center rounded-full border ${
              index === step ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
          >
            {index + 1}
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold mb-4">{steps[step].question}</h2>

      <div className="grid grid-cols-2 gap-3">
        {steps[step].options.map((option) => (
          <button
            key={option}
            onClick={() => handleSelect(option)}
            className={`border px-4 py-2 rounded-md transition ${
              preferences[steps[step].key] === option
                ? "bg-gray-600 text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="flex justify-between mt-4">
        {step > 0 && (
          <button onClick={handleBack} className="hover:text-slate-500">
            Back
          </button>
        )}
        {step === steps.length - 1 && (
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 border rounded-md ${loading ? "bg-gray-400" : "bg-green-500"} text-white`}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        )}
      </div>

      {error && (
        <div className="text-red-500 text-center mt-4">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
