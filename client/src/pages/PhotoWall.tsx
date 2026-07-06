import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { SiteFooter, SiteNav } from "./HarvestReviewTest";
import { MEMBERS_PAGE_URL } from "@/lib/links";
import FadeIn from "@/components/FadeIn";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { rootStyle, colors, fonts, formLabelStyle, formInputStyle } from "@/styles/brand";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

export default function PhotoWall() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { user, isAuthenticated } = useAuth();
  const isAdmin = isAuthenticated && user?.role === "admin";
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ideaData, setIdeaData] = useState({ firstName: "", email: "", response: "" });
  const [ideaSubmitting, setIdeaSubmitting] = useState(false);
  const [ideaSubmitted, setIdeaSubmitted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = "Photo Wall | The Harvest";
  }, []);

  const galleryQuery = trpc.photoWall.gallery.useQuery();
  const photos = galleryQuery.data ?? [];

  const photoWallMutation = trpc.photoWall.submit.useMutation();
  const uploadMutation = trpc.photoWall.upload.useMutation();
  const deleteMutation = trpc.photoWall.deletePhoto.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await photoWallMutation.mutateAsync({
        firstName: formData.firstName,
        email: formData.email,
        phone: formData.phone || undefined,
      });

      if (!result.success) {
        throw new Error(result.error || "Something went wrong");
      }

      setSubmitted(true);
    } catch (error) {
      toast.error("Couldn't save your details", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIdeaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIdeaSubmitting(true);
    try {
      const result = await photoWallMutation.mutateAsync({
        firstName: ideaData.firstName,
        email: ideaData.email,
        response: ideaData.response,
      });
      if (!result.success) {
        throw new Error(result.error || "Something went wrong");
      }
      setIdeaSubmitted(true);
    } catch (error) {
      toast.error("That didn't send", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIdeaSubmitting(false);
    }
  };

  const handleUpload = async (files: FileList) => {
    setIsUploading(true);
    let uploaded = 0;

    for (const file of Array.from(files)) {
      try {
        const { base64, contentType } = await resizeImage(file);
        await uploadMutation.mutateAsync({
          base64Data: base64,
          fileName: file.name,
          contentType,
        });
        uploaded++;
      } catch (err) {
        console.error("Upload failed:", file.name, err);
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    if (uploaded > 0) {
      toast.success(`${uploaded} photo${uploaded > 1 ? "s" : ""} uploaded`);
      galleryQuery.refetch();
    }
    setIsUploading(false);
  };

  const handleDelete = async (url: string) => {
    try {
      await deleteMutation.mutateAsync({ url });
      toast.success("Photo deleted");
      galleryQuery.refetch();
    } catch {
      toast.error("Failed to delete photo");
    }
  };

  const handleDownload = async (url: string, fileName: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, "_blank");
    }
  };

  return (
    <div style={rootStyle}>
      <SiteNav />

      {/* ─── HERO ─── */}
      <section style={{
        backgroundColor: colors.shed,
        padding: isMobile ? "110px 28px 48px" : "140px 40px 64px",
        textAlign: "center",
      }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <img
            src="/images/the-harvest-witta-logo.png"
            alt="The Harvest"
            style={{
              width: isMobile ? 100 : 120,
              height: "auto",
              filter: "brightness(0) invert(1)",
              marginBottom: 32,
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          />
          <h1 style={{
            fontFamily: fonts.display,
            fontWeight: 900,
            fontSize: isMobile ? "clamp(28px, 7vw, 40px)" : "clamp(36px, 4vw, 48px)",
            letterSpacing: "0.08em",
            color: colors.milk,
            margin: 0,
          }}>
            PHOTO WALL
          </h1>
          <p style={{
            fontFamily: fonts.body,
            fontSize: isMobile ? 15 : 17,
            color: colors.milk,
            opacity: 0.6,
            margin: "12px auto 0",
            maxWidth: 420,
            lineHeight: 1.6,
          }}>
            {photos.length > 0
              ? "Photos from days at The Harvest. Browse, download, and add your own from a visit."
              : "Photos from days at The Harvest will land here. Got some from a visit? Add them below."}
          </p>
        </motion.div>
      </section>

      {/* ─── ADMIN: UPLOAD + MANAGE ─── */}
      {isAdmin && (
        <section style={{
          backgroundColor: colors.shed,
          padding: isMobile ? "0 28px 40px" : "0 40px 48px",
          textAlign: "center",
        }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={(e) => e.target.files && handleUpload(e.target.files)}
          />
          <div style={{
            maxWidth: 480,
            margin: "0 auto",
            border: `1px dashed rgba(245,240,232,0.2)`,
            padding: isMobile ? "28px 20px" : "36px 32px",
            cursor: isUploading ? "not-allowed" : "pointer",
            opacity: isUploading ? 0.6 : 1,
          }}
            onClick={() => !isUploading && fileInputRef.current?.click()}
          >
            <p style={{
              fontFamily: fonts.display,
              fontWeight: 900,
              fontSize: isMobile ? 16 : 18,
              letterSpacing: "0.08em",
              color: colors.milk,
              margin: "0 0 8px",
            }}>
              {isUploading ? "UPLOADING..." : "UPLOAD PHOTOS"}
            </p>
            <p style={{
              fontFamily: fonts.body,
              fontSize: isMobile ? 13 : 14,
              color: colors.milk,
              opacity: 0.5,
              margin: 0,
              lineHeight: 1.5,
            }}>
              Tap to select photos to add to the gallery.
            </p>
          </div>
          <p style={{
            fontFamily: fonts.body,
            fontSize: 11,
            color: colors.goldenHour,
            opacity: 0.5,
            marginTop: 12,
          }}>
            Admin mode active
          </p>
        </section>
      )}

      {/* ─── GALLERY GRID ─── */}
      {photos.length > 0 ? (
        <section style={{
          backgroundColor: colors.shed,
          padding: isMobile ? "0 16px 48px" : "0 40px 64px",
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fill, minmax(240px, 1fr))",
            gap: isMobile ? 8 : 16,
            maxWidth: 1200,
            margin: "0 auto",
          }}>
            {photos.map((photo, i) => (
              <FadeIn key={photo.url} delay={i * 0.05}>
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <img
                    src={photo.url}
                    alt={photo.fileName}
                    loading="lazy"
                    style={{
                      width: "100%",
                      aspectRatio: "1",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  <div style={{ position: "absolute", bottom: 8, right: 8, display: "flex", gap: 4 }}>
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(photo.url)}
                        style={{
                          backgroundColor: "rgba(0,0,0,0.6)",
                          color: "#ff6b6b",
                          border: "none",
                          padding: "6px 10px",
                          fontFamily: fonts.display,
                          fontSize: 10,
                          letterSpacing: "0.1em",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        DELETE
                      </button>
                    )}
                    <button
                      onClick={() => handleDownload(photo.url, photo.fileName)}
                      style={{
                        backgroundColor: "rgba(0,0,0,0.6)",
                        color: colors.milk,
                        border: "none",
                        padding: "6px 12px",
                        fontFamily: fonts.display,
                        fontSize: 10,
                        letterSpacing: "0.1em",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      DOWNLOAD
                    </button>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>
      ) : (
        <section style={{
          backgroundColor: colors.shed,
          padding: isMobile ? "20px 28px 40px" : "20px 40px 60px",
          textAlign: "center",
        }}>
          <p style={{
            fontFamily: fonts.body,
            fontSize: 15,
            color: colors.milk,
            opacity: 0.6,
            maxWidth: 520,
            margin: "0 auto",
            lineHeight: 1.7,
          }}>
            No photos on the wall yet. Come make the first ones: we're open most
            weekends for DIY pizza, Friday 3pm to 8pm with a community movie
            night, Saturday 12pm to 8pm, Sunday 12pm to 6pm. Weeks can vary, and
            dates land on the{" "}
            <a
              href={MEMBERS_PAGE_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: colors.goldenHour, textDecoration: "underline", textUnderlineOffset: 3 }}
            >
              members page
            </a>{" "}
            first.
          </p>
        </section>
      )}

      {/* ─── PUBLIC UPLOAD ─── */}
      <section style={{
        backgroundColor: colors.shed,
        padding: isMobile ? "0 28px 48px" : "0 40px 64px",
        textAlign: "center",
      }}>
        <input
          ref={!isAdmin ? fileInputRef : undefined}
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          id="public-upload"
          onChange={(e) => e.target.files && handleUpload(e.target.files)}
        />
        <div style={{
          maxWidth: 480,
          margin: "0 auto",
          borderTop: `1px solid rgba(245,240,232,0.1)`,
          paddingTop: 40,
        }}>
          <div
            style={{
              border: `1px dashed rgba(245,240,232,0.2)`,
              padding: isMobile ? "28px 20px" : "36px 32px",
              cursor: isUploading ? "not-allowed" : "pointer",
              opacity: isUploading ? 0.6 : 1,
            }}
            onClick={() => {
              if (!isUploading) {
                const input = document.getElementById("public-upload") as HTMLInputElement;
                input?.click();
              }
            }}
          >
            <p style={{
              fontFamily: fonts.display,
              fontWeight: 900,
              fontSize: isMobile ? 16 : 18,
              letterSpacing: "0.08em",
              color: colors.milk,
              margin: "0 0 8px",
            }}>
              {isUploading ? "UPLOADING..." : "SHARE YOUR PHOTOS"}
            </p>
            <p style={{
              fontFamily: fonts.body,
              fontSize: isMobile ? 13 : 14,
              color: colors.milk,
              opacity: 0.5,
              margin: 0,
              lineHeight: 1.5,
            }}>
              Got photos from a visit to The Harvest? Tap to add them to the wall.
            </p>
          </div>
          <p style={{
            fontFamily: fonts.body,
            fontSize: 12,
            color: colors.milk,
            opacity: 0.45,
            margin: "16px 0 0",
            lineHeight: 1.6,
          }}>
            Only share photos you took, and check the people in them are happy to
            be on the wall. Spot a photo of you that you'd like taken down?{" "}
            <a
              href="/contact"
              style={{ color: colors.goldenHour, textDecoration: "underline", textUnderlineOffset: 3 }}
            >
              Tell us
            </a>{" "}
            and we will.
          </p>
        </div>
      </section>

      {/* ─── IDEA CAPTURE ─── */}
      <section style={{
        backgroundColor: colors.shed,
        padding: isMobile ? "0 28px 48px" : "0 40px 64px",
      }}>
        <div style={{
          maxWidth: 480,
          margin: "0 auto",
          borderTop: `1px solid rgba(245,240,232,0.1)`,
          paddingTop: 40,
        }}>
          <h2 style={{
            fontFamily: fonts.display,
            fontWeight: 900,
            fontSize: isMobile ? 18 : 22,
            letterSpacing: "0.08em",
            color: colors.goldenHour,
            textAlign: "center",
            margin: "0 0 8px",
          }}>
            WHAT WOULD YOU LOVE TO SEE GROW HERE?
          </h2>
          <p style={{
            fontFamily: fonts.body,
            fontSize: isMobile ? 14 : 15,
            color: colors.milk,
            opacity: 0.5,
            textAlign: "center",
            margin: "0 0 28px",
            lineHeight: 1.6,
          }}>
            Leave a thought and your email. A human reads every one.
          </p>

          {ideaSubmitted ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ textAlign: "center", padding: "10px 0" }}
            >
              <p style={{
                fontFamily: fonts.body,
                fontSize: isMobile ? 16 : 18,
                color: colors.milk,
                opacity: 0.7,
                lineHeight: 1.6,
                margin: 0,
              }}>
                Got it. A human reads every one, and if you left your email we
                can get back to you.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleIdeaSubmit}>
              <div style={{ marginBottom: 20 }}>
                <label style={formLabelStyle} htmlFor="idea-response">YOUR THOUGHT</label>
                <textarea
                  id="idea-response"
                  placeholder="A thought, a dream, a single word..."
                  value={ideaData.response}
                  onChange={(e) => setIdeaData((prev) => ({ ...prev, response: e.target.value }))}
                  required
                  rows={3}
                  style={{
                    ...formInputStyle,
                    resize: "vertical",
                    minHeight: 80,
                  }}
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={formLabelStyle} htmlFor="idea-name">YOUR NAME</label>
                <input
                  id="idea-name"
                  type="text"
                  placeholder="First name"
                  value={ideaData.firstName}
                  onChange={(e) => setIdeaData((prev) => ({ ...prev, firstName: e.target.value }))}
                  required
                  style={formInputStyle}
                />
              </div>
              <div style={{ marginBottom: 28 }}>
                <label style={formLabelStyle} htmlFor="idea-email">EMAIL</label>
                <input
                  id="idea-email"
                  type="email"
                  placeholder="So we can reply"
                  value={ideaData.email}
                  onChange={(e) => setIdeaData((prev) => ({ ...prev, email: e.target.value }))}
                  required
                  style={formInputStyle}
                />
              </div>
              <button
                type="submit"
                disabled={ideaSubmitting}
                style={{
                  fontFamily: fonts.display,
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: "0.1em",
                  color: colors.shed,
                  backgroundColor: colors.goldenHour,
                  border: "none",
                  padding: "16px 0",
                  width: "100%",
                  cursor: ideaSubmitting ? "not-allowed" : "pointer",
                  opacity: ideaSubmitting ? 0.6 : 1,
                }}
              >
                {ideaSubmitting ? "SENDING..." : "SEND IT"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ─── SIGNUP FORM / THANK YOU ─── */}
      <section style={{
        backgroundColor: colors.shed,
        padding: isMobile ? "0 28px 60px" : "0 40px 80px",
      }}>
        <div style={{
          maxWidth: 480,
          margin: "0 auto",
          borderTop: `1px solid rgba(245,240,232,0.1)`,
          paddingTop: 40,
        }}>
          <h2 style={{
            fontFamily: fonts.display,
            fontWeight: 900,
            fontSize: isMobile ? 18 : 22,
            letterSpacing: "0.08em",
            color: colors.milk,
            textAlign: "center",
            margin: "0 0 8px",
          }}>
            LOOKING FOR YOUR PORTRAIT?
          </h2>
          <p style={{
            fontFamily: fonts.body,
            fontSize: isMobile ? 14 : 15,
            color: colors.milk,
            opacity: 0.5,
            textAlign: "center",
            margin: "0 0 28px",
            lineHeight: 1.6,
          }}>
            Had your portrait taken at The Harvest? Leave your details and we'll track it down for you.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ textAlign: "center", padding: "20px 0" }}
            >
              <h3 style={{
                fontFamily: fonts.display,
                fontWeight: 900,
                fontSize: isMobile ? 24 : 32,
                letterSpacing: "0.08em",
                color: colors.milk,
                margin: "0 0 16px",
              }}>
                GOT IT
              </h3>
              <p style={{
                fontFamily: fonts.body,
                fontSize: isMobile ? 16 : 18,
                color: colors.milk,
                opacity: 0.7,
                lineHeight: 1.6,
                margin: "0 0 12px",
              }}>
                We have your details and will be in touch about your portrait.
              </p>
            </motion.div>
          ) : (
            <FadeIn>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 20 }}>
                  <label style={formLabelStyle} htmlFor="firstName">YOUR NAME</label>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                    required
                    style={formInputStyle}
                  />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={formLabelStyle} htmlFor="email">EMAIL</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="So we can send your photo"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                    style={formInputStyle}
                  />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={formLabelStyle} htmlFor="phone">PHONE <span style={{ opacity: 0.5 }}>(optional)</span></label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="0400 000 000"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    style={formInputStyle}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    fontFamily: fonts.display,
                    fontWeight: 700,
                    fontSize: 14,
                    letterSpacing: "0.1em",
                    color: colors.shed,
                    backgroundColor: colors.goldenHour,
                    border: "none",
                    padding: "16px 0",
                    width: "100%",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    opacity: isSubmitting ? 0.6 : 1,
                  }}
                >
                  {isSubmitting ? "SAVING..." : "FIND MY PORTRAIT"}
                </button>
              </form>
            </FadeIn>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function resizeImage(file: File, maxWidth = 1920, quality = 0.85): Promise<{ base64: string; contentType: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL("image/jpeg", quality);
      resolve({ base64: dataUrl.split(",")[1], contentType: "image/jpeg" });
    };
    img.onerror = reject;
    img.src = url;
  });
}
