import { useState, useEffect, useRef } from "react";
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
  const utils = trpc.useUtils();

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Fetch saved override (if any) for this slot
  const { data: savedContent } = trpc.content.get.useQuery(
    { page, slot },
    { staleTime: 30_000 },
  );

  // Mutation to upsert content
  const updateMutation = trpc.content.update.useMutation({
    onSuccess: () => {
      utils.content.get.invalidate({ page, slot });
      utils.content.forPage.invalidate({ page });
    },
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

  const saving = updateMutation.isPending;

  const saveContent = async () => {
    if (editValue === displayContent) {
      setIsEditing(false);
      return;
    }

    try {
      await updateMutation.mutateAsync({
        page,
        slot,
        content: editValue,
        contentType: multiline ? "markdown" : "text",
      });
      onContentChange?.(editValue);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save content:", error);
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
  if (!isAdmin) {
    return <Component className={className}>{displayContent}</Component>;
  }

  // Admin: always-visible edit affordance — click anywhere on the text or the pencil chip.
  return (
    <div className="relative group">
      <Component
        className={cn(className, "cursor-text hover:bg-amber-50/40 rounded-sm transition-colors")}
        onClick={startEditing}
      >
        {displayContent}
      </Component>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          startEditing();
        }}
        className="absolute -top-2 -right-2 z-10 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-900 shadow-md text-[10px] font-mono uppercase tracking-wider font-semibold"
        title="Edit text"
      >
        <Pencil className="h-3 w-3" />
        Edit
      </button>
    </div>
  );
}

/**
 * Hook to fetch all content for a page at once
 * Useful for pages with many editable fields
 */
export function usePageContent(page: string) {
  const { data, isLoading, refetch } = trpc.content.forPage.useQuery(
    { page },
    { staleTime: 30_000 },
  );

  const contentMap = new Map<string, string>();
  data?.forEach((item) => {
    contentMap.set(item.slot, item.content);
  });

  const getContent = (slot: string, defaultValue: string) => {
    return contentMap.get(slot) ?? defaultValue;
  };

  return { getContent, isLoading, refetch, contentMap };
}
