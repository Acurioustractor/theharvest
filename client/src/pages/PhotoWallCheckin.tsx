import { useState, useEffect } from "react";
import { colors, fonts, rootStyle, formInputStyle } from "@/styles/brand";
import { trpc } from "@/lib/trpc";

export default function PhotoWallCheckin() {
  const [contactId, setContactId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    document.title = "Photo Wall Check-in | The Harvest";
    const params = new URLSearchParams(window.location.search);
    setContactId(params.get("id"));
  }, []);

  const contactQuery = trpc.photoWall.getContact.useQuery(
    { contactId: contactId! },
    { enabled: !!contactId },
  );

  const addNoteMutation = trpc.photoWall.addNote.useMutation({
    onSuccess: () => setSaved(true),
  });

  const handleSave = () => {
    if (!contactId || !note.trim()) return;
    addNoteMutation.mutate({ contactId, note: note.trim() });
  };

  const name = [contactQuery.data?.firstName, contactQuery.data?.lastName]
    .filter(Boolean)
    .join(" ");

  if (!contactId) {
    return (
      <div style={{ ...rootStyle, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <p style={{ fontFamily: fonts.body, color: colors.milk, opacity: 0.5 }}>No contact ID provided.</p>
      </div>
    );
  }

  return (
    <div style={{
      ...rootStyle,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      padding: "40px 24px",
    }}>
      <p style={{
        fontFamily: fonts.display,
        fontWeight: 900,
        fontSize: 11,
        letterSpacing: "0.15em",
        color: colors.goldenHour,
        margin: "0 0 8px",
      }}>
        PHOTO WALL CHECK-IN
      </p>

      {contactQuery.isLoading && (
        <p style={{ fontFamily: fonts.body, color: colors.milk, opacity: 0.5 }}>Loading...</p>
      )}

      {contactQuery.isError && (
        <p style={{ fontFamily: fonts.body, color: colors.calendula, fontSize: 14 }}>
          {contactQuery.error.message}
        </p>
      )}

      {contactQuery.data && (
        <div style={{ textAlign: "center", width: "100%", maxWidth: 400 }}>
          <h1 style={{
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: 32,
            color: colors.milk,
            margin: "0 0 24px",
          }}>
            {name || "Guest"}
          </h1>

          {saved ? (
            <p style={{
              fontFamily: fonts.body,
              fontSize: 16,
              color: colors.goldenHour,
              margin: "20px 0",
            }}>
              Noted! Send their photo later.
            </p>
          ) : (
            <>
              <textarea
                placeholder="Notes (e.g. blue shirt, couple portrait)"
                value={note}
                onChange={e => setNote(e.target.value)}
                rows={3}
                style={{
                  ...formInputStyle,
                  fontSize: 14,
                  padding: "12px 14px",
                  width: "100%",
                  resize: "vertical",
                  boxSizing: "border-box",
                }}
              />
              <button
                onClick={handleSave}
                disabled={addNoteMutation.isPending || !note.trim()}
                style={{
                  fontFamily: fonts.display,
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: "0.1em",
                  color: colors.shed,
                  backgroundColor: colors.goldenHour,
                  border: "none",
                  padding: "12px 32px",
                  cursor: addNoteMutation.isPending ? "wait" : "pointer",
                  opacity: addNoteMutation.isPending || !note.trim() ? 0.5 : 1,
                  marginTop: 12,
                  width: "100%",
                }}
              >
                {addNoteMutation.isPending ? "SAVING..." : "SAVE NOTE"}
              </button>
              {addNoteMutation.isError && (
                <p style={{ fontFamily: fonts.body, fontSize: 12, color: colors.calendula, margin: "8px 0 0" }}>
                  {addNoteMutation.error.message}
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
