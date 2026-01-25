import GalleryContent from "@/components/GalleryContent";

// Define the shape of our gallery item
interface GalleryItem {
    _id: string;
    title: string;
    image: string;
    category: string;
}

// Ensure this is treated as a dynamic route/page if needed, though for data fetching usually fine.
// But putting `export const dynamic = 'force-dynamic'` helps if we want real-time updates without building.
export const dynamic = 'force-dynamic';

async function getGalleryItems() {
    try {
        const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/api/gallery`, {
            cache: 'no-store', // Disable cache to see updates immediately
        });
        if (!res.ok) {
            // throw new Error("Failed to fetch gallery items");
            return [];
        }
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Error fetching gallery:", error);
        return [];
    }
}

export default async function GalleryPage() {
    const galleryItems: GalleryItem[] = await getGalleryItems();

    return <GalleryContent galleryItems={galleryItems} />;
}
