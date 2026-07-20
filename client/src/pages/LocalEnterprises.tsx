import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MapPin, Phone, Mail, Globe, Facebook, Instagram, Loader2 } from "lucide-react";
import { LazyImage } from "@/components/LazyImage";
import BusinessRegistrationDialog from "@/components/BusinessRegistrationDialog";
import { SiteFooter, SiteNav } from "./HarvestReviewTest";
import { trpc } from "@/lib/trpc";
import { setPageSeo } from "@/lib/seo";

// Category images mapping
const categoryImages: Record<string, string> = {
  markets: "/images/category-market.jpg",
  arts: "/images/category-arts.jpg",
  accommodation: "/images/accommodation/directory-hero.jpg",
  services: "/images/category-services.jpg",
  food: "/images/category-market.jpg",
  wellness: "/images/category-community.jpg",
  retail: "/images/category-market.jpg",
  other: "/images/enterprises-hero.jpg",
};

const categoryLabels: Record<string, string> = {
  markets: "Markets & Farm Stalls",
  arts: "Arts & Crafts",
  accommodation: "Accommodation",
  services: "Services",
  food: "Food & Beverage",
  wellness: "Wellness & Health",
  retail: "Retail",
  other: "Other",
};

const PAGE_SIZE = 12;

export default function LocalEnterprises() {
  const [searchTerm, setSearchTerm] = useState("");
  const initialCategory = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("category")
    : null;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const {
    data: approvedBusinesses,
    isError,
    isLoading,
    error,
    refetch,
  } = trpc.businesses.list.useQuery();

  useEffect(() => {
    setPageSeo({
      title: "Local Enterprises · The Harvest Witta",
      description:
        "A reviewed directory of local businesses, makers and growers around Witta and Maleny.",
      path: "/enterprises",
    });
  }, []);

  const categories = useMemo(
    () => Array.from(new Set((approvedBusinesses ?? []).map((business) => business.category))),
    [approvedBusinesses],
  );

  const filteredEnterprises = useMemo(() => (approvedBusinesses ?? []).filter((enterprise) => {
    const matchesSearch = enterprise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          enterprise.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? enterprise.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  }), [approvedBusinesses, searchTerm, selectedCategory]);

  const visibleEnterprises = filteredEnterprises.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchTerm, selectedCategory]);

  return (
    <>
      <SiteNav />
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden pt-24 md:pt-20">
        <div className="absolute inset-0 z-0">
          <LazyImage
            src="/images/enterprises-hero.jpg"
            alt="Community gathering"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 container text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 drop-shadow-lg">
            Local Enterprises
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-white/90 font-light">
            A directory of the businesses, makers and growers around Witta and Maleny.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <BusinessRegistrationDialog
              trigger={
                <Button size="lg" className="bg-[#8B4A2A] hover:bg-[#6f3820] text-white border-none">
                  List your business
                </Button>
              }
            />
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-[#f8f5f2]">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-10">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search businesses..."
                type="search"
                name="business-search"
                aria-label="Search local businesses"
                className="pl-10 bg-white border-[#e0e0e0]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2 justify-center md:justify-end">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
                className={selectedCategory === null ? "bg-[#2c4c3b] text-white" : "border-[#2c4c3b] text-[#2c4c3b]"}
              >
                All
              </Button>
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-[#2c4c3b] text-white" : "border-[#2c4c3b] text-[#2c4c3b]"}
                >
                  {categoryLabels[category] ?? category}
                </Button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center gap-3 py-20 text-stone-600" role="status">
              <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
              Loading reviewed businesses...
            </div>
          ) : isError ? (
            <div className="border border-red-200 bg-red-50 p-6 text-center text-red-900">
              <p className="text-lg font-semibold">The directory did not load.</p>
              <p className="mt-2 text-sm">
                {error?.message || "Please try again in a moment."}
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => refetch()}
                className="mt-4 border-red-700 text-red-800 hover:bg-red-100"
              >
                Try again
              </Button>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleEnterprises.map((enterprise) => (
              <Card key={enterprise.id} className="flex flex-col h-full border-none shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <LazyImage
                    src={enterprise.imageUrl || categoryImages[enterprise.category] || "/images/enterprises-hero.jpg"}
                    alt={enterprise.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="font-serif text-xl text-[#2c4c3b]">{enterprise.name}</CardTitle>
                    <Badge variant="secondary" className="bg-[#2c4c3b]/10 text-[#2c4c3b] shrink-0">
                      {categoryLabels[enterprise.category] ?? enterprise.category}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm text-muted-foreground line-clamp-3">
                    {enterprise.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-600">
                  {enterprise.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#c17c54] shrink-0" />
                      <span className="truncate">{enterprise.address}</span>
                    </div>
                  )}
                  {enterprise.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-[#c17c54] shrink-0" />
                      <a href={`tel:${enterprise.phone}`} className="hover:underline">{enterprise.phone}</a>
                    </div>
                  )}
                  {enterprise.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-[#c17c54] shrink-0" />
                      <a href={`mailto:${enterprise.email}`} className="truncate hover:underline">{enterprise.email}</a>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="mt-auto pt-4 flex gap-2">
                  {enterprise.website && (
                    <Button asChild variant="outline" className="flex-1 border-[#2c4c3b] text-[#2c4c3b] hover:bg-[#2c4c3b] hover:text-white">
                      <a href={enterprise.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4 mr-2" />
                        Website
                      </a>
                    </Button>
                  )}
                  {enterprise.facebook && (
                    <Button asChild size="icon" variant="outline" className="border-[#1877F2] text-[#1877F2] hover:bg-[#1877F2] hover:text-white">
                      <a href={enterprise.facebook} target="_blank" rel="noopener noreferrer" aria-label={`${enterprise.name} on Facebook`}>
                        <Facebook className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {enterprise.instagram && (
                    <Button asChild size="icon" variant="outline" className="border-[#E4405F] text-[#E4405F] hover:bg-[#E4405F] hover:text-white">
                      <a href={enterprise.instagram} target="_blank" rel="noopener noreferrer" aria-label={`${enterprise.name} on Instagram`}>
                        <Instagram className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
          )}

          {!isLoading && !isError && filteredEnterprises.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">
                {searchTerm || selectedCategory
                  ? "No reviewed businesses match those filters."
                  : "The reviewed local directory is being built."}
              </p>
              {searchTerm || selectedCategory ? (
                <Button
                  variant="link"
                  onClick={() => {setSearchTerm(""); setSelectedCategory(null);}}
                  className="mt-2 text-[#c17c54]"
                >
                  Clear filters
                </Button>
              ) : (
                <div className="mt-5">
                  <BusinessRegistrationDialog />
                </div>
              )}
            </div>
          )}
          {visibleCount < filteredEnterprises.length && (
            <div className="mt-10 text-center">
              <Button
                variant="outline"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                className="border-[#2c4c3b] text-[#2c4c3b]"
              >
                Show more businesses
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-[#2c4c3b] text-white text-center">
        <div className="container px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Add a local business</h2>
          <p className="text-lg max-w-2xl mx-auto mb-8 text-white/80">
            Are you a local business owner, maker, or grower? Register your business and we'll add you to the directory.
          </p>
          <BusinessRegistrationDialog
            trigger={
              <Button size="lg" variant="secondary" className="bg-white text-[#2c4c3b] hover:bg-gray-100">
                Register Your Business
              </Button>
            }
          />
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
