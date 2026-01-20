import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Facebook, Twitter, Linkedin, Link2, Mail } from "lucide-react";

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
  variant?: "default" | "compact";
}

export default function ShareButtons({
  url,
  title,
  description,
  className,
  variant = "default",
}: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || "");

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const openShareWindow = (shareUrl: string) => {
    window.open(shareUrl, "_blank", "width=600,height=400,noopener,noreferrer");
  };

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-stone-500 hover:text-blue-600 hover:bg-blue-50"
          onClick={() => openShareWindow(shareLinks.facebook)}
          title="Share on Facebook"
        >
          <Facebook className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-stone-500 hover:text-sky-500 hover:bg-sky-50"
          onClick={() => openShareWindow(shareLinks.twitter)}
          title="Share on X (Twitter)"
        >
          <Twitter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-stone-500 hover:text-blue-700 hover:bg-blue-50"
          onClick={() => openShareWindow(shareLinks.linkedin)}
          title="Share on LinkedIn"
        >
          <Linkedin className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-stone-500 hover:text-stone-700 hover:bg-stone-100"
          onClick={copyToClipboard}
          title="Copy link"
        >
          <Link2 className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <p className="text-sm font-medium text-stone-700">Share this article</p>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
          onClick={() => openShareWindow(shareLinks.facebook)}
        >
          <Facebook className="h-4 w-4" />
          Facebook
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 hover:bg-sky-50 hover:text-sky-500 hover:border-sky-200"
          onClick={() => openShareWindow(shareLinks.twitter)}
        >
          <Twitter className="h-4 w-4" />
          Twitter
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
          onClick={() => openShareWindow(shareLinks.linkedin)}
        >
          <Linkedin className="h-4 w-4" />
          LinkedIn
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200"
          onClick={() => window.location.href = shareLinks.email}
        >
          <Mail className="h-4 w-4" />
          Email
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={copyToClipboard}
        >
          <Link2 className="h-4 w-4" />
          Copy Link
        </Button>
      </div>
    </div>
  );
}
