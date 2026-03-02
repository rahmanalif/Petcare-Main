"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function VerifyIdentityDocumentsPage() {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const [governmentIdFile, setGovernmentIdFile] = useState(null);
  const [selectedGovIdType, setSelectedGovIdType] = useState("");
  const [showGovIdOptions, setShowGovIdOptions] = useState(false);
  const [selfieFile, setSelfieFile] = useState(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [capturedSelfie, setCapturedSelfie] = useState("");
  const [cameraError, setCameraError] = useState("");
  const [cameraStream, setCameraStream] = useState(null);
  const [submittingVerification, setSubmittingVerification] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [statusError, setStatusError] = useState("");
  const [verificationStatusData, setVerificationStatusData] = useState(null);
  const [statusResolved, setStatusResolved] = useState(false);
  const pollingIntervalRef = useRef(null);
  const govIdInputRef = useRef(null);
  const selfieInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const canSubmitIdentity = Boolean(governmentIdFile && selfieFile);

  const getAuthToken = () => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("token") || "";
  };

  const mapDocumentType = (type) => {
    if (type === "Passport") return "passport";
    return "id_card";
  };

  const hasPendingStatus = (data) => {
    if (!data) return true;
    const normalizedStatus = String(data.status || "").toLowerCase();
    const isCompleted =
      normalizedStatus === "complete" || normalizedStatus === "completed";
    return !isCompleted;
  };

  const parseJsonSafe = (rawText, fallbackMessage) => {
    try {
      return rawText ? JSON.parse(rawText) : {};
    } catch {
      throw new Error(fallbackMessage);
    }
  };

  const clearPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  const fetchVerificationStatus = async () => {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Authentication token not found. Please login again.");
    }

    const userId = user?.id || user?._id;
    if (!userId) {
      throw new Error("User not found. Please login again.");
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/verification/${userId}/status`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const rawText = await res.text();
    const data = parseJsonSafe(rawText, "Status API returned non-JSON response.");
    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch verification status");
    }

    setVerificationStatusData(data);
    const stillPending = hasPendingStatus(data);
    if (!stillPending) {
      setStatusResolved(true);
      clearPolling();
    }
    return data;
  };

  const startStatusPolling = () => {
    clearPolling();
    pollingIntervalRef.current = setInterval(async () => {
      try {
        await fetchVerificationStatus();
      } catch (error) {
        setStatusError(error.message || "Failed to fetch verification status");
      }
    }, 10000);
  };

  const handleIdentitySubmit = async () => {
    if (!canSubmitIdentity) return;
    if (!selectedGovIdType) {
      setSubmitError("Please select your government ID type.");
      return;
    }

    const userId = user?.id || user?._id;
    if (!userId) {
      setSubmitError("User not found. Please login again.");
      return;
    }

    const token = getAuthToken();
    if (!token) {
      setSubmitError("Authentication token not found. Please login again.");
      return;
    }

    try {
      setSubmittingVerification(true);
      setSubmitError("");

      const formData = new FormData();
      formData.append("documentType", mapDocumentType(selectedGovIdType));
      formData.append("documentFrontImage", governmentIdFile);
      formData.append("selfieImage", selfieFile);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/verification/${userId}/submit`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const rawText = await res.text();
      const data = parseJsonSafe(rawText, "Submit API returned non-JSON response.");
      if (!res.ok) {
        throw new Error(data.message || "Failed to submit verification");
      }

      setShowVerificationModal(true);
      setStatusError("");
      setStatusResolved(false);
      startStatusPolling();
      try {
        await fetchVerificationStatus();
      } catch (error) {
        setStatusError(error.message || "Failed to fetch verification status");
      }
    } catch (error) {
      setSubmitError(error.message || "Failed to submit verification");
    } finally {
      setSubmittingVerification(false);
    }
  };

  const govIdTypes = ["Driver's License", "National ID Card", "Passport"];

  const handleGovIdTypeSelect = (type) => {
    setSelectedGovIdType(type);
    setShowGovIdOptions(false);
    govIdInputRef.current?.click();
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  const openSelfieCamera = async () => {
    try {
      setCameraError("");
      setCapturedSelfie("");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      setCameraStream(stream);
      setCameraOpen(true);
    } catch (error) {
      setCameraError("Camera access denied or unavailable.");
    }
  };

  const closeSelfieCamera = () => {
    stopCamera();
    setCameraOpen(false);
  };

  const captureSelfie = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    setCapturedSelfie(canvas.toDataURL("image/jpeg", 0.9));
  };

  const useCapturedSelfie = () => {
    if (!canvasRef.current || !capturedSelfie) return;
    canvasRef.current.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `selfie-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        setSelfieFile(file);
        closeSelfieCamera();
      },
      "image/jpeg",
      0.92
    );
  };

  useEffect(() => {
    if (cameraOpen && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch(() => {});
    }
  }, [cameraOpen, cameraStream, capturedSelfie]);

  useEffect(() => {
    return () => {
      stopCamera();
      clearPolling();
    };
  }, [cameraStream]);

  useEffect(() => {
    if (!statusResolved) return;
    const timer = setTimeout(() => {
      clearPolling();
      setShowVerificationModal(false);
      router.push("/sitterdashboard");
    }, 1200);
    return () => clearTimeout(timer);
  }, [statusResolved, router]);

  return (
    <div className="min-h-screen flex">
      <section className="w-full lg:w-1/2 p-4 sm:p-6 lg:p-10 bg-[#03586A] text-white">
        <div className="mx-auto w-full max-w-md">
          <div className="bg-transparent text-white rounded-b-[2rem] px-5 py-5 flex items-center gap-3 -mx-4 sm:-mx-6 lg:-mx-10">
            <Link
              href="/verify-identity"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              aria-label="Back"
            >
              <ArrowLeft size={22} />
            </Link>
            <h1 className="text-3xl font-semibold">Verify identity</h1>
          </div>

          <div className="pt-6 space-y-6">
            <article className="rounded-3xl border-2 border-white/35 bg-white/10 px-6 py-8 text-center">
              <h2 className="text-[2rem] font-medium text-white">Government ID</h2>
              <p className="mt-3 text-[1.5rem] leading-snug text-white/85">
                Take a driver's license, national identity card or passport photo
              </p>
              <input
                ref={govIdInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setGovernmentIdFile(e.target.files?.[0] || null)}
              />
              <button
                type="button"
                onClick={() => setShowGovIdOptions((prev) => !prev)}
                className="mx-auto mt-6 inline-flex items-center gap-4 text-white"
              >
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
                  <Plus size={28} />
                </span>
                <span className="text-[2rem] font-medium">Select</span>
              </button>
              {showGovIdOptions && (
                <div className="mt-5 overflow-hidden rounded-2xl border border-white/25 bg-white/10 text-left">
                  {govIdTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleGovIdTypeSelect(type)}
                      className={`w-full px-4 py-3 text-base transition-colors ${
                        selectedGovIdType === type
                          ? "bg-white/25 text-white"
                          : "text-white/90 hover:bg-white/15"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
              {selectedGovIdType && (
                <p className="mt-3 text-sm text-white/90">
                  Selected ID Type: {selectedGovIdType}
                </p>
              )}
              {governmentIdFile && (
                <p className="mt-2 text-sm text-white/90">{governmentIdFile.name}</p>
              )}
            </article>

            <article className="rounded-3xl border border-white/35 bg-white/10 px-6 py-8 text-center">
              <h2 className="text-[2rem] font-medium text-white">Selfie photo</h2>
              <p className="mt-3 text-[1.5rem] leading-snug text-white/85">
                It's required by law to verify your identity as a new user
              </p>
              <input
                ref={selfieInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setSelfieFile(e.target.files?.[0] || null)}
              />
              <button
                type="button"
                onClick={openSelfieCamera}
                className="mx-auto mt-6 inline-flex items-center gap-4 text-white"
              >
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
                  <Plus size={28} />
                </span>
                <span className="text-[2rem] font-medium">Select</span>
              </button>
              <button
                type="button"
                onClick={() => selfieInputRef.current?.click()}
                className="mx-auto mt-3 block text-sm text-white/80 underline hover:text-white"
              >
                Upload from device
              </button>
              {selfieFile && (
                <p className="mt-2 text-sm text-white/90">{selfieFile.name}</p>
              )}
            </article>
          </div>

          <button
            type="button"
            onClick={handleIdentitySubmit}
            disabled={!canSubmitIdentity || submittingVerification}
            className={`mt-6 w-full rounded-xl px-5 py-4 text-center text-[2.4rem] font-medium transition-colors ${
              canSubmitIdentity && !submittingVerification
                ? "bg-[#FE6C5D] text-white hover:bg-[#f1695a]"
                : "bg-[#FE6C5D]/70 text-white/80 cursor-not-allowed"
            }`}
          >
            {submittingVerification ? "Submitting..." : "Verify my identity"}
          </button>
          {submitError && (
            <p className="mt-4 rounded-lg border border-red-300/40 bg-red-500/20 px-3 py-2 text-sm text-red-100">
              {submitError}
            </p>
          )}
        </div>
      </section>

      <section className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-gray-50 to-gray-100 items-center justify-center p-8">
        {cameraOpen ? (
          <div className="w-full max-w-xl rounded-3xl border border-[#d9d9d9] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#0A4F5F] mb-4">Selfie Camera</h2>
            {cameraError ? (
              <p className="text-red-600">{cameraError}</p>
            ) : (
              <>
                <div className="overflow-hidden rounded-2xl bg-black">
                  {!capturedSelfie ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="h-[380px] w-full object-cover"
                    />
                  ) : (
                    <img
                      src={capturedSelfie}
                      alt="Captured selfie"
                      className="h-[380px] w-full object-cover"
                    />
                  )}
                </div>
                <canvas ref={canvasRef} className="hidden" />
                <div className="mt-4 flex gap-3">
                  {!capturedSelfie ? (
                    <button
                      type="button"
                      onClick={captureSelfie}
                      className="rounded-xl bg-[#FE6C5D] px-5 py-3 text-white font-medium hover:bg-[#f1695a]"
                    >
                      Capture Photo
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setCapturedSelfie("")}
                        className="rounded-xl bg-gray-200 px-5 py-3 text-[#0A4F5F] font-medium hover:bg-gray-300"
                      >
                        Retake
                      </button>
                      <button
                        type="button"
                        onClick={useCapturedSelfie}
                        className="rounded-xl bg-[#FE6C5D] px-5 py-3 text-white font-medium hover:bg-[#f1695a]"
                      >
                        Use This Photo
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={closeSelfieCamera}
                    className="rounded-xl border border-gray-300 px-5 py-3 text-[#0A4F5F] font-medium hover:bg-gray-100"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="max-w-lg">
            <img src="/wuffoosFinal.png" alt="Wuffoos logo" />
          </div>
        )}
      </section>

      {showVerificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 text-[#0A4F5F] shadow-xl">
            <h3 className="text-2xl font-semibold">Verification In Progress</h3>
            <p className="mt-2 text-sm text-[#355965]">
              We have sent you an email to continue the verification process.
              Please check your inbox and follow the instructions. We are also
              checking your verification status automatically.
            </p>

            <div className="mt-5 rounded-xl bg-[#F3F6F8] p-4">
              {!statusResolved ? (
                <div className="flex items-center gap-3">
                  <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-[#0A4F5F]/30 border-t-[#0A4F5F]" />
                  <p className="text-sm">Waiting for status update...</p>
                </div>
              ) : (
                <div className="space-y-2 text-sm">
                  <p>Status: {verificationStatusData?.status || "pending"}</p>
                  <p>ZapSign: {verificationStatusData?.zapsignStatus || "pending"}</p>
                  <p>Background check: {verificationStatusData?.backgroundCheck || "pending"}</p>
                  <p>Verified: {verificationStatusData?.isVerified ? "Yes" : "No"}</p>
                  {verificationStatusData?.feedback && (
                    <p className="text-[#456B76]">{verificationStatusData.feedback}</p>
                  )}
                </div>
              )}
            </div>

            {!statusResolved && (
              <p className="mt-3 text-xs text-[#567985]">
                Checking every 10 seconds until pending status changes...
              </p>
            )}

            {statusError && (
              <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {statusError}
              </p>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              {!statusResolved ? (
                <>
                  {verificationStatusData?.signerUrl && (
                    <a
                      href={verificationStatusData.signerUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg bg-[#0C6478] px-4 py-2 text-sm font-medium text-white hover:bg-[#0a5769]"
                    >
                      Open Signer Link
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      clearPolling();
                      setShowVerificationModal(false);
                    }}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-[#0A4F5F] hover:bg-gray-100"
                  >
                    Close
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    clearPolling();
                    setShowVerificationModal(false);
                    router.push("/sitterdashboard");
                  }}
                  className="rounded-lg bg-[#FE6C5D] px-4 py-2 text-sm font-medium text-white hover:bg-[#f1695a]"
                >
                  Continue to Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
