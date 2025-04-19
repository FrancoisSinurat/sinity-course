"use client";

import { useState } from "react";

const steps = [
  { key: "learningTopics", question: "What do you want to learn about?", options: [
    "Web development", "Data science",
    "Computer science", "Web design",
    "Artificial intelligence", "Machine learning",
    "Game development", "Mobile development",
    "Data visualization", "Cloud computing",
    "Cybersecurity", "Not sure yet"
  ]},
  { key: "experienceLevel", question: "What is your experience level?", options: [
    "Beginner", "Intermediate", "Advanced"
  ]},
  { key: "goal", question: "What is your main goal?", options: [
    "Career switch", "Skill improvement", "Hobby"
  ]}
];

export default function UserPreferenceForm() {
  const [step, setStep] = useState(0);
  const [preferences, setPreferences] = useState<{ [key: string]: string | null }>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (option: string) => {
    setPreferences((prev) => ({ ...prev, [steps[step].key]: option }));

    // Auto next setelah memilih opsi, kecuali jika di langkah terakhir
    if (step < steps.length - 1) {
      setTimeout(() => setStep(step + 1), 300); // Delay kecil untuk transisi
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <div className="max-w-xl mx-auto p-6 w-full rounded-lg shadow-lg border">
  {/* Hanya tampil jika belum submit */}
  {!submitted && (
    <div id="Preftittle" className="text-center font-bold text-2xl pt-2">
      <h1>User Preference</h1>
    </div>  
  )}

  {!submitted ? (
    <>
      {/* Langkah Navigasi */}
      <div className="flex space-x-2 mb-4">
        {steps.map((_, index) => (
          <div key={index} className={`w-6 h-6 flex items-center justify-center rounded-full border ${
            index === step ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}>
            {index + 1}
          </div>
        ))}
      </div>

      {/* Pertanyaan */}
      <h2 className="text-lg font-semibold mb-4">{steps[step].question}</h2>

      {/* Pilihan */}
      <div className="grid grid-cols-2 gap-3">
        {steps[step].options.map((option) => (
          <button
            key={option}
            onClick={() => handleSelect(option)}
            className={`border px-4 py-2 rounded-md transition ${
              preferences[steps[step].key] === option ? "bg-gray-600 text-white" : "bg-white hover:bg-gray-100"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Tombol Navigasi */}
      <div className="flex justify-between mt-4">
        {step > 0 && (
          <button onClick={handleBack} className="hover:text-slate-500">
            Back
          </button>
        )}
        {step === steps.length - 1 && (
          <button onClick={handleSubmit} className="px-4 py-2 border rounded-md bg-green-500 text-white">
            Submit
          </button>
        )}
      </div>
    </>
  ) : (
    /* Summary setelah Submit */
    <div>
      <h2 className="text-lg font-semibold mb-4">Summary</h2>
      <ul className="list-disc pl-4">
        {steps.map((s) => (
          <li key={s.key}><strong>{s.question}:</strong> {preferences[s.key]}</li>
        ))}
      </ul>
    </div>
  )}
</div>

    // <div className="max-w-xl mx-auto p-6 w-full rounded-lg shadow-lg border">
    //   <div id="Preftittle" className="text-center font-bold text-2xl pt-2">
    //     <h1>
    //   User Preference
    //     </h1>
    //   </div>
    //   {!submitted ? (
    //     <>
    //       {/* Langkah Navigasi */}
    //       <div className="flex space-x-2 mb-4">
    //         {steps.map((_, index) => (
    //           <div key={index} className={`w-6 h-6 flex items-center justify-center rounded-full  border ${
    //             index === step ? "bg-blue-500 text-white" : "bg-gray-300"
    //           }`}>
    //             {index + 1}
    //           </div>
    //         ))}
    //       </div>

    //       {/* Pertanyaan */}
    //       <h2 className="text-lg font-semibold mb-4">{steps[step].question}</h2>

    //       {/* Pilihan */}
    //       <div className="grid grid-cols-2 gap-3 ">
    //         {steps[step].options.map((option) => (
    //           <button
    //             key={option}
    //             onClick={() => handleSelect(option)}
    //             className={`border px-4 py-2 rounded-md transition ${
    //               preferences[steps[step].key] === option ? "bg-gray-600 text-white" : "bg-white hover:bg-gray-100"
    //             }`}
    //           >
    //             {option}
    //           </button>
    //         ))}
    //       </div>

    //       {/* Tombol Navigasi */}
    //       <div className="flex justify-between mt-4">
    //         {step > 0 && (
    //           <button onClick={handleBack} className="px-4 py-2 border rounded-md bg-gray-300">
    //             Back
    //           </button>
    //         )}
    //         {step === steps.length - 1 && (
    //           <button onClick={handleSubmit} className="px-4 py-2 border rounded-md bg-green-500 text-white">
    //             Submit
    //           </button>
    //         )}
    //       </div>
    //     </>
    //   ) : (
    //     /* Summary setelah Submit */
    //     <div>
    //       <h2 className="text-lg font-semibold mb-4">Summary</h2>
    //       <ul className="list-disc pl-4">
    //         {steps.map((s) => (
    //           <li key={s.key}><strong>{s.question}:</strong> {preferences[s.key]}</li>
    //         ))}
    //       </ul>
    //     </div>
    //   )}
    // </div>
  );
}
