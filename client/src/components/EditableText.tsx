import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";

interface EditableTextProps {
  /** The page this content belongs to (e.g., "journey", "home") */
  page: string;
  /** The slot identifier for this content (e.g., "hero-title", "event-1-title") */
  slot: string;
  /** Default content to display if no saved content exists */
  defaultContent: string;
  /** The HTML element type to render */
  as?: "p" | "h1" | "h2" | "h3" | "h4" | "span" | "div";
  /** CSS classes for the text element */
  className?: string;
  /** Whether this is multiline content (uses textarea vs input) */
  multiline?: boolean;
  /** Callback when content changes */
  onContentChange?: (content: string) => void;
}

/**
 * EditableText component that displays text content and allows
 * admins to edit it inline by clicking.
 */
export function EditableText({
  page,
  slot,
  defaultContent,
  as: Component = "p",
  className,
  multiline = false,
  onContentChange,
}: EditableTextProps) {
  const { isAuthenticated, user } = useAuth();
  const isAdmin = isAuthenticated && user?.role === "admin";
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Fetch content from database using vanilla client pattern
  const { data: savedContent, refetch } = useQuery({
    queryKey: ["content", page, slot],
    queryFn: () => trpc.content.get.query({ page, slot }),
    staleTime: 30000,
  });

  const displayContent = savedContent?.content ?? defaultContent;

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const startEditing = () => {
    setEditValue(displayContent);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditValue("");
  };

  const saveContent = async () => {
    if (editValue === displayContent) {
      setIsEditing(false);
      return;
    }

    setSaving(true);
    try {
      await trpc.content.update.mutate({
        page,
        slot,
        content: editValue,
        contentType: multiline ? "markdown" : "text",
      });
      refetch();
      onContentChange?.(editValue);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save content:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      saveContent();
    }
    if (e.key === "Escape") {
      cancelEditing();
    }
  };

  // Editing mode
  if (isEditing) {
    return (
      <div className="relative group">
        {multiline ? (
          <Textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn(
              "min-h-[100px] resize-y",
              className
            )}
            disabled={saving}
          />
        ) : (
          <Input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={className}
            disabled={saving}
          />
        )}
        <div className="absolute -bottom-10 right-0 flex gap-1 z-10">
          <Button
            size="sm"
            variant="default"
            onClick={saveContent}
            disabled={saving}
            className="bg-green-600 hover:bg-green-700 h-8"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={cancelEditing}
            disabled={saving}
            className="h-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Display mode
  return (
    <div className="relative group inline">
      <Component className={className}>
        {displayContent}
      </Component>
      {isAdmin && (
        <button
          onClick={startEditing}
          className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-amber-500 hover:bg-amber-600 text-black rounded-full p-1.5 shadow-lg"
          title="Edit text"
        >
          <Pencil className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

/**
 * Hook to fetch all content for a page at once
 * Useful for pages with many editable fields
 */
export function usePageContent(page: string) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["content", "page", page],
    queryFn: () => trpc.content.forPage.query({ page }),
    staleTime: 30000,
  });

  const contentMap = new Map<string, string>();
  data?.forEach((item) => {
    contentMap.set(item.slot, item.content);
  });

  const getContent = (slot: string, defaultValue: string) => {
    return contentMap.get(slot) ?? defaultValue;
  };

  return { getContent, isLoading, refetch, contentMap };
}
