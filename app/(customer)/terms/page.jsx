"use client";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft } from 'lucide-react';
import { fetchTermsAndConditions } from '@/redux/settingSlice'; // path adjust করো

export default function TermsPage() {
  const dispatch = useDispatch();
  const { termsAndConditions, loading } = useSelector((state) => state.setting);

  useEffect(() => {
    dispatch(fetchTermsAndConditions());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#035F751A]">
      <div className="max-w-4xl mx-auto px-6 py-12">

        <div className="relative mb-8">
          <button
            onClick={() => window.history.back()}
            className="absolute left-0 flex items-center justify-center w-12 bg-transparent h-12 rounded-full"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div className="text-5xl font-bold text-center text-gray-900 font-montserrat">Terms</div>
        </div>

        <div className="p-8">
          {loading ? (
            <p className="text-gray-500 text-center">Loading...</p>
          ) : (
            <div
              className="prose max-w-none text-gray-700 font-montserrat leading-relaxed"
              dangerouslySetInnerHTML={{ __html: termsAndConditions?.content || "" }}
            />
          )}
        </div>

      </div>
    </div>
  );
}